import pymongo

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name_subcounties = 'subcounties'
collection_name_wards = 'wards'

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection_subcounties = db[collection_name_subcounties]
collection_wards = db[collection_name_wards]

# Create a dictionary of subcounty codes and names
subcounty_dict = {}
for document in collection_subcounties.find():
    subcounty_code = document.get('code')  # 'code' is the field for subcounty_id
    subcounty_name = document.get('name')  # Replace 'name' with the actual field name in your subcounty documents
    subcounty_dict[subcounty_code] = subcounty_name
#print(subcounty_dict)

# Loop through the documents in the wards collection and update with the subcounty name
for document in collection_wards.find():
    subcounty_code = str(document.get('subcounty_id'))   # 'subcounty_id' is the field in wards documents
    #print(subcounty_code)
    if subcounty_code in subcounty_dict:
        subcounty_name = subcounty_dict[subcounty_code]
        collection_wards.update_one(
            {'_id': document['_id']},
            {'$set': {'subcounty': subcounty_name}}
        )
        print(f"Updated ward document {document['_id']} with subcounty name {subcounty_name}")

# Close the MongoDB connection
client.close()
