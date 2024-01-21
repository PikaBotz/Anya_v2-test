const axios = require('axios');
const Config = require('../../config');
const { anya, System, pickRandom, addWarn, delay, warning } = require('../lib');

//༺─────────────────────────────────────༻

anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system, bot }) => {
    if (!pika.isGroup || bot.worktype === "self" || !system.autoReply) return;
    const words = [
        "foolish",
        "smart",
        "idiot",
        "gay",
        "lesbi",
        "bastard",
        "stubble",
        "dog",
        "fuck",
        "ape",
        "noob",
        "great",
        "horny",
        "wibu",
        "asshole",
        "handsome",
        "beautiful",
        "cute",
        "kind",
        "ugly",
        "pretty",
        "lesbian",
        "randi",
        "gandu",
        "madarchod",
        "kala",
        "gora",
        "chutiya",
        "nibba",
        "nibbi",
        "bhosdiwala",
        "chutmarika",
        "bokachoda",
        "suarerbaccha",
        "bolochoda",
        "muthal",
        "muthbaaz",
        "randibaaz",
        "topibaaz",
        "cunt",
        "nerd",
        "behenchod",
        "behnchoda",
        "bhosdika",
        "nerd",
        "mc",
        "bsdk",
        "bhosdk",
        "nigger",
        "loda",
        "laund",
        "nigga",
        "noobra",
        "tharki",
        "nibba",
        "nibbi",
        "mumu",
        "rascal",
        "scumbag",
        "nuts",
        "comrade",
        "fagot",
        "scoundrel",
        "ditch",
        "dope",
        "gucci",
        "lit",
        "dumbass",
        "sexy",
        "crackhead",
        "mf",
        "motherfucker",
        "dogla",
        "bewda",
        "boka",
        "khanki",
        "bal",
        "sucker",
        "fuckboy",
        "playboy",
        "fuckgirl",
        "playgirl",
        "hot"
     ];
     const matches = words.filter(item => pika.text.toLowerCase().includes(item));
     if (matches.length > 0) {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const participants = metadata.participants.map(v => v.id);
        const member = participants[Math.floor(participants.length * Math.random())];
        return pika.reply(`The Most *${matches[0].charAt(0).toUpperCase() + matches[0].slice(1)}* Here Is @${member.split("@")[0]}`, { mentions: [member] });
     }
});

//༺─────────────────────────────────────༻

anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system }) => {
    if (system.autoReactMsg) return await pika.react(pickRandom(require('../database/emoji').emoji));
    }
)

//༺─────────────────────────────────────༻

anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { group, system, args, botNumber }) => {
    if (pika.isGroup && /*!pika.quoted.sender !== botNumber &&*/ !group.chatbot) return;
    if (!pika.isGroup && !system.chatbot) return;
    if (!pika.text) return;
    const {key} = await pika.keyMsg("🗣️ Aɪ Is Tʜɪɴᴋɪɴɢ...");
    const query = encodeURIComponent(pika.text);
    const urls = [
  "https://vihangayt.me/tools/chatgpt?q=",
  "https://vihangayt.me/tools/chatgpt2?q=",
  "https://vihangayt.me/tools/chatgpt3?q=",
  "https://vihangayt.me/tools/chatgpt4?q=",
  "https://vihangayt.me/tools/chatgpt5?q=",
  `http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=[${pika.sender.split("@")[0]}]&msg=`,
];
let chatbotSuccess = false;
async function chatbotApi() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const { data } = await axios.get(url + query);
      if (data.status) {
        pika.edit(`*🚀 AI :* ${data.cnt ? data.cnt : data.data}`, key);
        chatbotSuccess = true;
        break;
      } else {
        console.error(`Unsuccessful response from ${url}. Trying the next one...`);
      }
    } catch (error) {
      console.error(`Error while fetching ${url}: ${error.message}`);
    }
  }
  if (!chatbotSuccess) {
    pika.edit(`🫤 Chatbot *Server Is Busy*, turning off chatbot`, key).then(() => {});
  }
}
chatbotApi();
    }
)

//༺─────────────────────────────────────༻

anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system, userOwner }) => {
    if (pika.isGroup || userOwner) return;
    if (!system.autoBlock) return;
    const isPrivate = pika.chat.endsWith("@s.whatsapp.net");
    if (!isPrivate) return;
        const res = await addWarn(pika.sender.split("@")[0], { chat: 1, reason: "Messaged while antipm was enabled"});
        if (res.status === 201 || res.status === 200) {
            pika.reply(`\`\`\`⚠️ ❝Private Chat Messaging Not Allowed!❞\`\`\`\n═════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : messaged in private chat_`, { mentions: [pika.sender] });
            if (res.warn === Config.warns) return pika.reply(`*⚠️ Be careful @${pika.sender.split("@")[0]}, it's your last warning*`, { mentions: [pika.sender] });
        } else if (res.status === 429) {
            pika.reply(`\`\`\`⚠️ ❝Private Chat Messaging Not Allowed!❞\`\`\`\n═════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : exceeded_\n└ _reason : messaged in private chat_`, { mentions: [pika.sender] });
            pika.reply("*You've reached your highest warn limit 🎊, blocking you.*");
            await delay(2000);
            return await anyaV2.updateBlockStatus(pika.sender, 'block');
        }
    }    
)

