let splChart = null;

// Format time without leading zeros
function formatTime(timeStr) {
    // Remove milliseconds if present
    timeStr = timeStr.split('.')[0];
    // Remove leading zeros from hours, but keep them for minutes and seconds
    return timeStr.replace(/^0/, '').replace(/(\d+):(\d+):(\d+)/, function(match, h, m, s) {
        return `${parseInt(h)}:${m}:${s}`;
    });
}

// Initialize the chart with empty data
function initializeChart() {
    const ctx = document.getElementById('splChart').getContext('2d');
    
    // Set default dark theme for Chart.js
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

    splChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Current SPL (LCS)',
                    data: [],
                    borderColor: 'rgb(0, 255, 255)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Min SPL (LCSMin)',
                    data: [],
                    borderColor: 'rgb(0, 191, 255)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Max SPL (LCSMax)',
                    data: [],
                    borderColor: 'rgb(255, 69, 0)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Peak SPL (LZpeak)',
                    data: [],
                    borderColor: 'rgb(255, 215, 0)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Equivalent SPL (LCeq)',
                    data: [],
                    borderColor: 'rgb(218, 112, 214)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            onClick: function(event, elements, chart) {
                if (elements.length > 0) {
                    const element = elements[0];
                    const index = element.index;
                    
                    // Get all values for this time point
                    const time = splChart.data.labels[index];
                    const current = splChart.data.datasets[0].data[index];
                    const min = splChart.data.datasets[1].data[index];
                    const max = splChart.data.datasets[2].data[index];
                    const peak = splChart.data.datasets[3].data[index];
                    const eq = splChart.data.datasets[4].data[index];
                    
                    updatePointData(time, current, min, max, peak, eq);
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                            modifierKey: null,
                            mode: 'x'
                        },
                        pinch: {
                            enabled: true,
                            mode: 'x'
                        },
                        drag: {
                            enabled: true,
                            backgroundColor: 'rgba(127,127,127,0.3)'
                        },
                        speed: 0.1
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        speed: 20,
                        threshold: 10
                    },
                    limits: {
                        y: {
                            min: 50,
                            max: 120,
                            minRange: 20
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 10,
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return formatTime(context[0].label);
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'HH:mm:ss.SSS',
                        unit: 'second',
                        displayFormats: {
                            second: 'H:mm:ss',
                            minute: 'H:mm',
                            hour: 'H:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time of Day',
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawTicks: true,
                        tickLength: 10,
                        display: true
                    },
                    ticks: {
                        color: '#e0e0e0',
                        maxRotation: 0,
                        callback: function(value, index, values) {
                            const time = this.getLabelForValue(value);
                            return time ? formatTime(time) : '';
                        }
                    },
                    adapters: {
                        date: {
                            // Override the date adapter to only use time
                            format: function(time, format) {
                                return formatTime(time);
                            },
                            parse: function(value) {
                                // Parse time string to a format Chart.js can use
                                const [hours, minutes, seconds] = value.split(':');
                                const date = new Date(2000, 0, 1); // Use a fixed date
                                date.setHours(parseInt(hours));
                                date.setMinutes(parseInt(minutes));
                                date.setSeconds(parseFloat(seconds));
                                return date;
                            }
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'SPL (dB)',
                        color: '#e0e0e0'
                    },
                    min: 50,
                    max: 120,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawTicks: true,
                        tickLength: 10,
                        display: true
                    },
                    ticks: {
                        stepSize: 10,
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

// Update point data display
function updatePointData(time, current, min, max, peak, eq) {
    const pointData = document.getElementById('pointData');
    // Always ensure the panel is visible
    pointData.style.display = 'block';
    
    // Update the values
    pointData.querySelector('.time-value').textContent = formatTime(time);
    pointData.querySelector('.current-spl').textContent = current.toFixed(1) + ' dB';
    pointData.querySelector('.min-spl').textContent = min.toFixed(1) + ' dB';
    pointData.querySelector('.max-spl').textContent = max.toFixed(1) + ' dB';
    pointData.querySelector('.peak-spl').textContent = peak.toFixed(1) + ' dB';
    pointData.querySelector('.eq-spl').textContent = eq.toFixed(1) + ' dB';
}

// Parse the REW txt file
function parseREWData(text) {
    console.log("Starting to parse file content");
    
    const lines = text.split('\n');
    console.log("Number of lines in file:", lines.length);
    
    const data = {
        times: [],
        current: [],
        min: [],
        max: [],
        peak: [],
        eq: []
    };

    // Find the header line that starts with "Time[s]"
    let startLine = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('Time[s]')) {
            startLine = i + 1; // Start reading data from the next line
            console.log("Found header at line", i);
            break;
        }
    }

    console.log("Data starts at line:", startLine);
    
    // Process data lines
    for (let i = startLine; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        // Split on whitespace
        const values = line.split(/\s+/);
        if (values.length >= 10) { // Make sure we have all columns including time of day
            const current = parseFloat(values[1]); // LCS
            const min = parseFloat(values[2]);     // LCSMin
            const max = parseFloat(values[3]);     // LCSMax
            const peak = parseFloat(values[4]);    // LZpeak
            const eq = parseFloat(values[5]);      // LCeq
            const timeOfDay = values[9];           // Time of day HH:mm:ss.SSS
            
            if (!isNaN(current) && !isNaN(min) && !isNaN(max) && !isNaN(peak) && !isNaN(eq)) {
                data.times.push(timeOfDay);
                data.current.push(current);
                data.min.push(min);
                data.max.push(max);
                data.peak.push(peak);
                data.eq.push(eq);
            }
        }
    }
    
    console.log("Parsed data points:", data.times.length);
    return data;
}

// Update the chart with new data
function updateChart(data) {
    if (data.times.length === 0) {
        alert("No valid data points found in the file. Please check the file format.");
        return;
    }
    
    splChart.data.labels = data.times;
    splChart.data.datasets[0].data = data.current;
    splChart.data.datasets[1].data = data.min;
    splChart.data.datasets[2].data = data.max;
    splChart.data.datasets[3].data = data.peak;
    splChart.data.datasets[4].data = data.eq;
    splChart.update();
    console.log("Chart updated with", data.times.length, "data points");
}

// Handle file selection
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("Selected file:", file.name);

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log("File loaded successfully");
        const text = e.target.result;
        const data = parseREWData(text);
        
        if (splChart) {
            splChart.destroy();
        }
        
        initializeChart();
        updateChart(data);
    };
    
    reader.onerror = function(e) {
        console.error("Error reading file:", e);
        alert("Error reading file. Please try again.");
    };
    
    reader.readAsText(file);
});

// Initialize empty chart on page load
document.addEventListener('DOMContentLoaded', initializeChart);
