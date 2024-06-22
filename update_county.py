import pymongo
import pandas as pd

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Load the CSV file with county names and IDs
csv_file_path = './data/counties.csv'  # Replace with your CSV file path
df = pd.read_csv(csv_file_path)

# Convert the DataFrame to a dictionary for quick lookup
dict = df.set_index('id')['name'].to_dict()

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

# Loop through the documents in the collection and update the county name
for document in collection.find():
    # Replace county ID with county name
    admin_id = (document.get('county'))
 
    print(admin_id)
    if admin_id in dict:
        admin_name = dict[admin_id]
        collection.update_one(
            {'_id': document['_id']},
            {'$set': {'county': admin_name}}
        )
        print(f"Updated document {document['_id']} with   name {admin_name}")

# Close the MongoDB connection
client.close()
