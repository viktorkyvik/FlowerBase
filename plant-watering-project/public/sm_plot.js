//declare variables for elements in the HTML
const sm_plot_info = document.getElementById("sm_plot_info");
const sm_plot_info_popup = document.getElementById("sm_plot_info_popup");

const week_btn = document.getElementById("week_btn");
const today_btn = document.getElementById("today_btn");

const chartCanvas = document.getElementById("moistureChart");

let moistureChart = null;

//function to get all readings from the server
async function getAllReadings() {

    const response = await fetch("/api/readings");

    if (!response.ok) {
        console.error("Could not load sensor readings");
        return [];
    }

    const readings = await response.json();
    return readings;
}

//function to get last 7 days readings
function getLast7DaysReadings(readings) {

    const now = new Date();

    const days = [];

    for (let i = 6; i >= 0; i--) {

        const day = new Date(now);

        day.setDate(now.getDate() - i);

        days.push({
            date: day,
            readings: []
        });
    }

    for (const reading of readings) {

        const readingDate = new Date(
            reading.recorded_at.replace(" ", "T") + "Z"
        );
        
        for (const day of days) {

            if (
                readingDate.getFullYear() === day.date.getFullYear() &&
                readingDate.getMonth() === day.date.getMonth() && 
                readingDate.getDate() === day.date.getDate()
            ) {
                day.readings.push(reading.soil_moisture);
                break;
            }
        }
    }

    return days;
}

//function to calculate daily averages
function calculateDailyAverages(days) {

    const labels = [];
    const averages = [];

    for (const day of days) {

        const dateLabel = day.date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        labels.push(dateLabel);

        if (day.readings.length === 0) {

            averages.push(null);
            
        } else {

            const total = day.readings.reduce(
                (sum, value) => sum + value,
                0
            );

            const average = total / day.readings.length;

            averages.push(average);
        }
    }

    return {
        labels: labels,
        averages: averages
    };

    }


//function to draw chart
function createChart(labels, values, title) {

    if (moistureChart !== null) {
        moistureChart.destroy();
    }

    moistureChart = new Chart(chartCanvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Soil Moisture (%)",
                data: values,

                borderWidth: 3,

                tension: 0.3,

                spanGaps: true,
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: true,
            
            scales: {

                x: {
                    title: {
                        display: true,
                        text: "Time"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Soil Moisture (%)"
                    },

                    beginAtZero: true,

                    suggestedMax: 100
                }
            },

            plugins: {

                title: {
                    display: true,
                    text: title,
                },

                legend: {
                    display: true,
                }
            }
        }
    });

}

//function to create graph for past week
async function loadWeekData() {
    
    const readings = await getAllReadings();

    const last7DaysReadings = getLast7DaysReadings(readings);

    const dailyData = calculateDailyAverages(last7DaysReadings);

    createChart(
        dailyData.labels,
        dailyData.averages,
        "Average soil moisture - past 7 days"
    );
}

//function to create graph for today
async function loadTodayData() {

    const response = await fetch("/api/readings/today");

    if (!response.ok) {
        console.error("Could not load today's readings");
        return;
    }

    const readings = await response.json();

    const labels = [];
    const values = [];

    for (const reading of readings) {

        labels.push(`${reading.hour}:00`);

        values.push(Number(reading.avg_soil_moisture));
    }

    createChart(
        labels,
        values,
        "Average soil moisture - today"
    );
}

//function to mark currently selected button
function setActiveButton(activeBtn) {
    week_btn.classList.remove("active");
    today_btn.classList.remove("active");
    
    activeBtn.classList.add("active");
}

//creates graph for past week on page load
loadWeekData();
setActiveButton(week_btn);


//buttons
sm_plot_info.addEventListener("click", () => {
    sm_plot_info_popup.showModal();
});
week_btn.addEventListener("click", () => {
    loadWeekData();
    setActiveButton(week_btn);
});
today_btn.addEventListener("click", () => {
    loadTodayData();
    setActiveButton(today_btn);
});
