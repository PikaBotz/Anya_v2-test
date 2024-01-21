const axios = require('axios');
const { anya, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "couple",
            react: "👩🏻‍❤️‍👨🏻",
            category: "fun",
            desc: "Find couples in groups",
            rule: 5,
            filename: __filename
     }, async (anyaV2, pika) => {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const participants = metadata.participants;
        if (participants.length <= 3) return pika.reply("*❎ More than 3 members needed*");
        const member1 = pickRandom(participants.map(v => v.id));
        const member2 = pickRandom(participants.filter(v => v.id !== member1).map(v => v.id));
        return pika.reply(`*Ehh, something's SUS~~👀❤️*\n\n*@${member1.split('@')[0]}*\n*- - - 👩🏼‍❤️‍👨🏼 - - -*\n*@${member2.split('@')[0]}*`, { mentions: [member1, member2] });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "fact",
            react: "🤔",
            category: "fun",
            desc: "Fun facts",
            filename: __filename
     }, async (anyaV2, pika) => {
        axios.get("https://nekos.life/api/v2/fact")
        .then(({data})=> pika.reply(`\`\`\`🚀 Fun Facts 🚀\`\`\`\n\n➠ ${data.fact}`))
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "flirt",
            react: "😘",
            category: "fun",
            desc: "Pickup lines",
            filename: __filename
     }, async (anyaV2, pika) => {
        const lines = pickRandom(require('../database/json/pickupLines.json'));
        return pika.reply(`*🐤Aheem~:* ${lines.replace("@user", pika.pushName)}`);
     }
)