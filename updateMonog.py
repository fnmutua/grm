import pymongo
import random
from datetime import datetime, timedelta

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Function to generate a random date between two dates
def random_date(start, end):
    """Generate a random datetime between `start` and `end`"""
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86400)  # number of seconds in a day
    return start + timedelta(days=random_days, seconds=random_seconds)

# Define the date range
start_date = datetime(2024, 1, 1)
end_date = datetime(2024, 6, 16)

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

# Loop through the documents in the collection and add the new field
for document in collection.find():
    random_date_value = random_date(start_date, end_date)
    collection.update_one(
        {'_id': document['_id']},
        {'$set': {'date_reported': random_date_value}}
    )
    print(f"Updated document {document['_id']} with random date {random_date_value}")

# Close the MongoDB connection
client.close()
