const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  grievanceCode: {
    type: String,
    required: true,
    ref: 'Grievance'
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
