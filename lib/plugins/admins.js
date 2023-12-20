const Config = require('../../config');
const { anya, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

anya({
        name: "add",
        react: "👤",
        need: "user",
        category: "admins",
        desc: "Add users to the group",
        rule: 3,
        cooldown: 8,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);  
            } else {
            const action = await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'add');
            const status = {
                200: `✅ Added *@${i.split('@')[0]}*`,
                408: `❌ *@${i.split('@')[0]}* previously left the chat, couldn't add`,
                409: `✅ *@${i.split('@')[0]}* already a member`,
                401: `❌ *@${i.split('@')[0]}* has banned my number`
            }
            if (status[action[0].status]) {
                caption.push(status[action[0].status]);
            } else {
                caption.push(`❌ Can't add *@${i.split('@')[0]}* send invitation!`);
                const gclink = await anyaV2.groupInviteCode(pika.chat);
                const metadata = await anyaV2.groupMetadata(pika.chat);
                let ppgc;
                try {
                    ppgc = await anyaV2.profilePictureUrl(pika.chat, 'image');
                } catch {
                    ppgc = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
                }
                await anyaV2.sendMessage(i, {
                    text: `_You're invited by @${pika.sender.split('@')[0]}_`,
                    mentions: [pika.sender],
                    contextInfo:{
                        mentionedJid:[pika.sender],
                        externalAdReply: {
                            renderLargerThumbnail: true,
                            title: metadata.subject,
                            mediaType: 1,
                            thumbnail: await getBuffer(ppgc),
                            mediaUrl: "https://chat.whatsapp.com/" + gclink,
                            sourceUrl: "https://chat.whatsapp.com/" + gclink
                        }
                    } 
                }).catch((err) => console.log(err));
            }
        }
    }
     pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "kick",
        alias: ['remove'],
        react: "🪂",
        need: "user",
        category: "admins",
        desc: "Kick users from the group",
        rule: 3,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to kick!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
               const action = await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'remove');
               const status = {
                404: `❌ *@${i.split('@')[0]}* not found in this group`,
                200: `✅ Removed *@${i.split('@')[0]}*`
               }
               if (status[action[0].status]) {
                caption.push(status[action[0].status]);
               } else {
                caption.push(`❌ An unexpected error code "${action[0].status}"`);
               }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "invite",
   	    react: "💐",
   	    need: "user",
   	    category: "admins",
    	desc: "Invite ussrs to the group",
    	rule: 3,
    	filename: __filename
    },
    async (anyaV2, pika, { args, prefix, comamnd }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const gclink = await anyaV2.groupInviteCode(pika.chat);
        let ppgc;
        try {
            ppgc = await anyaV2.profilePictureUrl(pika.chat, 'image');
        } catch {
            ppgc = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
        }
        const thumbnail = await getBuffer(ppgc);
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                const metadata = await anyaV2.groupMetadata(pika.chat);
                if (metadata.participants.map(v => v.id).includes(i)) {
                    caption.push(`✅ *@${i.split('@')[0]}* already a member`);
                } else {
                    await anyaV2.sendMessage(i, {
                        text: `_You're invited by @${pika.sender.split('@')[0]}_`,
                        mentions: [pika.sender],
                        contextInfo:{
                            mentionedJid:[pika.sender],
                            externalAdReply: {
                                renderLargerThumbnail: true,
                                title: metadata.subject,
                                mediaType: 1,
                                thumbnail: thumbnail,
                                mediaUrl: "https://chat.whatsapp.com/" + gclink,
                                sourceUrl: "https://chat.whatsapp.com/" + gclink
                            }
                        } 
                    })
                    .then(() => caption.push(`✅ Invited *@${i.split('@')[0]}*`))
                    .catch((err) => console.log(err));
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    } 
)
