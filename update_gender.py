import pymongo
import random

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Function to generate a random gender
def random_gender():
    """Generate a random value ('Yes' or 'No')"""
    return random.choice(['No', 'Yes'])

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

# Loop through the documents in the collection and add the new field
for document in collection.find():
    # Generate random gender if `gender` field doesn't exist
    if 'gbv' not in document:
        random_gender_value = random_gender()
        collection.update_one(
            {'_id': document['_id']},
            {'$set': {'gbv': random_gender_value}}
        )
        print(f"Updated document {document['_id']} with random gbv {random_gender_value}")

# Close the MongoDB connection
client.close()
