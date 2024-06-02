import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  gbv: {
    type: String,
    required: false,
  },
  county: {
    type: String,
    required: false,
  },
  subcounty: {
    type: String,
    required: false,
  },
  ward: {
    type: String,
    required: false,
  },
  settlement: {
    type: String,
    required: false,
  },
  settlement_id: {
    type: String,
    required: false,
  },
  complaint: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  network: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum:  ['Open', 'Review', 'Investigation', 'Resolved','Pending'],
    required: false,
  },
  resolution: {
    type: String,
    enum:  ['Accepted', 'Rejected', 'Pending' ],
    defaultValue:'Pending',
    required: false,
  },

}, {
  timestamps: true
});

export default model('Grievance', dataSchema);

