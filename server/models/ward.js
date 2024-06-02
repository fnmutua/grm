const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    name: String,
    code: Number
});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
