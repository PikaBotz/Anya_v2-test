const Config = require('../../config');
const PhoneNumber = require('awesome-phonenumber');
const { System } = require(__dirname + '/../database/mongodb');
const { dayToday, getBuffer, delay } = require(__dirname + '/myfunc');

//༺─────────────────────────────────────༻

const groupEventListener = async (event, anyaV2) => {
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    const user = event.participants[0]; 
    const isBusiness = await anyaV2.getBusinessProfile(user);
    let ppuser;
    try {
        ppuser = await getBuffer(await anyaV2.profilePictureUrl(user, 'image'));
    } catch {
        ppuser = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
    }
    let bio;
        try {
            bio = await anyaV2.fetchStatus(user) || false;
        } catch {
            bio = false;
        }
    const username = await anyaV2.getName(user);
    const metadata = await anyaV2.groupMetadata(event.id);
    const usercon = { key: { participant: '0@s.whatsapp.net', ...({ remoteJid: 'status@broadcast' }), }, message: { contactMessage: { displayName: username, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${username},;;;\nFN:${username}\nitem1.TEL;waid=${user.split("@")[0]}:${user.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_2, thumbnail: Config.image_2, sendEphemeral: true } } };

//༺─────────────────────────────────────༻

    if (event.action === "add") {
        if (system.antifake) {
            const array = system.fakelist;
            for (let i = 0; i < array.length; i++) {
                const code = PhoneNumber('+' + user.split('@')[0]).getCountryCode();
                if (code === Number(array[i])) {
                    try {
                        anyaV2.sendMessage(event.id, {
                            text: `\`\`\`☎️ Antifake Detected!!\`\`\`\n_*@${user.split("@")[0]}* is not allowed in this group!_`,
                            mentions: [user]
                        }, { quoted: usercon });
                        await delay(2000);
                        return await anyaV2.groupParticipantsUpdate(event.id, [user], 'remove');
                    } catch {
                        return console.log("☎️ Antifake Tanana");
                    }
                }
            }
        }
                    if (system.welcome) {
                        const number = getNumInfo(user);
                        return await anyaV2.sendMessage(event.id, {
                            image: ppuser,
                            caption: `
┌┄⌈ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 💐 ⌋
└┬────┈⟮⟮ *@${user.split("@")[0]}* ⟯⟯-❖
   │⟮▢⟯ 𝙉𝙖𝙢𝙚 :
   │⟮▣⟯ ${username}
   │⟮▢⟯ 𝘾𝙤𝙪𝙣𝙩𝙧𝙮 :
   │⟮▣⟯ ${number.country}
   │⟮▢⟯ 𝙏𝙮𝙥𝙚 :
   │⟮▣⟯ ${isBusiness ? "business profile" : "private profile"}
   │⟮▢⟯ 𝙍𝙖𝙣𝙠 :
   │⟮▣⟯ ${metadata.participants.length}th member
   │⟮▢⟯ 𝘿𝙖𝙩𝙚 | 𝙏𝙞𝙢𝙚 :
   │⟮▣⟯ ${dayToday().date} | ${dayToday().time}
   │⟮▢⟯ 𝙎𝙩𝙖𝙩𝙪𝙨 :
   │⟮▣⟯ ${bio.status ? bio.status : "~not found~"}
   └───────────────┄┈༻

_Type *${Config.prefa}welcome off* to turn off this message_`.trim(),
                            contextInfo: {
                                mentionedJid: [user],
                                externalAdReply: {
                                    showAdAttribution: true,
                                    containsAutoReply: true,
                                    title: metadata.subject,
                                    body: username,
                                    previewType: "PHOTO",
                                    thumbnailUrl: "",
                                    thumbnail: ppuser,
                                    sourceUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX",
                                    mediaUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX"
                                }
                            }
                        }, { quoted: usercon }); 
                    }
                }

 //༺─────────────────────────────────────༻
 
 else if (event.action === "remove") {
    if (system.goodbye) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
┌┄⌈ 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 👋🏻 ⌋
└┬────┈⟮⟮ *@${user.split("@")[0]}* ⟯⟯-❖
   │⟮▢⟯ 𝙉𝙖𝙢𝙚 :
   │⟮▣⟯ ${username}
   │⟮▢⟯ 𝙋𝙖𝙨𝙩 𝙍𝙖𝙣𝙠 :
   │⟮▣⟯ ${metadata.participants.length}th member
   │⟮▢⟯ 𝘿𝙖𝙩𝙚 | 𝙏𝙞𝙢𝙚 :
   │⟮▣⟯ ${dayToday().date} | ${dayToday().time}
   └───────────────┄┈༻

_Type *${Config.prefa}goobye off* to turn off this message_`.trim(),
            contextInfo: {
                mentionedJid: [user],
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    title: metadata.subject,
                    body: username,
                    previewType: "PHOTO",
                    thumbnailUrl: "",
                    thumbnail: ppuser,
                    sourceUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX",
                    mediaUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX"
                }
            }
        }, { quoted: usercon }); 
    }
 }
 
 //༺─────────────────────────────────────༻
 
 else if (event.action === "promote") {
    if (system.pdm) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
❝🇵 🇷 🇴 🇲 🇴 🇹 🇪 🇩❞

*🗣️ Name :* @${user.split("@")[0]}
*🍜 Status :* Member ➠ Admin
*📆 Time :* ${dayToday().date} at ${dayToday().time}

_Type *${Config.prefa}pdm off* to turn off this message_
`.trim(),
            mentions: [user]
        }, { quoted: usercon });
    }
 }
 
 //༺─────────────────────────────────────༻
 
 else if (event.action === "demote") {
    if (system.pdm) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
❝🇩 🇪 🇲 🇴 🇹 🇪❞

*🗣️ Name :* @${user.split("@")[0]}
*🏮 Status :* Admin ➠ Member 
*📆 Time :* ${dayToday().date} at ${dayToday().time}

_Type *${Config.prefa}pdm off* to turn off this message_
`.trim(),
            mentions: [user]
        }, { quoted: usercon });
    }
 }
}

//༺─────────────────────────────────────༻

const groupChangesListener = async (event, anyaV2) => {
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    if (!system.gcm) return;
    await delay(1500);
    const group = event[0];
    let ppgroup;
    try {
        ppgroup = await getBuffer(await anyaV2.profilePictureUrl(groupAction[0].id, 'image'));
    } catch {
        ppgroup = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
    }
    if (group.announce === true) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗧𝗵𝗶𝘀 𝗚𝗿𝗼𝘂𝗽 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗖𝗹𝗼𝘀𝗲𝗱\n⧉ _No one can send messages to this group except group admins_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.announce === false) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗧𝗵𝗶𝘀 𝗚𝗿𝗼𝘂𝗽 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗢𝗽𝗲𝗻𝗲𝗱\n⧉ _Anyone can now send messages in this group_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.restrict === true) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗘𝗱𝗶𝘁𝗶𝗻𝗴 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗥𝗲𝘀𝘁𝗿𝗶𝗰𝘁𝗲𝗱\n⧉ _No one can edit group info of this group except group admins_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.restrict === false) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗨𝗻𝗿𝗲𝘀𝘁𝗿𝗶𝗰𝘁𝗲𝗱 𝗘𝗱𝗶𝘁𝗶𝗻𝗴 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀\n⧉ _Anyone can now chnage this group's settings_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲 𝗖𝗵𝗮𝗻𝗴𝗲𝗱\n⧉ *New Name :* ${group.subject}\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
}
    
//༺─────────────────────────────────────༻

function getNumInfo(phoneNumber) {
   const number = new PhoneNumber("+" + phoneNumber, 'ZZ');
   return {
//      valid: true,
//      internationalFormat: number.getNumber('international'),
//      nationalFormat: number.getNumber('national'),
      country: number.getRegionCode(),
//      countryCode: number.getCountryCode(),
    }
}

module.exports = { groupEventListener, groupChangesListener };