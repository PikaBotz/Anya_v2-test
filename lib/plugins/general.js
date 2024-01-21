const Config = require('../../config');
const { anya, Bot, fancy11, pickRandom, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

anya({
             name: "modlist",
             alias: ['mods'],
             react: "👑",
             category: "general",
             desc: "See the mod's list of this bot",
             filename: __filename
      }, async (anyaV2, pika) => {
           const bot = await Bot.findOne({ id: "anyabot" });
           const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
           const modlist = bot.modlist;
           if (modlist < 1) return pika.reply("❎ No Mods Found");
           const reply = [];
           let c = 1;
           reply.push(
`════════════════════════
          ▢▢▢ \`\`\`Bot Modlist\`\`\` ▢▢▢
════════════════════════

*👑 @${botNumber.split("@")[0]}*`);
           for (const i of modlist) {
                reply.push(`${fancy11((c++).toString())}. • _@${i}_`);
           }
           reply.push("\n_▢ Reply 0 to delete every mod_\n_▢ Reply any number to delete that user_\n\n_ID: QA19_");
           return pika.reply(reply.join("\n"), { mentions: [botNumber.split("@")[0], ...modlist].map(v => v + "@s.whatsapp.net") });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "couplepp",
            react: "❤️",
            category: "general",
            desc: "Get anime couple profile picture",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
        const pictures = pickRandom(require('../database/json/couplepp.json'));
        await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(pictures.male),
            caption: "*For Him 💁🏻‍♂️♂️*"
        }, { quoted:pika });
        await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(pictures.female),
            caption: "*For Her 💁🏻‍♀️♀️*"
        }, { quoted:pika });
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "admins",
        alias: ['admin'],
        react: "💖",
        category: "general",
        need: "text",
        desc: "Tag every admin in the group with a text",
        cooldown: 8,
        rule: 5,
        filename: __filename
}, async (anyaV2, pika, { args }) => {
        const message = pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : false)) : (args.length > 0 ? args.join(" ") : false);
        if (!message) return pika.reply("❕Enter a message to tag admins, you can't tag admins without any response");
        const tagm = [];
        const metadata = await anyaV2.groupMetadata(pika.chat);
        tagm.push(`
═══════════════════════
        ░▒▓ \`\`\`GROUP ADMINS\`\`\` ▓▒░
═══════════════════════
*💝 Message :* ${message}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌠 Announcer :* @${pika.sender.split('@')[0]}
*👑 Total Admins :* ${metadata.participants.filter(v => v.admin !== null).length} admins
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`.trim());
        for (const admins of metadata.participants) {
            if (admins.admin !== null) {
                tagm.push(`👑 @${admins.id.split('@')[0]}`);
            }
        }
        const quoted = pika.quoted ? pika.quoted : '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/image/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    image: media,
                    caption: tagm.join('\n'),
                    mentions: metadata.participants.map(v => v.id)
                })
        } else if (/video/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    video: media,
                    caption: tagm.join('\n'),
                    gifPlayback: ((quoted.msg || quoted).seconds > 11) ? true : false,
                    mentions: metadata.participants.filter(v => v.admin !== null).map(v => v.id)
                })
        } else pika.reply(tagm.join('\n'), { mentions: metadata.participants.map(v => v.id) });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "tts",
            alias: ['texttospeech'],
            react: "🗣️",
            need: "text",
            category: "general",
            desc: "Convert text to voice",
            cooldown: 5,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        const message = pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : false)) : (args.length > 0 ? args.join(" ") : false);
        if (!message) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} Text To Say`);
        await anyaV2.sendMessage(pika.chat, {
            audio: await getBuffer(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(message)}&tl=en&total=1&idx=0&textlen=2&client=tw-ob&prev=input&ttsspeed=1`),
            mimetype: 'audio/mp4',
            ptt: false
        }, {quoted:pika})
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "getbio",
            alias: ['getstatus'],
            react: "⚜️",
            need: "user",
            category: "general",
            desc: "Get someone's profile status",
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*${Config.footer} Example:* ${prefix+command} @user1`);
        const user = pika.quoted ? pika.quoted.sender : args.join(" ").replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let response;
        try {
            response = await anyaV2.fetchStatus(user);
        } catch {
            return pika.reply("*❎ Bio Not Found!*");
        }
        return pika.reply(`*👤Bio:* ${response.status}`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "getpp",
            alias: ['getdp'],
            react: "⚜️",
            need: "user",
            category: "general",
            desc: "Get someone's profile picture",
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*${Config.footer} Example:* ${prefix+command} @user1`);
        const user = pika.quoted ? pika.quoted.sender : args.join(" ").replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let ppuser;
        try {
            ppuser = await getBuffer(await anyaV2.profilePictureUrl(user, "image"));
        } catch {
            return pika.reply("*❎ Profile Picture Not Found!*");
        }
        await anyaV2.sendMessage(pika.chat, {
            image: ppuser,
            caption: `*👤Profile Picture:* @${user.split("@")[0]}`,
            mentions: [user]
        }, {quoted:pika});
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "listnum",
            alias: ['listnumber'],
            react: "#️⃣",
            category: "general",
            desc: "Get matching numbers with country codes",
            need: "number",
            rule: 5,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} +1, +91, +43 etc...`);
        const PhoneNumber = require('awesome-phonenumber');
        const codes = args.join(" ").split(',').map(v => v.replace(/[^0-9]/g, ''));
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const owners = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const array = [];
        for (const i of codes) {
            for (const y of metadata.participants.map(v=>v.id)) {
                const code = PhoneNumber('+' + y.split('@')[0]).getCountryCode();
                if (code === Number(i) && !owners.includes(y)) array.push(y);
            }
        }
        if (array.length < 1) return pika.reply("*❎ No Numbers Found!*");
        let caption = `\`\`\`⭔ ⌈ LIST NUMBER ⌋ ⭔\`\`\`\n\n*🌟Results:* ${array.length} results found!\n*🧩Note:* Bot mods aren't included in this list.\n\n`;
        let c = 1;
        for (const i of array) {
            caption += `${c++}. _@${i.split("@")[0]}_\n`;
        }
        caption += `\n${Config.footer}`;
        return pika.reply(caption, { mentions: array });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "onwa",
            alias: ['iswa'],
            react: "🌈",
            need: "number",
            category: "general",
            desc: "Check if number exists on WhatsApp",
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} 91881107xxxx`);
    const number = args.join("").replace(/[^0-9]/g, '');
    const { key } = await pika.keyMsg(Config.message.wait);
    try {
        const onwa = await anyaV2.onWhatsApp(number);
        if (onwa.length > 0) {
            const [ppuser, status] = await Promise.all([
                anyaV2.profilePictureUrl(number + "@s.whatsapp.net", 'image').then(getBuffer).catch(() => getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg')),
                anyaV2.fetchStatus(number + "@s.whatsapp.net").catch(() => false)
            ]);
            await anyaV2.sendMessage(pika.chat, {
                image: ppuser,
                caption: `👤 *@${number} is on WhatsApp!*\n*💖 Bio:* ${status?.status || "~not found~"}`,
                mentions: [`${number}@s.whatsapp.net`]
            }, { quoted: pika });

            pika.deleteMsg(key);
        } else {
            pika.edit("*❌ Can't find this number on WhatsApp*", key);
        }
    } catch (error) {
        console.error(error);
        pika.edit("*❌ An error occurred while processing the request*", key);
    }
});

//༺─────────────────────────────────────༻

anya({
            name: "owner",
            react: "👑",
            category: "core",
            desc: "Get the owner name",
            filename: __filename
     }, async (anyaV2, pika) => {
        const vcard = 'BEGIN:VCARD\n' +
                       'VERSION:3.0\n' +
                       'FN:' + Config.ownername + '\n' +
                       'ORG:;\n' +
                       'TEL;type=CELL;type=VOICE;waid=' +
                       Config.ownernumber +
                       ':+' +
                       Config.ownernumber +
                       '\n' +
                       'END:VCARD';
        return await anyaV2.sendMessage(pika.chat, {
                contacts: {
                    displayName: Config.ownername,
                    contacts: [{ vcard }]
                },
                contextInfo: {
                    externalAdReply: {
                        title: Config.ownername,
                        body: "Tap Here To Chat With Owner",
                        renderLargerThumbnail: true,
                        thumbnailUrl: "",
//                        thumbnail: Config.image_2,
                        mediaType: 2,
                        mediaUrl: `https://wa.me/${Config.ownernumber}?text=${encodeURIComponent("Hey Bro, I'm " + pika.pushName)}`,
                        sourceUrl: `https://wa.me/${Config.ownernumber}?text=${encodeURIComponent("Hey Bro, I'm " + pika.pushName)}`
                    }
                }
        }, {quoted:pika});
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "ping",
            react: "📍",
            category: "general",
            desc: "Bot speed latency",
            filename: __filename
     }, async (anyaV2, pika) => {
          const {key} = await pika.keyMsg("Pinging...");
            const timestamp = require('performance-now')();
            const {exec} = require('child_process');
          exec('neofetch --stdout', async (error, stdout) => {
          const latency = (require('performance-now')() - timestamp).toFixed(2);
               return pika.edit(`*📍Pong ${latency}ms...*`, key);
          });
     }
)