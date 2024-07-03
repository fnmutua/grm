import pymongo
import pandas as pd

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name_subcounties = 'subcounties'

# Load the CSV file with county names and IDs
csv_file_path = './data/counties.csv'  # Replace with your CSV file path
df = pd.read_csv(csv_file_path)

# Convert the DataFrame to a dictionary for quick lookup
county_dict = df.set_index('id')['name'].to_dict()

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection_subcounties = db[collection_name_subcounties]

 
# Loop through the documents in the subcounties collection and update with the county name
for document in collection_subcounties.find():
    county_id = document.get('county_id')
    if county_id in county_dict:
        county_name = county_dict[county_id]
        collection_subcounties.update_one(
            {'_id': document['_id']},
            {'$set': {'county': county_name}}
        )
        print(f"Updated subcounty document {document['_id']} with county name {county_name}")

# Close the MongoDB connection
client.close()
