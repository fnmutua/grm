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
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Investigation', 'Review', 'Resolved', 'Escalated', 'Closed'],
    required: false,
  },
  resolution: {
    type: String,
    required: false,
  },
  acceptance: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending'],
    required: false,
  },
}, {
  timestamps: true,
});

// Create a compound index to ensure uniqueness on `complaint`, `name`, and `phone`
dataSchema.index({ complaint: 1, name: 1, phone: 1 }, { unique: true });

export default model('Grievance', dataSchema);
