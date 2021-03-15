import requests

URL = 'http://www.publichealth.lacounty.gov/phcommon/public/media/mediapubhpdetail.cfm?prid=3020'
page = requests.get(URL)
print(page.text)