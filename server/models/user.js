const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    username: String,
    password: String,
    gender: String,
    county: String,
    subcounty: String,
    ward: String,
    settlement: String,
    settlement_id: String,
    roles:Array, 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
