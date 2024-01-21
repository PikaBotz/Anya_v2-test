const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nsfw: { type: Boolean, default: false },
    antibot: { type: Boolean, default: true },
    antilink: { type: Boolean, default: false },
    antitoxic: { type: Boolean, default: false },
    antivirus: { type: Boolean, default: false },
    antipicture: { type: Boolean, default: false },
    antivideo: { type: Boolean, default: false },
    antisticker: { type: Boolean, default: false },
    antinsfw: { type: Boolean, default: false },
    antispam: { type: Boolean, default: false },
    chatbot: { type: Boolean, default: false }
})

const Group = mongoose.model('groups', Schema);
module.exports = { Group };