// Grabs the Claremont cases CSV from the GitHub repo, then loads this text into processData()
$.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/JEKarsten/tsl-covid-dashboard/main/data/claremont-cases.csv',
    dataType: 'text',
    success: function(text) { processData(text); }
});
