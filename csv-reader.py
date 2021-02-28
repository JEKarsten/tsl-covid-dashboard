import csv

dataPlacesURL = 'https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-place-totals.csv'

with open('2-28-latimes-place-totals.csv', newline = '') as dataPlacesCSV:
    placesReader = csv.reader(dataPlacesCSV, delimiter = ',')
    print(placesReader[0][1])
    #for row in placesReader:
        #if row[]