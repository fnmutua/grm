const mongoose = require('mongoose');

const countySchema = new mongoose.Schema({
    name: String,
    code: String
});

const County = mongoose.model('County', countySchema);

module.exports = County;
