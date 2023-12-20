const Config = require('../../config');

const { anya, commands } = require(__dirname + '/plugins');
const {
  tiny
} = require(__dirname + '/stylish-font');
const {
  dayToday,
  totalAnyaUsers,
  formatRuntime,
  getMemoryInfo,
  isLatest,
  getBuffer,
  pickRandom,
  formatDate
} = require(__dirname + '/myfunc');
const {
  Bot,
  User,
  System
} = require(__dirname + '/../database/mongodb');
const { smsg } = require(__dirname + '/functions');
const { getPrefix } = require(__dirname + '/prefix');
const { fix } = require(__dirname + '/mongoUrlFix');
const { buttons } = require(__dirname + '/buttons');

async function getAdmin(anyaV2, pika) {
    const group = await anyaV2.groupMetadata(pika.chat);
    return group.participants
    .filter(i => i.admin !== null)
    .map(i => i.id);
  }

module.exports = {
  anya,
  commands,
  tiny,
  dayToday,
  formatRuntime,
  getMemoryInfo,
  isLatest,
  Bot,
  User,
  System,
  smsg,
  getPrefix,
  getBuffer,
  pickRandom,
  formatDate,
  pik4nya: buttons,
  totalUsers: totalAnyaUsers,
  myfunc: require('./myfunc'),
  stylish: require('./stylish-font'),
  fix,
  getAdmin: getAdmin,
  rule: async (rule, anyaV2, pika, userOwner) => {
    switch (rule) {
      case 1:
        if (!userOwner) return pika.reply(Config.message.owner);
        break;
      case 2: case 3: {
        if (!pika.isGroup) return pika.reply(Config.message.group);
        const groupAdmins = await getAdmin(anyaV2, pika);
        const isAdmins = pika.isGroup ? groupAdmins.includes(pika.sender) : false;
        if (/2/.test(rule)) {
          if (!userOwner && !isAdmins) return pika.reply(Config.message.admin);
        } else {
          const botNumber = await anyaV2.decodeJid(anyaV2.user.id)
          const botAdmin = pika.isGroup ? groupAdmins.includes(botNumber) : false;
          if (!botAdmin) return pika.reply(Config.message.botAdmin);
          if (!userOwner && !isAdmins) return pika.reply(Config.message.admin);
        }
      }
      break;
      case 5:
        if (!pika.isGroup) return pika.reply(Config.message.group);
        break;
        default:
          return false;
    }
  }
}
