import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  county_id: {
    type: String,
    required: false,
  },
  subcounty_id: {
    type: String,
    required: false,
  },
  ward_id: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  geometry: {
    type: String,
    required: false,
  },
     
 

}, {
  timestamps: true,
});

// Create a compound index to ensure uniqueness on `complaint`, `name`, and `phone`
dataSchema.index({ name: 1, code: 1  }, { unique: true });

export default model('Settlement', dataSchema);
