const mongoose = require('mongoose');

const SettlementSchema = new mongoose.Schema({
    name: String,
    code: Number
});

const Settlement = mongoose.model('Settlement', SettlementSchema);

module.exports = Settlement;
