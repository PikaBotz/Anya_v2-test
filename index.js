const Config = require('./config');
const chalk = require('chalk');
const path = require('path');
const { exec, execSync } = require('child_process');
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, jidDecode, downloadContentFromMessage, DisconnectReason, makeCacheableSignalKeyStore } = require('@queenanya/baileys');
const { createQueenAnyaSession } = require("./lib/lib/session");
const { MakeSession } = require("./lib/lib/session2");
const PhoneNumber = require("awesome-phonenumber");
const { Boom } = require('@hapi/boom');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const FileType = import('file-type');
const pino = require("pino");
const plugins = require('./lib/lib');
const MAIN_LOGGER = require('./lib/lib/logger');
const logger = MAIN_LOGGER.child({})
logger.level = 'silent'

if (Config.mongoUrl === 'YOUR_MONGODB_URL') return console.log(chalk.bgRed('ERROR:'), chalk.red('Please set your MongoDB URL in config.js file'));
if (Config.sessionId === 'YOUR_SESSION_ID') return console.log(chalk.bgRed('ERROR:'), chalk.red('Please set your Session ID in config.js file'));

let uri;
const response = plugins.fix(Config.mongoUrl)
//.then((response) => {
  if (response.status === 401) return console.log(chalk.bgRed('[ WARNING ]'), chalk.red(response.message));
  if (response.status === 400) return console.log(chalk.bgRed('[ ERROR ]'), chalk.red(response.message));
  if (response.status === 200) {
    console.log(response.message)
    uri = response.url;
  }
//});

try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(chalk.green('🌍 Connected to mongodb servers!'));
} catch (error) {
  return console.log(chalk.red('⚠️ Could not connect to mongodb servers...\n\nReasone:', error));
}

const { Bot, User, System, pik4nya, isLatest, smsg, getPrefix, rule } = require('./lib/lib');

const sessionFolderPath = path.join(__dirname, '/sessions');
const sessionPath = path.join(sessionFolderPath, '/creds.json'); 

/**
 * Attempting to create session folder
 * If the session file already exists, it will be deleted
 * If sessions already exists of users, it will be deleted
 */
exec('mkdir' + sessionFolderPath);
execSync('rm -rf ' + sessionPath);
exec('rm -r ' + sessionPath);

if (Config.sessionId.includes("_Queen-Anya_")) {
    MakeSession(Config.sessionId, sessionPath)
    .then(() => console.log(chalk.bgGreen('SUCCESS:'), chalk.green('Valid Pair Code ID Detected...')))
    .catch(err => console.log(err));
} else if (Config.sessionId.includes("_AN_YA_")) {
    createQueenAnyaSession();
    console.log(chalk.bgGreen('SUCCESS:'), chalk.green('Valid QR Code ID Detected...'));
} else {
    console.log(chalk.bgRed('ERROR;'), chalk.red('Invalid session ID, please get your session ID from original platform'))
}

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

store.readFromFile('./lib/database/store.json');
setTimeout(() => {

  /*
async function getMessage(key) {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid, key.id);
    return msg ? msg.message : undefined;
  }
  return {};
}*/

const getVersionWaweb = () => {
        let version
        try {
            let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
            version = [a.currentVersion.replace(/[.]/g, ', ')]
        } catch {
            version = [2, 2204, 13]
        }
        return version
    }
    

const syncPlugins = async (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    const jsFiles = files.filter((file) => path.extname(file).toLowerCase() === '.js');
    jsFiles.forEach((file) => {
      const filePath = path.join(directory, file);
      const requiredModule = require('./' + filePath);
    });
  });
};

syncPlugins('./lib/plugins/');
syncPlugins('./lib/database/mongodb/');

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolderPath);
    const anyaV2 = makeWASocket({
        printQRInTerminal: true,
        browser: [Config.botname + ' (Queen Anya v2) ✅', 'safari', '1.0.0'],
        fireInitQueries: false,
        shouldSyncHistoryMessage: false,
        downloadHistory: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
        logger: pino({ level: 'silent' }),
        version: getVersionWaweb() || [2, 2242, 6],
        getMessage: async key => {
         if (store) {
         const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
         return msg.message || undefined;
         }
         return {
         conversation: 'An Error Occurred, Repeat Command!'
         }
        }
    })

store.bind(anyaV2.ev);
setInterval(() => {
    store.writeToFile('./lib/database/store.json');
}, 30 * 1000);

