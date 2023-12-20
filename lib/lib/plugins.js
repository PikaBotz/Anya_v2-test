const commands = [];
//const Config = require('../../config');

function anya(info, logic) {
    var data = info;
    data.function = logic;
    if (!info.cooldown) data.cooldown = 3;
    if (!info.rule) data.rule = 0;
    if (!info.react) data.react = false;
    if (!info.filename) data.filename = false;
    if (!info.need) data.need = false;
    if (!info.demo) data.demo = false;
    commands.push(data);
    return data;
}

module.exports = { anya, commands };