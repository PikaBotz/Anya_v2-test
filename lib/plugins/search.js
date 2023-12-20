const axios = require('axios');
const { anya, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

anya(
    {
        name: "animewall",
        alias: ['animewallpaper'],
        react: "🖼️",
        category: "search",
        desc: "High quality anime wallpapers",
        cooldown: 3,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} hinata with naruto`);
        axios.get("https://nekos.life/api/v2/img/wallpaper")
        .then(async (response) => {
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(response.data.url),
                    caption: "Rᴇᴘʟʏ 1 Fᴏʀ Nᴇxᴛ\n_ID: QA02_"
                },
                {
                    quoted: pika
                })
        })
    }
)