const Config = require('../../config');
const { anya, commands, Bot, UI, tiny, dayToday, totalUsers, formatRuntime, getMemoryInfo, rules, fancy10, fancy13, fancy32, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
        name: "alive",
        alias: ['hey', 'hi'], 
        react: "👋🏻",
        category: "core",
        desc: "Bot will say it's alive",
        filename: __filename
    },
    async (anyaV2, pika, { prefix }) => {
        const bot = await Bot.findOne({ id: 'anyabot' });
        const os = require('os');
        const { commands } = require('../lib');
        const caption = `\`\`\`
${Config.themeemoji} ── ✦ ──『✙ Alive ✙』── ✦ ── ${Config.themeemoji}

📅 ${tiny('Date Today')} : ${dayToday().date}
⌚ ${tiny('Time Now')} : ${dayToday().time}

✦» 𝚄𝚜𝚎𝚛 : ${pika.pushName}
✦» 𝙱𝚘𝚝 : ${Config.botname}
✦» 𝙿𝚛𝚎𝚏𝚒𝚡 : ${prefix}
✦» 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require('../../package.json').version}
✦» 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}
✦» 𝙷𝚘𝚜𝚝 : ${os.hostname()}
✦» 𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
✦» 𝙼𝚘𝚍𝚎 : ${bot.worktype}
✦» 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${commands.length}
✦» 𝚄𝚜𝚎𝚛𝚜 : ${await totalUsers()}
✦» 𝚄𝚙𝚝𝚒𝚖𝚎 : ${formatRuntime(process.uptime())}
✦» 𝙼𝚎𝚖 : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}\`\`\`

☎️ *Cᴏɴᴛᴀᴄᴛ :* https://wa.me/${Config.ownernumber}?text=${encodeURIComponent('Owner of ' + Config.botname + ' 🥵🎀🎐')}
💻 *Sᴏᴜʀᴄᴇ Cᴏᴅᴇ :* https://github.com/PikaBotz/Anya_v2-MD
🎀 *YᴏᴜTᴜʙᴇ :* https://youtube.com/@Pika_Kunn
🔮 *Public Group :* https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:*
   𝟭 𝗔𝗹𝗹𝗺𝗲𝗻𝘂
   𝟮 𝗠𝗲𝗻𝘂𝗹𝗶𝘀𝘁
_ID: QA01_
`;
    await anyaV2.sendMessage(pika.chat, {
        video: Config.aliveMedia,
        caption: caption.trim(),
        gifPlayback: true,
        contextInfo: {
            externalAdReply: {
                title: Config.botname,
                body: 'I\'m still alive darling',
                thumbnail: Config.image_2,
                showAdAttribution: true
            }
        }
    }, { quoted: pika });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "help",
        alias: ['h', 'menu', 'allmenu'],
        react: Config.themeemoji,
        category: "core",
        desc: "Bot's command panel",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        const { commands } = require('../lib');
        if (command === "help" && args.length > 0) {
            const caption = [];
            const cmd = commands.find(v => v.name === args[0].toLowerCase() || (v.alias && v.alias.includes(args[0].toLowerCase())));
            if (cmd) {
                caption.push(`*🧿 Name :* ${cmd.name}`);
                if (cmd.alias) caption.push(`*🔖 Alias :* ${cmd.alias.join(", ")}`);
                if (cmd.react) caption.push(`*🌀 React :* ${cmd.react}`);
                if (cmd.need) caption.push(`*💭 Usage :* ${cmd.need}`);
                if (cmd.category) caption.push(`*📂 Category :* ${cmd.category}`);
                caption.push(`*🕜 Cooldown :* ${cmd.cooldown} seconds`);
                if (cmd.filename) caption.push(`*📑 File :* ${cmd.filename}`);
                const i = rules(cmd.rule);
                caption.push(`*📃 Access :*
    - ${i.owner} : Owner
    - ${i.admin} : Admin
    - ${i.botAdmin} : Bot Admin
    - ${i.group} : Group Chat
    - ${i.pc} : Private Chat`,
               `*📜 Description :* ${cmd.desc}`);
                return pika.reply(caption.join("\n\n"));
            } else pika.reply(`*❌ No such plugins '${args[0]}'*`);
        } else {
            const readmore = String.fromCharCode(8206).repeat(4001);
            const bot = await Bot.findOne({ id: 'anyabot' });
            const patterns = {};
                for (const cmd of commands) {
                    if (cmd.name && !cmd.notCmd) {
                    if (!patterns[cmd.category]) patterns[cmd.category] = [];
                        patterns[cmd.category].push(`${cmd.name}${cmd.need ? "  ⌈" + cmd.need + "⌋" : ""}`);
                    }
                }

            let caption = `
*Hello, ${pika.pushName}*
_I'm ${Config.botname} >> 🖤🥀_

🇼 🇭 🇦 🇹 🇸 🇦 🇵 🇵 - 🇧 🇴 🇹 

📅 Date Today : ${dayToday().date}
⌚ Time Now : ${dayToday().time}

《⟡━━━━━⟪ ${fancy32(Config.ownername)} ⟫━━━━━⟡》
║╭───────────┈⟡
║│✗»𝚄𝚜𝚎𝚛 : ${pika.pushName}
║│✗»𝙱𝚘𝚝 : ${Config.botname}
║│✗»𝙿𝚛𝚎𝚏𝚒𝚡 : ${prefix}
║│✗»𝙼𝚘𝚍𝚎 : ${bot.worktype}
║│✗»𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require('../../package.json').version}
║│✗»𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
║│✗»𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${commands.length}
║│✗»𝚄𝚜𝚎𝚛𝚜 : ${await totalUsers()}
║│✗»𝙼𝚎𝚖 : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}
║╰─────────────┈⟡
⟪⟡───────⟐⌬⟐───────⟡⟫

*💠 Fᴏʟʟᴏᴡ ᴍᴇ ᴏɴ :* https://instagram.com/${Config.instagramId}
*💻 Sᴏᴜʀᴄᴇ Cᴏᴅᴇ :* https://github.com/PikaBotz/Anya_v2-MD
*🍜 YᴏᴜTᴜʙᴇ :* https://YouTube.com/@pika_kunn
*👥 Pᴜʙʟɪᴄ Gʀᴏᴜᴘ :* https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*🧑🏻‍💻 :* _Type .information for my system status._
${readmore}\n`;
    for (const i in patterns) {
        caption += `╭─────────────┄┄┈•\n┠───═❮ *${i}* ❯═─┈•\n│   ╭──┈•\n`;
        for (const plugins of patterns[i]) {
            caption += `│   │➛ ${prefix + tiny(plugins)}\n`;
        }
        caption += `│   ╰───────────⦁\n╰────────────────❃\n\n`;
    }
    caption += `🎀 _Type ${prefix}listmenu for my command list._

🔖 _Type ${prefix}help <command_name> for plugin information._

*Eg: _${prefix}help nsfw_*

${Config.footer}`;
        
    let message;
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save;
    if (ui.menu === 1) {
         message = {
            image: Config.image_1,
            caption: caption.trim()
        };
    } else if (ui.menu === 2) {
        message = {
            image: Config.image_1,
            caption: caption.trim(),
            contextInfo: {
                externalAdReply: {
                    title: Config.botname,
                    body: 'Here\'s the full list of my commands darling',
                    thumbnail: Config.image_2,
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: Config.socialLink,
                    sourceUrl: Config.socialLink
                }
            }
        };
    } else if (ui.menu === 3) {
        message = {
            video: Config.menuMedia,
            caption: caption.trim(),
            gifPlayback: true
        };
    } else if (ui.menu === 4) {
        message = {
            video: Config.menuMedia,
            caption: caption.trim(),
            gifPlayback: true,
            contextInfo: {
                externalAdReply: {
                    title: Config.botname,
                    body: 'Here\'s the full list of my commands darling',
                    thumbnail: Config.image_2,
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: Config.socialLink,
                    sourceUrl: Config.socialLink
                }
            }
        };
    } else if (ui.menu === 5) {
        message = {
            text: caption.trim()
        };
    } else if (ui.menu === 6) {
        message = {
            text: caption.trim(),
            contextInfo: {
                externalAdReply: {
                    title: Config.botname,
                    body: 'Here\'s the full list of my commands darling',
                    thumbnail: Config.image_2,
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: Config.socialLink,
                    sourceUrl: Config.socialLink
                }
            }
        }
    } else if (ui.menu === 7) {
        const fs = require("fs");
        message = {
            document: fs.readFileSync('./lib/Assets/empty.xlsx'),
            jpegThumbnail: Config.image_1,
            fileLength: '99999999999999',
            pageCount: '1000000000',
            caption: caption.trim(),
            fileName: Config.ownername,
            mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: Config.botname,
                    body: 'Here\'s the full list of my commands darling',
                    showAdAttribution: true,
                    thumbnail: Config.image_1,
                    mediaType: 2,
                    mediaUrl: "https://youtu.be/jEwjrdzrpWE?si=dO4r8qKrciRzwssB",
                    sourceUrl: "https://youtu.be/jEwjrdzrpWE?si=dO4r8qKrciRzwssB"
                }
            }
        };
    }
    return await anyaV2.sendMessage(pika.chat, message, { quoted: pika });
        }
    }
)

