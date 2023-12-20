
const Config = require('../../config');
const { anya, commands, Bot, tiny, dayToday, totalUsers, formatRuntime, getMemoryInfo } = require('../lib');

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
   𝟮 𝗟𝗶𝘀𝘁𝗺𝗲𝗻𝘂
_ID: QA01_
`;
    await anyaV2.sendMessage(pika.chat, {
        video: Config.aliveMedia,
        caption: caption,
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