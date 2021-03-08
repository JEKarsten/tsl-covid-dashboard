import csv
import datetime
import os
import requests

# Initializes global variables
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Updates CSV file from L.A. Times repository
dataPlacesURL = 'https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-place-totals.csv'
r = requests.get(dataPlacesURL, allow_redirects = True)
with open(os.path.join(ROOT_DIR, 'data/latimes-place-totals.csv'), 'wb') as urlCSV:
    urlCSV.write(r.content)

# Initializes list of Claremont cases
claremontData = []

with open(os.path.join(ROOT_DIR, 'data/latimes-place-totals.csv'), newline = '') as dataPlacesCSV:
    # Initializes reader
    placesReader = csv.reader(dataPlacesCSV, delimiter = ',')

    # Creates dictionary of CSV header row & assigns necessary columns as variables
    headerRow, headerD = next(placesReader), {}
    for col in range(len(headerRow)):
        headerD[headerRow[col]] = col
    colID, colDate, colCases, colPopulation = headerD['id'], headerD['date'], headerD['confirmed_cases'], headerD['population']
    
    # Iterates through CSV and appends select columns from each Claremont row to list
    for row in placesReader:
        if row[colID] == 'City of Claremont':
            claremontData.append([row[colDate], int(row[colCases]), None, int(row[colPopulation])])

# Reverses list of Claremont cases
claremontData.reverse()

# Overwrites (or creates) Claremont cases CSV file through a list
with open(os.path.join(ROOT_DIR, 'data/claremont-cases.csv'), 'w', newline = '') as dataClaremontCSV:
    # Initializes writer and writes header row
    claremontWriter = csv.writer(dataClaremontCSV, delimiter = ',')
    claremontWriter.writerow(['date', 'cases', 'new_cases', 'cases_per_10k', 'cases_last_14_days', 'avg_cases_last_14_days', 'population'])

    # Initializes calculation variables
    previousDayCases = 0
    previous14DayCases = 0

    # Copies values from list to CSV file while doing calculations
    for i in range(len(claremontData)):
        # Sets calculation variables
        claremontData[i][2] = claremontData[i][1] - previousDayCases
        previous14DayCases += claremontData[i][2]
        if i >= 14: previous14DayCases -= claremontData[i-14][2]
        
        # Writes row of CSV file
        claremontWriter.writerow([claremontData[i][0],                                          # date
                                  claremontData[i][1],                                          # cases
                                  claremontData[i][2],                                          # new cases
                                  round(claremontData[i][1] / claremontData[i][3] * 10000),     # cases per 10k
                                  previous14DayCases,                                           # cases in the last 14 days
                                  round(previous14DayCases / 14),                               # average cases in the last 14 days
                                  claremontData[i][3]])                                         # population
        
        # Sets previous day cases variable
        previousDayCases = claremontData[i][1]

""" with open(os.path.join(ROOT_DIR,'timestamp-log.txt'), 'a', newline = '') as test:
    test.write('\n' + str(datetime.datetime.now())) """