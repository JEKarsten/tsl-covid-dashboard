var TSL_BLUE = 'rgb(0, 116, 188)'
var TSL_BLUE_TRANSLUCENT = 'rgba(0, 116, 188, .50)'


$.ajax({
    type: "GET",
    url: "https://raw.githubusercontent.com/JEKarsten/tsl-covid-dashboard/main/data/claremont-cases.csv",
    dataType: "text",
    success: function(data) {processData(data);}
 });


function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    console.log(lines)
    makeChart('chart30', lines, 'month')
    makeChart('chart60', lines, 'day')
}







function makeChart(canvasName, data, timeUnit) {

    var dates = new Array();
    var cases = new Array();

    for (var i = 1; i < data.length; i++) {
        dates.push(Date.parse(data[i][0]));
        cases.push(data[i][1]);
    }

    /* var datesArray =  dates.map( dateString => new Date(dateString) )
    console.log(datesArray)
    console.log(data) */

    var chart = new Chart(canvasName, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                    data: cases,
                    borderColor: TSL_BLUE,
                    backgroundColor: TSL_BLUE_TRANSLUCENT,
                    borderJoinStyle: 'round',
                    pointStyle: 'rect'
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: timeUnit,
                        tooltipFormat: 'MMMM DD, YYYY',
                        displayFormats: {
                            'month': 'MMM \'YY'
                        }
                    },
                    position: 'bottom'
                }]
            },
            tooltips: { 
                position: 'nearest'
                /* callbacks: {
                    label: function(tooltipItem, data) {
                        return "Daily Ticket Sales: $ " + tooltipItem.yLabel;
                    },
                } */
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        },
    });

    chart.render();
}
