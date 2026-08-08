const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;


const db = new Database("flowerbase.db")

app.use(express.json());
app.use(express.static(__dirname));

//db setup
db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        watering_interval INTEGER NOT NULL DEFAULT 24,
        moisture_threshold INTEGER NOT NULL DEFAULT 25,
        watering_amount INTEGER NOT NULL DEFAULT 500,
        watering_mode TEXT NOT NULL DEFAULT 'moisture'
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        soil_moisture REAL NOT NULL,
        tank_level REAL NOT NULL,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS watering_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount_ml INTEGER NOT NULL,
        method TEXT NOT NULL,
        watered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS device (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        device_name TEXT,
        device_id TEXT,
        last_seen DATETIME
    );
`);

//default settings row if doesnt exist
db.prepare(`
    INSERT OR IGNORE INTO settings
    (id, watering_interval, moisture_threshold, watering_amount, watering_mode)
    VALUES (1, 24, 25, 500, 'moisture')
`).run();

//default device row if doesnt exist
db.prepare(`
    INSERT OR IGNORE INTO device
    (id, device_name, device_id)
    VALUES (1, 'Flowerbase ESP32', NULL)
`).run();



//gets settings
app.get("/api/settings", (req, res) => {
    const settings = db.prepare(`
        SELECT *
        FROM settings
        WHERE id = 1    
    `).get();

    res.json(settings);
});

//saves settings
app.put("/api/settings", (req, res) => {
    const {
        watering_interval,
        moisture_threshold,
        watering_amount,
        watering_mode,
    } = req.body;

    if (
        !Number.isInteger(watering_interval) ||
        watering_interval < 1
    ) {
        return res.status(400).json({
            error: "Invalid watering interval"
        })
    }

    if (
        !Number.isInteger(moisture_threshold) ||
        moisture_threshold < 5 ||
        moisture_threshold > 100
    ) return res.status(400).json({
        error: "Invalid moisture threshold"
    });

    if (
        !Number.isInteger(watering_amount) ||
        watering_amount < 100 ||
        watering_amount > 2000
    ) return res.status(400).json({
        error: "Invalid watering amount"
    })

    if (
        watering_mode !== "interval" &&
        watering_mode !== "moisture"
    ) {
        return res.status(400).json ({
            error: "Invalid watering mode"
        });
    }

    db.prepare(`
        UPDATE settings
        SET
            watering_interval = ?,
            moisture_threshold = ?,
            watering_amount = ?,
            watering_mode = ?
        WHERE id = 1
    `).run(
        watering_interval,
        moisture_threshold,
        watering_amount,
        watering_mode
    );

    const settings = db.prepare(`
        SELECT *
        FROM settings
        WHERE id = 1    
    `).get();

    res.json(settings);
});


//recieve sensor data
app.post("/api/readings", (req, res) => {
    const {
        soil_moisture,
        tank_level
    } = req.body;

    if (
        typeof soil_moisture !== "number" ||
        typeof tank_level !== "number"
    ) {
        return res.status(400).json({
            error: "Invalid sensor data"
        });
    }

    const result = db.prepare(`
        INSERT INTO sensor_readings
        (soil_moisture, tank_level)
        VALUES (?, ?)
    `).run(
        soil_moisture,
        tank_level
    )

    res.json({
        success: true,
        id: result.lastInsertRowid
    });
});

//gets all sensor data
app.get("/api/readings", (req, res) => {
    const readings = db.prepare(`
        SELECT *
        FROM sensor_readings
        ORDER BY recorded_at ASC
    `).all();

    res.json(readings);
});
//get latest sensor data
app.get("/api/readings/latest", (req, res) => {
    const reading = db.prepare(`
        SELECT *
        FROM sensor_readings
        ORDER BY recorded_at DESC
        LIMIT 1
    `).get();

    res.json(reading);
})
//gets today's sensor data grouped by hour
app.get("/api/readings/today", (req, res) => {
    
    const readings = db.prepare(`
        SELECT
            strftime('%H', recorded_at, 'localtime') AS hour,
            AVG(soil_moisture) AS avg_soil_moisture
        FROM sensor_readings
        WHERE date(recorded_at, 'localtime') = date('now', 'localtime')
        GROUP BY hour
        ORDER BY hour ASC
    `).all();

    res.json(readings);
});

//record watering
app.post("/api/watering", (req, res) => {
    const {
        amount_ml,
        method
    } = req.body;

    if (
        !Number.isInteger(amount_ml) ||
        amount_ml < 100 ||
        amount_ml > 2000
    ) {
        return res.status(400).json({
            error: "Invalid watering amount"
        });
    }

    if (
        method !== "manual" &&
        method !== "automatic"
    ) {
        return res.status(400).json({
            error: "Invalid watering method"
        });
    }

    const result = db.prepare(`
        INSERT INTO watering_events
        (amount_ml, method)
        VALUES (?, ?)
    `).run(
        amount_ml,
        method
    );

    res.json({
        success: true,
        id: result.lastInsertRowid
    });
});


//esp32 gets settings
app.get("/api/esp32/settings", (req, res) => {
    const settings = db.prepare(`
        SELECT
            watering_interval,
            moisture_threshold,
            watering_amount,
            watering_mode
        FROM settings
        WHERE id = 1
    `).get();

    res.json(settings);
});

//esp32 report itself
app.post("/api/esp32/heartbeat", (req, res) => {
    const {
        device_id
    } = req.body;

    if (!device_id) {
        return res.status(400).json({
            error: "Missing device ID"
        });
    }

    db.prepare(`
        UPDATE device
        SET
            device_id = ?,
            last_seen = CURRENT_TIMESTAMP
        WHERE id = 1
    `).run(device_id);

    res.json({
        success: true
    });
});


//start server
app.listen(PORT, () => {
    console.log(`FLOWERBASE server running at http://localhost:${PORT}`);
});