//༺─────────────────────────────────────༻

const SYSTEM_BAD_WORDS_DEFAULT = ['bhosdke', 'tmkc', 'vsguna', 'vagina', 'dick', 'mdrchod', 'bx', 'chutiya', 'lodu', 'lode', 'cum', 'pussy', 'chut', 'suck', 'scum', 'scumbag', 'nigger', 'niggr', 'nigga', 'chod', 'bhenchod', 'bc', 'bhosdike', 'bhodike', 'bsdk', 'randi', 'rand', 'gandu', 'stfu', 'ass', 'asshole', 'madarchod', 'fuck', 'motherfucker', 'mother fucker', 'mf', 'mfs', 'fk', 'fck', 'gand', 'laund', 'loda', 'gulambi', 'gulabi'];

anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { group, system, isAdmins, botAdmin, userOwner, body }) => {
  if (userOwner || !pika.isGroup) return;

  if (pika.isBaileys && system.antibot) {
    if (!botAdmin) {
      await pika.reply("\`\`\`🤖 Bot Detected!!\`\`\`\n_but I'm not an admin_");
      return;
    }

    await pika.reply(`\`\`\`🤖 Bot Detected!!\`\`\`\n\n_✅ Kicked *@${pika.sender.split("@")[0]}*_`, { mentions: [pika.sender] });
    await anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    await pika.deleteMsg(pika.key);
    return;
  }

  if (/http:\/\/|https:\/\//.test(body.toLowerCase())) {
    if (!(group.antilink || system.antilinkall) || isAdmins) return;
    if (!botAdmin) {
      await pika.reply("```🔗 Antilink detected```\n_but I'm not an admin_");
      return;
    }

    await warning(anyaV2, pika, "```🔗 Group Antilink Detected```", { chat: 2, reason: "sent link in the group chat" });
    await pika.deleteMsg(pika.key);
    return;
  }

  if (group.antitoxic) {
    if (system.badWords.length === 0) {
      system.badWords = SYSTEM_BAD_WORDS_DEFAULT;
      await system.save();
    }

    const firstWord = body.trim().split(/ +/)[0].toLowerCase();
    if (!system.badWords.includes(firstWord) || isAdmins) return;

    if (!botAdmin) {
      await pika.reply("```☣️ Abusement detected```\n_but I'm not an admin_");
      return;
    }

    await warning(anyaV2, pika, "```☣️ Group Abusement Detected```", { chat: 2, reason: "sent words that were not allowed in the group chat" });
    await pika.deleteMsg(pika.key);
  }
});

//༺─────────────────────────────────────༻

const mediaTypeActions = {
    'image': { prop: 'antipicture', message: '🖼️ Antipicture detected', warning: '🖼️ Group Antipicture Detected' },
    'video': { prop: 'antivideo', message: '🎥 Antivideo detected', warning: '🎥 Group Antivideo Detected' },
    'sticker': { prop: 'antisticker', message: '👻 Antisticker detected', warning: '👻 Group Antisticker Detected' }
  };
  
  anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { group, isAdmins, botAdmin, userOwner }) => {
    if (userOwner || !pika.isGroup) return;
  
    const mediaType = Object.keys(mediaTypeActions).find(type => new RegExp(type).test(pika.mtype));
  
    if (mediaType) {
      const { prop, message, warning } = mediaTypeActions[mediaType];
  
      if (!group[prop] || isAdmins) return;
      if (!botAdmin) {
        await pika.reply(`\`\`\`${message}\`\`\`\n_but I'm not an admin_`);
        return;
      }
  
      await warning(anyaV2, pika, `\`\`\`${warning}\`\`\``, { chat: 2, reason: `sent ${mediaType}s in the group chat while ${prop} was enabled` })
        .then(() => pika.deleteMsg(pika.key))
        .catch(error => console.error(error));
    }
  });

//༺─────────────────────────────────────༻

anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { args, system, userOwner }) => {
    if (!/viewOnceMessage/.test(pika.mtype) || !system.antionce) return;
    if (userOwner) return pika.reply(`\`\`\`⏳ Anti Once Detected!\`\`\`\n_but @${pika.sender.split("@")[0]} is a mod_`, { mentions: [pika.sender] });
    const {key} = await pika.copyNForward(pika.chat, true, { readViewOnce: true, quoted: pika, caption: `\`\`\`🏮 Antionce Detected\`\`\`\n⌬═══════════════════⌬\n\n*👤 Sender :* @${pika.sender.split("@")[0]}@captionHereIfAvailable\n\n${Config.footer}`, mentions: [pika.sender] });
});