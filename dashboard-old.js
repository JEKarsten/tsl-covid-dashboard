var TSL_BLUE = 'rgb(0, 116, 188)';
var TSL_PEBBLE = 'rgb(110, 110, 110)';
var TSL_MALIBU = 'rgb(105, 179, 227)';
var TSL_BLUE_TRANSLUCENT = 'rgba(0, 116, 188, .50)';
var TSL_PEBBLE_TRANSLUCENT = 'rgba(110, 110, 110, .50)';
var TSL_MALIBU_TRANSLUCENT = 'rgba(105, 179, 227, .50)';

var DATA_ARRAY = [];
var DATA_ARRAY_30 = [];


$.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/JEKarsten/tsl-covid-dashboard/main/data/claremont-cases.csv',
    dataType: 'text',
    success: function(data) { processData(data); }
});


function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var day = [];
            for (var j=0; j<headers.length; j++) {
                day.push(data[j]);
            }
            DATA_ARRAY.push(day);
            if (i >= allTextLines.length - 31) {
                DATA_ARRAY_30.push(day);
            }
        }
    }

    console.log(DATA_ARRAY);
    console.log(DATA_ARRAY_30);
    makeChart('chart-month', DATA_ARRAY_30, 'day');
    makeChart('chart-all-time', DATA_ARRAY, 'month');
}


document.getElementById('month').addEventListener('click', function() {
    document.getElementById('chart-all-time').style.visibility = 'hidden';
    document.getElementById('chart-month').style.visibility = 'visible';
});

document.getElementById('all-time').addEventListener('click', function() {
    document.getElementById('chart-month').style.visibility = 'hidden';
    document.getElementById('chart-all-time').style.visibility = 'visible';
});


function makeChart(canvasName, data, timeUnit) {

    var dates = new Array();
    var casesTotal = new Array();
    var casesNew = new Array();
    var cases14Avg = new Array();

    for (var i = 0; i < data.length; i++) {
        currentDate = data[i][0];
        currentCasesTotal = data[i][2];
        if (currentCasesTotal < 0) { currentCasesTotal = null; }

        dates.push(currentDate);
        casesTotal.push(data[i][1]);
        casesNew.push(currentCasesTotal);
        cases14Avg.push(data[i][5]);
    }

    var chart = new Chart(canvasName, {
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
						newValue = newValue.toString().split(/(?=(?:...)*$)/).join(',');
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

    chart.render();

    console.log(chart);
}