//༺─────────────────────────────────────༻

const cateData = {
  "core": {
    "desc": "Essential commands for the bot",
    "emoji": "💻"
  },
  "admins": {
    "desc": "Commands exclusively for group admins",
    "emoji": "🍜"
  },
  "ai": {
    "desc": "Special commands powered by AI",
    "emoji": "🎯"
  },
  "anime": {
    "desc": "Discover anime—because anime is love!",
    "emoji": "❤️"
  },
  "convert": {
    "desc": "Transform media into different formats",
    "emoji": "🧧"
  },
  "download": {
    "desc": "Download content from various platforms",
    "emoji": "🧩"
  },
  "general": {
    "desc": "General commands for everyone",
    "emoji": "🍁"
  },
  "textpro": {
    "desc": "Create stylish text images",
    "emoji": "❤️‍🔥"
  },
  "logomaker": {
    "desc": "Craft eye-catching logos",
    "emoji": "🌟"
  },
  "photooxy": {
    "desc": "Design stylish banners with text",
    "emoji": "🎀"
  },
  "nsfw": {
    "desc": "Commands containing explicit content",
    "emoji": "🐤"
  },
  "owner": {
    "desc": "Customization and settings for bot owners",
    "emoji": "🚀"
  },
  "religious": {
    "desc": "Commands related to religion",
    "emoji": "🛐"
  },
  "search": {
    "desc": "Search the internet with ease",
    "emoji": "💖"
  },
  "stalker": {
    "desc": "Access various types of information",
    "emoji": "🍂"
  },
  "tools": {
    "desc": "Utility tools for various purposes",
    "emoji": "🔮"
  }
};

