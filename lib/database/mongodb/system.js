const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String ,default: "system" },
    enabled: { type: Boolean, default: true },
    anticall: { type: Boolean, default: true },
    autoMsgRead: { type: Boolean, default: true },
    autoReactMsg: { type: Boolean, default: true },
    autoTyping: { type: Boolean, default: true },
    chatbot: { type: Boolean, default: false },
    badWords: [{ type: String }]
});

const System = mongoose.model("system", Schema);
module.exports = { System };