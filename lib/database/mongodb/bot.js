const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    react: { type: Boolean, default: false },
    worktype: { type: String, default: 'public' },
    prefix: { type: String, default: 'multi' },
    autoStatusRead: { type: Boolean, default: true },
    onlypm: { type: Boolean, default: false },
    modlist: [{ type: String }]
})

const Bot = mongoose.model('anyabot', Schema);
module.exports = { Bot };
