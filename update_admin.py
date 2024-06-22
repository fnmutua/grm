import pymongo
import geopandas as gpd

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Load the GeoJSON file with settlement features
geojson_file_path = './data/settlement.geojson'  # Replace with your GeoJSON file path
geo_df = gpd.read_file(geojson_file_path)

# Convert the GeoDataFrame to a dictionary for quick lookup
settlement_dict = geo_df.set_index('id').to_dict('index')

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

print(settlement_dict)

# Loop through the documents in the collection and update the county, ward, and sub-county IDs
for document in collection.find():
    # Replace settlement ID with corresponding county, ward, and sub-county IDs
    settlement_id = int(document.get('settlement_id', 0))  # Convert settlement_id to integer
    
    if settlement_id in settlement_dict:
        #print(settlement_id)
        county_id = settlement_dict[settlement_id]['county_id']
        ward_id = settlement_dict[settlement_id]['ward_id']
        subcounty_id = settlement_dict[settlement_id]['subcounty_id']
        
        collection.update_one(
            {'_id': document['_id']},
            {'$set': {
                'county': county_id,
                'ward': ward_id,
                'subcounty': subcounty_id
            }}
        )
        print(f"Updated document {document['_id']} with county_id {county_id}, ward_id {ward_id}, subcounty_id {subcounty_id}")

# Close the MongoDB connection
client.close()
