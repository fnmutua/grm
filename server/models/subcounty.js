const mongoose = require('mongoose');

const subcountySchema = new mongoose.Schema({
    name: String,
    county:String,
    code: Number
});

const Subcounty = mongoose.model('Subcounty', subcountySchema);

module.exports = Subcounty;
