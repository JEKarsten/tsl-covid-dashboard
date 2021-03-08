var TSL_BLUE = 'rgb(0, 116, 188)';
var TSL_PEBBLE = 'rgb(110, 110, 110)';
var TSL_MALIBU = 'rgb(105, 179, 227)';
var TSL_BLUE_TRANSLUCENT = 'rgba(0, 116, 188, .50)';
var TSL_PEBBLE_TRANSLUCENT = 'rgba(110, 110, 110, .50)';
var TSL_MALIBU_TRANSLUCENT = 'rgba(105, 179, 227, .50)';

var DATA_ARRAY = [];
var DATA_ARRAY_30 = [];

var DATES_ALL_TIME = [];
var CASES_TOTAL_ALL_TIME = [];
var CASES_NEW_ALL_TIME = [];
var CASES_14_AVG_ALL_TIME = [];

var DATES_30_DAYS = [];
var CASES_TOTAL_30_DAYS = [];
var CASES_NEW_30_DAYS = [];
var CASES_14_AVG_30_DAYS = [];

var UNIT_ALL_TIME = 'month';
var UNIT_30_DAYS = 'day';

var CHART;

$.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/JEKarsten/tsl-covid-dashboard/main/data/claremont-cases.csv',
    dataType: 'text',
    success: function(data) { processData(data); }
});


$("#month").click(function() {
    CHART.options.scales.xAxes[0].time.unit = UNIT_30_DAYS;
    var data = CHART.config.data;
    data.labels = DATES_30_DAYS;
    data.datasets[0].data = CASES_TOTAL_30_DAYS;
    data.datasets[1].data = CASES_NEW_30_DAYS;
    data.datasets[2].data = CASES_14_AVG_30_DAYS;
    CHART.update();
});
$("#all-time").click(function() {
    CHART.options.scales.xAxes[0].time.unit = UNIT_ALL_TIME;
    var data = CHART.config.data;
    data.labels = DATES_ALL_TIME;
    data.datasets[0].data = CASES_TOTAL_ALL_TIME;
    data.datasets[1].data = CASES_NEW_ALL_TIME;
    data.datasets[2].data = CASES_14_AVG_ALL_TIME;
    CHART.update();
});



function processData(allText) {
    var allRows = allText.split(/\r\n|\n/);
    var headers = allRows[0].split(',');

    for (var i = 1; i < allRows.length; i++) {
        var row = allRows[i].split(',');
        if (row.length == headers.length) {

            currentCasesNew = row[2];
            if (currentCasesNew < 0) { currentCasesNew = null; }

            DATES_ALL_TIME.push(row[0]);
            CASES_TOTAL_ALL_TIME.push(row[1]);
            CASES_NEW_ALL_TIME.push(currentCasesNew);
            CASES_14_AVG_ALL_TIME.push(row[5]);

            if (i >= allRows.length - 31) {
                DATES_30_DAYS.push(row[0]);
                CASES_TOTAL_30_DAYS.push(row[1]);
                CASES_NEW_30_DAYS.push(currentCasesNew);
                CASES_14_AVG_30_DAYS.push(row[5]);
            }



        }
    }

    /* console.log(DATES_ALL_TIME);
    console.log(CASES_TOTAL_ALL_TIME);
    console.log(CASES_NEW_ALL_TIME);
    console.log(CASES_14_AVG_ALL_TIME);
    console.log(DATES_30_DAYS);
    console.log(CASES_TOTAL_30_DAYS);
    console.log(CASES_NEW_30_DAYS);
    console.log(CASES_14_AVG_30_DAYS); */
    makeChart(UNIT_30_DAYS, DATES_30_DAYS, CASES_TOTAL_30_DAYS, CASES_NEW_30_DAYS, CASES_14_AVG_30_DAYS);
}

function makeChart(timeUnit, dates, casesTotal, casesNew, cases14Avg) {
    CHART = new Chart('chart-month', {
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
            }
        },
    });
    CHART.render();
}