anyaV2.ws.on("CB:call", async (event) => {
  if (event.content[0].tag === "offer") return;
  const { Bot } = require('./lib/database/mongoDB');
  const bot = await Bot.get();
  if (!bot.anticall) return;
  const { antif } = require('./lib/System');
  await antif.antiCall(event, anyaV2, Config);
});

  const unhandledRejections = new Map();
  process.on("unhandledRejection", (reason, promise) => { unhandledRejections.set(promise, reason); console.log("✅ Saved from crash, Unhandled Rejection at:", promise, "reason:", reason); });
  process.on("rejectionHandled", (promise) => { unhandledRejections.delete(promise); });
  process.on("Something went wrong", function (err) { console.log("✅ Saved from crash, Caught exception: ", err); });
  
  anyaV2.ev.process(async(events) => {

    if(events['contacts.update']) {
      const cons = events['contacts.update'];
      for (const i of cons){
        let id = anyaV2.decodeJid(i.id);
        User.findOne({ id: id.split('@')[0] })
        .then((user) => {
          if (user) {
            new User({ id: id, name: i.notify }).save();
          } else {
            User.updateOne({ id: id.split('@')[0] }, { name: i.notify })
          }
        })
        if (store && store.contacts) store.contacts[id] = { id, name: i.notify }
      }
    }

/*  if (events['contacts.update']) {
  for (const contact of events['contacts.update']) {
    if (typeof contact.imgUrl !== 'undefined') {
      const newUrl = contact.imgUrl === null
        ? null
        : await anyaV2.profilePictureUrl(contact.id).catch(() => null);
      console.log(
        `contact ${contact.id} has a new profile pic: ${newUrl}`
      );
    }
  }
} */

  if (events['creds.update']) {
     await saveCreds();
   };
   /*
			
  if (events['group-participants.update']) {
    const action = events['group-participants.update'];
    grpEvent.listners(action, anyaV2);
  }

/**
 * Handling incoming messages
 *
 */
if (events["messages.upsert"]) {
    const chat = events["messages.upsert"];
    if (chat.type !== 'notify') return;
    const main = chat.messages[0];
    if (!main.message) return;
    const bot = await Bot.findOne({ id: 'anyabot' }) || await new Bot({ id: 'anyabot' }).save();
    if (main.key) {
        if (main.key.remoteJid === 'status@broadcast' && bot.autoStatusRead) return await anyaV2.readMessages([main.key]);
        }
        const pika = await smsg(anyaV2, main, store);
        const user = await User.findOne({ id: pika.sender.split('@')[0] }) || await User.updateOne({ id: pika.sender.split('@')[0] }, { name: pika.pushName });
        const bodyType = pika.body;
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(pika.sender);
        if (bot.worktype === 'self' && !userOwner) return;
        else if (bot.worktype === 'onlyadmin') {
          if (!pika.isGroup) {
            if (!userOwner) return;
          }
        }
        var body = /^\d/.test(bodyType) ? pika.quoted ? (pika.quoted.sender === botNumber) ? await pik4nya(pika.quoted.text.includes("_ID: ") ? pika.quoted.text : null, bodyType.trim().split(/ +/).slice(0), bodyType) : false : bodyType : bodyType;
        if (body === `_404`) return pika.reply(`_🌀 Invalid number_`);
        if (body === `__404`) return pika.reply(`_🧩 Invalid message id_`);
        if (body[1] && body[1] == " ") body = body[0] + body.slice(2);
        const { prefix, isCmd, command } = await getPrefix(body, bot.prefix);
        const args = pika.body ? body.trim().split(/ +/).slice(1) : false;
        if (isCmd) {
            const cmd = plugins.commands.find(cmd => { if (Array.isArray(cmd.name)) { return cmd.name.includes(command); } else if (typeof cmd.name === 'string') { return cmd.name === command; } return false; }) || plugins.commands.find(cmd => cmd.alias && cmd.alias.includes(command));
            if (cmd) {
            if (user.ban) return pika.reply(Config.message.ban);
            if (cmd.rule !== 0) {
              const verify = await rule(cmd.rule, anyaV2, pika, userOwner);
              if (verify) return;
            };
            if (bot.react) cmd.react ? pika.react(cmd.react) : null;
            cmd.function(anyaV2, pika, { 
              prefix: prefix,
              command: command,
              userOwner: userOwner,
              args: args
            })
            .catch((e) => {
                console.log(e);
                pika.reply(`*‼️ An Error Occurred In This Plugin!*\n_-> Please follow these steps to resolve the issue._\n - Contact developer _( wa.me/918811074852 )_\n - Send an error screenshot if available\n - Send console logs of this error if possible\n - Or simply write the issue to the developer directly using the report command\n\n_© | ® - @PikaBotz_`);
            });
          }
          const system = await System.findOne({ id: "system" }) || await System.updateOne;
          if (system.autoTyping) { await anyaV2.sendPresenceUpdate('composing', pika.chat); };
          if (system.autoMsgRead) { await anyaV2.readMessages([main.key]); };
        }
        const system = await System.findOne({ id: "user" }) || await new System({ id: "system" });
        if (system.autoReactMsg) { await pika.react(pickRandom(require('./lib/database/emoji').emoji)); };
        
}
 
 
 function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
 }
 
/**
 * Handling connection to WhatsApp
 * if connection is lost, but session is still valid, it will reconnect
 * if connection closed, it will turn of the process without throwing errors
 * if connected, it'll send a confirmation message
 * {@PikaBotz}
 */
 if (events['connection.update']) {
 const update = events['connection.update'];
  const { connection, lastDisconnect } = update;
  if (connection === 'close' && lastDisconnect) {
    const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : false;
    console.log(chalk.bgYellow('WARNING:'), chalk.yellow('Connection closed, reconnecting...'));
    if (shouldReconnect) {
      await connectToWhatsApp();
    }
  } else if (connection === 'open') {
    console.clear();
    console.log('✅ Login successful!');
    console.log('📶 Requiring initial resources...');
    const { key } = await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: '🔄 𝘊𝘰𝘯𝘯𝘦𝘤𝘵𝘦𝘥, 𝘭𝘪𝘴𝘵𝘪𝘯𝘨 𝘳𝘦𝘴𝘰𝘶𝘳𝘤𝘦𝘴...' });
    const version = await isLatest();
    await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: version ? `_🎀 Connected to Queen Anya_\n*✍🏻 To Start Type :* ${Config.prefa}alive` : '*⚠️ New version available, please update your responsibility branch on GitHub.*', edit: key });
        }
    };
 });
    anyaV2.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid );
    } else return jid;
    };
  
    anyaV2.getName = (jid, withoutContact = false) => {
        const id = anyaV2.decodeJid(jid);
        withoutContact = anyaV2.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) {
                    v = anyaV2.groupMetadata(id) || {};
                }
                resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
            });
        } else {
            v = id === "0@s.whatsapp.net"
                ? {
                    id,
                    name: "WhatsApp",
                  }
                : id === anyaV2.decodeJid(anyaV2.user.id)
                ? anyaV2.user
                : store.contacts[id] || {};
        }
        return (
            (withoutContact ? "" : v.name) ||
            v.subject ||
            v.verifiedName ||
            PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")
        );
    };

    anyaV2.sendContact = async (jid, contacts, quoted = "", opts = {}) => {
  let contactList = [];
  for (const contact of contacts) {
    contactList.push({
      displayName: await anyaV2.getName(contact + '@s.whatsapp.net'),
      vcard: `BEGIN:VCARD
VERSION:3.0
N:${await anyaV2.getName(contact + '@s.whatsapp.net')}
FN:${Config.ownername}
item1.TEL;waid=${contact}:${contact}
item1.X-ABLabel:Click here to chat with this bot's developer.
END:VCARD`
    });
  }
};

    
    anyaV2.setStatus = (status) => {
        anyaV2.query({
            tag: "iq",
            attrs: {
                to: "@s.whatsapp.net",
                type: "set",
                xmlns: "status",
            },
            content: [
                {
                    tag: "status",
                    attrs: {},
                    content: Buffer.from(status, "utf-8"),
                },
            ],
        });
        return status;
    };
      
  
  anyaV2.sendMedia = async (
    jid,
    path,
    fileName = "",
    caption = "",
    quoted = "",
    options = {},
  ) => {
    let types = await anyaV2.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/lib/exif");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : global.packname,
        author: options.author ? options.author : global.author,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await anyaV2.sendMessage(
      jid,
      { [type]: { url: pathFile }, caption, mimetype, fileName, ...options },
      { quoted, ...options },
    );
    return fs.promises.unlink(pathFile);
  };
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  anyaV2.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true,
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  anyaV2.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  /**
   *
   * @param {*} jid
   * @param {*} message
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  anyaV2.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {},
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {},
    );
    await anyaV2.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };



  /**
   *
   * @param {*} path
   * @returns
   */
  anyaV2.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "../src/" + new Date() * 1 + "." + type.ext,
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  return anyaV2
}

const Port = 8000;
app.get('/', (req, res) => {
  res.send('Hello, this is your bot running Queen Anya V2!');
});

app.listen(Port, () => {
  console.log(`✅ Connected to servers, running on port ${Port}...`);
});

function stayAlive() {
  setInterval(() => {
    axios.get(`http://localhost:${Port}`)
      //.then(() => console.log('✅ Uptime Verified!'))
      .catch((error) => {
        console.error('❌ Error:', error);
      });
  }, 15000);
}

function delCreds() {
  setInterval(() => {
    fs.readdirSync(__dirname + '/sessions/').forEach(file => {
      if (file !== 'creds.json') {
        fs.unlinkSync(path.join(__dirname + '/sessions/', file));
      }
    });
    //console.log('✅ Cleared Creds!');
  }, 180000)
}

stayAlive();
delCreds();
connectToWhatsApp().catch((err) => console.log(err));
}, 3000);