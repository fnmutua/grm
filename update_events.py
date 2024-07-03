import pymongo
import json
from datetime import datetime, timedelta
import random

# MongoDB connection string and database details
mongo_string = 'mongodb://mongo:qSzGetCNmUkNbwAYfzlqbWzReaoLOFAd@roundhouse.proxy.rlwy.net:20599'
database_name = 'grm'
collection_name = 'grievances'

# Connect to MongoDB
client = pymongo.MongoClient(mongo_string)
db = client[database_name]
collection = db[collection_name]

# Function to add random days to a date
def add_random_days(date, min_days=10, max_days=45):
    random_days = random.randint(min_days, max_days)
    return date + timedelta(days=random_days)

# Loop through the documents in the collection and update the timeline field
for document in collection.find():
    try:
        updates = []
        # Check if the document has a 'createdAt' field
        if 'createdAt' in document:
            creation_date = document['createdAt']
            
            # Create a new object with the creation date, converting datetime to string with 'Z'
            creation_entry = {
                'date': creation_date.isoformat() + 'Z',  # Ensure 'Z' at the end for UTC time
                'action': 'Created',
                'mode': 'Web',
                'status':'Open',
                'actor': 'Complainant'
            }
            updates.append(json.dumps(creation_entry))
        else:
            # Handle the case when 'createdAt' is not in the document
            nowdate = datetime()
            now_entry = {
                'date': nowdate.isoformat() + 'Z',  
                'action': 'Created',
                'mode': 'Web',
                'status': 'Open',
                'actor': 'Complainant'
            }
            updates.append(json.dumps(now_entry))

        if document.get('status') == 'Resolved':
            # Check if the status of the document is 'resolved'
            if document.get('status') == 'Resolved':
                resolution_date = add_random_days(creation_date)
                resolution_entry = {
                    'date': resolution_date.isoformat() + 'Z',
                    'action': 'Resolved',
                    'status': 'Resolved',
                    'mode': 'System',
                    'actor': 'System'
                }
                updates.append(json.dumps(resolution_entry))

        if document.get('status') == 'Escalated':
            resolution_date = add_random_days(creation_date)
            escalated = {
                'date': resolution_date.isoformat() + 'Z',
                'action': 'Escalated',
                'status': 'Escalated',
                'mode': 'System',
                'actor': 'System'
            }
            updates.append(json.dumps(escalated))

        if document.get('status') == 'Investigate':
            resolution_date = add_random_days(creation_date)
            resolution_entry = {
                'date': resolution_date.isoformat() + 'Z',
                'action': 'Investigate',
                'status': 'Investigate',
                'mode': 'System',
                'actor': 'System'
            }
            updates.append(json.dumps(resolution_entry))
        if document.get('status') == 'Open':
            cdate = (creation_date)
            open_entry = {
                'date': cdate.isoformat() + 'Z',
                'action': 'Created',
                'status': 'Open',
                'mode': 'Web',
                'actor': 'Complainant'
            }
            updates.append(json.dumps(open_entry))
  

            # Update the document to push to the 'timeline' array and remove the 'history' field
        if updates:
            collection.update_one(
                {'_id': document['_id']},
                {

                    '$push': {'timeline': {'$each': updates}}  
                    #'$set': {'timeline': updates},
                }
            )
            print(f"Updated document {document['_id']} with new timeline entries {updates}")
    except Exception as e:
        print(f"Failed to update document {document['_id']}: {e}")

# Close the MongoDB connection
client.close()