anya({
        name: "listmenu",
        alias: ['menulist', 'list'],
        react: "📑",
        category: "core",
        desc: "List of the available menus",
        filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        const bot = await Bot.findOne({ id: 'anyabot' });
        const { commands } = require('../lib');
        let caption = "";
        let c = 1;
        const patterns = {};
        for (const cmd of commands) {
            if (cmd.name && !cmd.notCmd) {
                if (!patterns[cmd.category]) patterns[cmd.category] = [];
                patterns[cmd.category].push(`${cmd.name}${cmd.need ? "  ⌈" + cmd.need + "⌋" : ""}`);
            }
        }
        const symbols = pickRandom(["⭔", "❃", "❁", "✬", "⛦", "◌", "⌯", "⎔", "▢", "▣", "◈", "֍", "֎", "࿉", "۞", "⎆", "⎎"]);
        caption += `\`\`\`📆 Date : ${dayToday().date}
🕜 Time : ${dayToday().time}

╭─────────────────❃
│${symbols}╭───────────◈
│${symbols}│User : ${pika.pushName}
│${symbols}│Bot : ${Config.botname}
│${symbols}│Prefix : ${prefix}
│${symbols}│Mode : ${bot.worktype}
│${symbols}│Version : ${require('../../package.json').version}
│${symbols}│Owner : ${Config.ownername}
│${symbols}│Categories : ${Object.keys(patterns).length}
│${symbols}│Mem : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}
│${symbols}╰───────────◈
╰─────────────────❃\`\`\`

*🌟 Reply A Number To Get Command List*\n\n`;
        const footer = `_Type *${prefix+command} <category>* to get that specific list_\n*Eg: _${prefix+command} owner_*\n\n_ID: QA20_\n${Config.footer}`;
        for (const i in patterns) {
            const upperCase = i.charAt(0).toUpperCase() + i.slice(1);
            const hasCate = cateData[i];
            if (args.length > 0) {
                if (args[0].toLowerCase() === i.toLowerCase()) {
                    caption += `╭──⌈ *${fancy10(upperCase)}* ⌋\n`;
                    for (const y of patterns[i]) {
                        caption += `│⊳ ${hasCate ? cateData[i].emoji : Config.themeemoji} ${prefix + y}\n`;
                    }
                    caption += `└───────────────⟢`;
                    return pika.reply(caption + `\n\n${footer}`);
                }
            } else {
                caption += `┌─ ${c++}. *${upperCase}*\n`;
                caption += `│⊳ *🏮commands :* ${patterns[i].length}\n`;
                caption += `└⊳ *🧩About :* ${fancy13(hasCate ? cateData[i].desc : "No Data Available About This Category")}\n\n`;
            }
        }
        if (args.length > 0) return pika.reply("*🍁 No Such Category Found!*");
        pika.reply(caption + footer);
    }
)