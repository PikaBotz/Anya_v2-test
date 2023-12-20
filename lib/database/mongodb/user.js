const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    ban: { type: Boolean, default: false }
})

const User = mongoose.model('users', Schema);
module.exports = { User };