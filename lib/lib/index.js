const Config = require('../../config');

const { anya, commands } = require(__dirname + '/plugins');
const {
  listall,
  tiny,
  fancy10,
  fancy11,
  fancy13,
  fancy32
} = require(__dirname + '/stylish-font');
const {
  dayToday,
  totalAnyaUsers,
  formatRuntime,
  getMemoryInfo,
  isLatest,
  getBuffer,
  pickRandom,
  formatDate,
  formatNumber,
  getStream,
  delay,
  TelegraPh,
  UploadFileUgu,
  getObjArray,
  getRandom
} = require(__dirname + '/myfunc');
const {
  Bot,
  User,
  Group,
  UI,
  System,
  Warn,
  addWarn,
  delWarn,
  clearWarn
} = require(__dirname + '/../database/mongodb');
const {
  pinterest,
  tiktok,
  twitter,
  wikimedia,
  lyrics,
  wallpaper,
  hentaivid,
  telesticker,
  mediafireDl,
  photooxy,
  ttdl,
  gimg
} = require(__dirname + '/scraper');
const {
  writeExifInVid,
  createVidSticker,
  audioToVideo
} = require(__dirname + '/converter');
const { smsg } = require(__dirname + '/functions');
const { getPrefix } = require(__dirname + '/prefix');
const { fix } = require(__dirname + '/mongoUrlFix');
const { buttons } = require(__dirname + '/buttons');
const { api } = require(__dirname + '/../.dev');
const { similar } = require(__dirname + '/similar');
const { groupEventListener, groupChangesListener } = require(__dirname + '/events');

async function getAdmin(anyaV2, pika) {
    const group = await anyaV2.groupMetadata(pika.chat).catch(_=>{});
    return group.participants
    .filter(i => i.admin !== null)
    .map(i => i.id);
  }

module.exports = {
  anya,
  commands,
  listall,
  tiny,
  fancy10,
  fancy11,
  fancy13,
  fancy32,
  dayToday,
  formatRuntime,
  getMemoryInfo,
  formatNumber,
  isLatest,
  Bot,
  User,
  Group,
  UI,
  System,
  Warn,
  addWarn,
  delWarn,
  clearWarn,
  smsg,
  getPrefix,
  getBuffer,
  pickRandom,
  formatDate,
  getStream,
  delay,
  UploadFileUgu,
  TelegraPh,
  getObjArray,
  getRandom,
  similar,
  pik4nya: buttons,
  totalUsers: totalAnyaUsers,
  pinterest,
  tiktok,
  twitter,
  wikimedia,
  lyrics,
  wallpaper,
  hentaivid,
  telesticker,
  mediafireDl,
  photooxy,
  ttdl,
  gimg,
  writeExifInVid,
  createVidSticker,
  audioToVideo,
  fix,
  api,
  groupEventListener,
  groupChangesListener,
  warning: async (anyaV2, pika, header, { chat, reason }) => {
    const res = await addWarn(pika.sender.split("@")[0], { chat: chat, reason: reason});
    if (res.status === 201 || res.status === 200) {
        pika.reply(`════════════════════════\n  ${header}\n════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`, { mentions: [pika.sender] });
        if (res.warn === Config.warns) return pika.reply(`*⚠️ Be careful @${pika.sender.split("@")[0]}, it's your last warning*`, { mentions: [pika.sender] });
    } else if (res.status === 429) {
        pika.reply(`════════════════════════\n  ${header}\n════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : exceeded_\n└ _reason : ${reason}_`, { mentions: [pika.sender] });
        pika.reply(`_✅ Kicked *@${pika.sender.split("@")[0]}*_`, { mentions: [pika.sender] });
        await delay(2000);
        return anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove')
        .catch((error) => console.error(error));
    }
  },
  pikaApi: {
    get: async (folder, file, query) => await api.apiHub(folder, file, query).then((response) => { return response })
  },
  isButton: (args) => /anyaButtonMessage/.test(args.join(" ")),
  getAdmin: getAdmin,
  announce: async (anyaV2, pika, { header, message }) => {
    const metadata = await anyaV2.groupMetadata(pika.chat);
    pika.reply(`\`\`\`${header ? header : "⚠️ Attention!!"}\`\`\`\n\n${message}`, { mentions: metadata.participants.map(v => v.id) });
  },
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
      case 6:
        if (!pika.isGroup) return pika.reply(Config.message.group);
        if (!userOwner) return pika.reply(Config.message.owner);
        break;
      case 7:
        if (pika.isGroup) return pika.reply(Config.message.private);
        if (!userOwner) return pika.reply(Config.message.owner);
        break;
        default:
          return false;
    }
  },
  rules: (rule) => {
    let owner;
    let admin;
    let bot;
    let gc;
    let pc;
        switch (rule) {
            case 0:
                owner = null;
                admin = null;
                bot = null;
                gc = null;
                pc = null;
                break;
            case 1:
                owner = true;
                admin = false;
                bot = true;
                gc = true;
                pc = true;
                break;
            case 2:
                owner = true;
                admin = true;
                bot = null;
                gc = true;
                pc = false;
                break;
            case 3:
                owner = true;
                admin = true;
                bot = true;
                gc = true;
                pc = false;
                break;
            case 4:
                owner = null;
                admin = false
                bot = false;
                gc = false;
                pc = true;
                break;
            case 5:
                owner = null;
                admin = null;
                bot = null;
                gc = true;
                pc = false;
                break;
            case 6:
                owner = true;
                admin = false;
                bot = false;
                gc = false;
                pc = true;
                break;
            case 7:
                owner = true;
                admin = false;
                bot = false;
                gc = true;
                pc = false;
                break;
        }
      return {
        owner: (owner !== null) ? owner ? "✅" : "❌" : "Not required",
        admin: (admin !== null) ? admin ? "✅" : "❌" : "Not required",
        botAdmin: (bot !== null) ? bot ? "✅" : "❌" : "Not required",
        group: (gc !== null) ? gc ? "✅" : "❌" : "Not required",
        pc: (pc !== null) ? pc ? "✅" : "❌" : "Not required"
      }
    }
}
