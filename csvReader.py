import csv

dataPlacesURL = 'https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-place-totals.csv'


with open('2-28-latimes-place-totals.csv', newline = '') as dataPlacesCSV:
    # Initializes reader
    placesReader = csv.reader(dataPlacesCSV, delimiter = ',')

    # Creates dictionary of CSV header row & assigns necessary columns as variables
    headerRow, headerD = next(placesReader), {}
    for col in range(len(headerRow)):
        headerD[headerRow[col]] = col
    colID, colDate, colCases, colPopulation = headerD['id'], headerD['date'], headerD['confirmed_cases'], headerD['population']
    
    # Creates/overwrites Claremont cases CSV file
    with open('claremont-cases.csv', 'w', newline='') as dataClaremontCSV:
        # Initializes writer
        claremontWriter = csv.writer(dataClaremontCSV, delimiter=',')
        claremontWriter.writerow(['date', 'cases', 'new_cases', 'population', 'cases_per_100k'])
        # Iterates through CSV
        for row in placesReader:
            if row[colID] == 'City of Claremont':
                claremontWriter.writerow([row[colDate], row[colCases], None, row[colPopulation], None])