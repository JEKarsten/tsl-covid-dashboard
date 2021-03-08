// Sets global color variables
var TSL_BLUE = 'rgb(0, 116, 188)';
var TSL_PEBBLE = 'rgb(110, 110, 110)';
var TSL_MALIBU = 'rgb(105, 179, 227)';
var TSL_BLUE_TRANSLUCENT = 'rgba(0, 116, 188, .50)';
var TSL_PEBBLE_TRANSLUCENT = 'rgba(110, 110, 110, .50)';
var TSL_MALIBU_TRANSLUCENT = 'rgba(105, 179, 227, .50)';

// Sets global data arrays for all data
var DATES_ALL_TIME = [];
var CASES_TOTAL_ALL_TIME = [];
var CASES_NEW_ALL_TIME = [];
var CASES_14_AVG_ALL_TIME = [];

// Sets global data arrays for datat from the last 30 days
var DATES_30_DAYS = [];
var CASES_TOTAL_30_DAYS = [];
var CASES_NEW_30_DAYS = [];
var CASES_14_AVG_30_DAYS = [];

// Sets global variables to construct the chart
var CHART;
var UNIT_ALL_TIME = 'month';
var UNIT_30_DAYS = 'day';
var CHART_ANIMATION_DURATION = 450;



// Updates chart to display the last 30 days when user clicks corresponding button
$('#month').click(function() {
    CHART.options.animation.duration = 0;
    CHART.options.scales.xAxes[0].time.unit = UNIT_30_DAYS;
    var data = CHART.config.data;
    data.datasets[0].data = CASES_TOTAL_30_DAYS;
    data.datasets[1].data = CASES_NEW_30_DAYS;
    data.datasets[2].data = CASES_14_AVG_30_DAYS;
    data.labels = DATES_30_DAYS;
    CHART.update();
    CHART.options.animation.duration = CHART_ANIMATION_DURATION;
    CHART.update();
});

// Updates chart to display all data when user clicks corresponding button
$('#all-time').click(function() {
    CHART.options.animation.duration = 0;
    CHART.options.scales.xAxes[0].time.unit = UNIT_ALL_TIME;
    var data = CHART.config.data;
    data.datasets[0].data = CASES_TOTAL_ALL_TIME;
    data.datasets[1].data = CASES_NEW_ALL_TIME;
    data.datasets[2].data = CASES_14_AVG_ALL_TIME;
    data.labels = DATES_ALL_TIME;
    CHART.update();
    CHART.options.animation.duration = CHART_ANIMATION_DURATION;
    CHART.update();
});

// Grabs the Claremont cases CSV from the GitHub repo, then loads this text into processData()
$.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/JEKarsten/tsl-covid-dashboard/main/data/claremont-cases.csv',
    dataType: 'text',
    success: function(text) { processData(text); }
});


/**
 * Parses text from a CSV and pushes entries into global arrays that will be utilized in a Chart;
 * calls makeChart() to create the chart with only the final 30 days
 * @param {String} text Text from a CSV that will be parsed
 */
function processData(text) {
    var allRows = text.split(/\r\n|\n/);
    var headers = allRows[0].split(',');

    for (let i = 1; i < allRows.length; i++) {
        var row = allRows[i].split(',');
        if (row.length == headers.length) {

            currentCasesNew = parseInt(row[2]);
            if (currentCasesNew < 0) { currentCasesNew = null; }

            DATES_ALL_TIME.push(row[0]);
            CASES_TOTAL_ALL_TIME.push(parseInt(row[1]));
            CASES_NEW_ALL_TIME.push(currentCasesNew);
            CASES_14_AVG_ALL_TIME.push(parseInt(row[5]));

            if (i >= allRows.length - 31) {
                DATES_30_DAYS.push(row[0]);
                CASES_TOTAL_30_DAYS.push(parseInt(row[1]));
                CASES_NEW_30_DAYS.push(currentCasesNew);
                CASES_14_AVG_30_DAYS.push(parseInt(row[5]));
            }
        }
    }

    makeChart(UNIT_30_DAYS, DATES_30_DAYS, CASES_TOTAL_30_DAYS, CASES_NEW_30_DAYS, CASES_14_AVG_30_DAYS);
}


/**
 * Uses Chart.js to create a line chart displaying the number of COVID-19 cases in Claremont;
 * attaches this to an HTML canvas with the 'covid-cases-chart' id;
 * stores this in the global CHART variable for later modification
 * @param {String} timeUnit The unit of time that will be used on the x-axis
 * @param {String[]} dates An array of dates that span the data
 * @param {Number[]} casesTotal An array of the total number of cases at each date
 * @param {Number[]} casesNew An array of the number of new cases at each date
 * @param {Number[]} cases14Avg An array of the the 14-day case average at each date
 */
function makeChart(timeUnit, dates, casesTotal, casesNew, cases14Avg) {
    console.log(dates)
    console.log(casesNew)
    console.log(cases14Avg)
    CHART = new Chart('covid-cases-chart', {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total cases',
                    data: casesTotal,
                    borderColor: TSL_BLUE,
                    backgroundColor: TSL_BLUE_TRANSLUCENT,
                    borderJoinStyle: 'round',
                    pointStyle: 'circle',
                    pointRadius: 2,
                    hidden: false
                },
                {
                    label: 'New cases',
                    data: casesNew,
                    borderColor: TSL_MALIBU,
                    backgroundColor: TSL_MALIBU_TRANSLUCENT,
                    borderJoinStyle: 'round',
                    pointStyle: 'circle',
                    pointRadius: 2,
                    hidden: true
                },
                {
                    label: '14-day case average',
                    data: cases14Avg,
                    borderColor: TSL_PEBBLE,
                    backgroundColor: TSL_PEBBLE_TRANSLUCENT,
                    borderJoinStyle: 'round',
                    pointStyle: 'circle',
                    pointRadius: 2,
                    hidden: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: timeUnit,
                        tooltipFormat: 'MMMM D, YYYY',
                        displayFormats: {
                            'day': 'MMM D',
                            'month': 'MMM \'YY'
                        }
                    },
                    position: 'bottom',
                    scaleLabel: {
                        display: false,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMax: 10,
                        callback: function(value) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Confirmed COVID-19 Cases'
                    }
                }]
            },
            tooltips: {
                position: 'nearest',
                displayColors: false,
                callbacks: {
                    label: function(tooltipItem, data) {
                        var totalValue = data.datasets[0].data[tooltipItem.index];
                        var newValue = data.datasets[1].data[tooltipItem.index];
                        totalValue = totalValue.toString().split(/(?=(?:...)*$)/).join(',');
                        if (newValue != null) { newValue = newValue.toString().split(/(?=(?:...)*$)/).join(','); }
                        return ['Total cases: ' + totalValue, 'New cases: ' + newValue];
                    },
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: CHART_ANIMATION_DURATION,
                easing: 'easeOutCubic'
            }
        },
    });
    CHART.render();
}
