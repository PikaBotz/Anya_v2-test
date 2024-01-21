const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    anticall: { type: Boolean, default: true },
    antifake: { type: Boolean, default: false },
    antilinkall: { type: Boolean, default: false },
    autoMsgRead: { type: Boolean, default: true },
    autoReactMsg: { type: Boolean, default: true },
    autoTyping: { type: Boolean, default: true },
    autoReply: { type: Boolean, default: true },
    autoBio: { type: Boolean, default: true },
    autoBlock: { type: Boolean, default: false },
    chatbot: { type: Boolean, default: false },
    cooldown: { type: Boolean, default: true },
    welcome: { type: Boolean, default: true },
    goodbye: { type: Boolean, default: true },
    /* PDM : Promote Demote Messages */
    pdm: { type: Boolean, default: true },
    /* gcm : Group Changes Messages */
    gcm: { type: Boolean, default: true },
    antionce: { type: Boolean, default: true },
    antidelete: { type: Boolean, default: true },
    badWords: [{ type: String }],
    fakelist: [{ type: String }]
});

const System = mongoose.model("system", Schema);
module.exports = { System };