import pymongo

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

# Loop through the documents in the collection and remove the timeline field
for document in collection.find():
    print(document['_id'])
    collection.update_one(
        {'_id': document['_id']},
        {
            '$unset': {'timeline': ''}  # Unset the timeline field
        }
    )
    print(f"Removed 'timeline' field from document {document['_id']}")

# Close the MongoDB connection
client.close()
