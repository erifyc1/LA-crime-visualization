import json
import pandas as pd

csv_file_path = 'Crime_Data_from_2020_to_Present.csv'
json_file_path = 'data.json'

df = pd.read_csv(csv_file_path)
data = df[['DR_NO', 'DATE OCC', 'TIME OCC', 'LOCATION', 'Crm Cd Desc', 'Vict Age', 'Vict Sex', 'LAT', 'LON']]

# Limit the data to the first 10000 rows
data = data.head(10000)

result = data.to_json(orient="records")
parsed = json.loads(result)
json_data = json.dumps(parsed)

# Write the JSON data to a file
with open(json_file_path, 'w') as f:
    f.write(json_data)
