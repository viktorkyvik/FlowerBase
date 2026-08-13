require("dotenv").config();
const path = require("path");
const express = require("express");
const { createClient } = require("@libsql/client");

const app = express();
const PORT = process.env.PORT || 3000;

// Turso connection - credentials come from environment variables,
// never hardcoded. See .env.example for what you need to set.
const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// db setup - runs once when the server boots
async function setupDatabase() {
    await db.batch(
        [
            `CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                watering_interval INTEGER NOT NULL DEFAULT 24,
                moisture_threshold INTEGER NOT NULL DEFAULT 25,
                watering_amount INTEGER NOT NULL DEFAULT 500,
                watering_mode TEXT NOT NULL DEFAULT 'moisture'
            )`,
            `CREATE TABLE IF NOT EXISTS sensor_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                soil_moisture REAL NOT NULL,
                tank_level REAL NOT NULL,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS watering_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount_ml INTEGER NOT NULL,
                method TEXT NOT NULL,
                watered_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS device (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                device_name TEXT,
                device_id TEXT,
                last_seen DATETIME
            )`,
        ],
        "write"
    );

    // default settings row if it doesn't exist
    await db.execute(`
        INSERT OR IGNORE INTO settings
        (id, watering_interval, moisture_threshold, watering_amount, watering_mode)
        VALUES (1, 24, 25, 500, 'moisture')
    `);

    // default device row if it doesn't exist
    await db.execute(`
        INSERT OR IGNORE INTO device
        (id, device_name, device_id)
        VALUES (1, 'Flowerbase ESP32', NULL)
    `);
}

// gets settings
app.get("/api/settings", async (req, res) => {
    const result = await db.execute("SELECT * FROM settings WHERE id = 1");
    res.json(result.rows[0]);
});

// saves settings
app.put("/api/settings", async (req, res) => {
    const { watering_interval, moisture_threshold, watering_amount, watering_mode } = req.body;

    if (!Number.isInteger(watering_interval) || watering_interval < 1) {
        return res.status(400).json({ error: "Invalid watering interval" });
    }

    if (!Number.isInteger(moisture_threshold) || moisture_threshold < 5 || moisture_threshold > 100) {
        return res.status(400).json({ error: "Invalid moisture threshold" });
    }

    if (!Number.isInteger(watering_amount) || watering_amount < 100 || watering_amount > 2000) {
        return res.status(400).json({ error: "Invalid watering amount" });
    }

    if (watering_mode !== "interval" && watering_mode !== "moisture") {
        return res.status(400).json({ error: "Invalid watering mode" });
    }

    await db.execute({
        sql: `
            UPDATE settings
            SET
                watering_interval = ?,
                moisture_threshold = ?,
                watering_amount = ?,
                watering_mode = ?
            WHERE id = 1
        `,
        args: [watering_interval, moisture_threshold, watering_amount, watering_mode],
    });

    const result = await db.execute("SELECT * FROM settings WHERE id = 1");
    res.json(result.rows[0]);
});

// receive sensor data
app.post("/api/readings", async (req, res) => {
    const { soil_moisture, tank_level } = req.body;

    if (typeof soil_moisture !== "number" || typeof tank_level !== "number") {
        return res.status(400).json({ error: "Invalid sensor data" });
    }

    const result = await db.execute({
        sql: `INSERT INTO sensor_readings (soil_moisture, tank_level) VALUES (?, ?)`,
        args: [soil_moisture, tank_level],
    });

    res.json({ success: true, id: Number(result.lastInsertRowid) });
});

// gets all sensor data
app.get("/api/readings", async (req, res) => {
    const result = await db.execute("SELECT * FROM sensor_readings ORDER BY recorded_at ASC");
    res.json(result.rows);
});

// get latest sensor data
app.get("/api/readings/latest", async (req, res) => {
    const result = await db.execute("SELECT * FROM sensor_readings ORDER BY recorded_at DESC LIMIT 1");
    res.json(result.rows[0] || null);
});

// gets today's sensor data grouped by hour
app.get("/api/readings/today", async (req, res) => {
    const result = await db.execute(`
        SELECT
            strftime('%H', recorded_at, 'localtime') AS hour,
            AVG(soil_moisture) AS avg_soil_moisture
        FROM sensor_readings
        WHERE date(recorded_at, 'localtime') = date('now', 'localtime')
        GROUP BY hour
        ORDER BY hour ASC
    `);
    res.json(result.rows);
});

// record watering
app.post("/api/watering", async (req, res) => {
    const { amount_ml, method } = req.body;

    if (!Number.isInteger(amount_ml) || amount_ml < 100 || amount_ml > 2000) {
        return res.status(400).json({ error: "Invalid watering amount" });
    }

    if (method !== "manual" && method !== "automatic") {
        return res.status(400).json({ error: "Invalid watering method" });
    }

    const result = await db.execute({
        sql: `INSERT INTO watering_events (amount_ml, method) VALUES (?, ?)`,
        args: [amount_ml, method],
    });

    res.json({ success: true, id: Number(result.lastInsertRowid) });
});

// esp32 gets settings
app.get("/api/esp32/settings", async (req, res) => {
    const result = await db.execute(`
        SELECT watering_interval, moisture_threshold, watering_amount, watering_mode
        FROM settings
        WHERE id = 1
    `);
    res.json(result.rows[0]);
});

// esp32 reports itself
app.post("/api/esp32/heartbeat", async (req, res) => {
    const { device_id } = req.body;

    if (!device_id) {
        return res.status(400).json({ error: "Missing device ID" });
    }

    await db.execute({
        sql: `
            UPDATE device
            SET
                device_id = ?,
                last_seen = CURRENT_TIMESTAMP
            WHERE id = 1
        `,
        args: [device_id],
    });

    res.json({ success: true });
});

// start server - only after the database is ready
setupDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`FLOWERBASE server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to set up database:", err);
        process.exit(1);
    });
