const Config = require('../../config');
const { anya, delay, getBuffer, User, Bot, System, UI, getAdmin, addWarn, delWarn, clearWarn } = require('../lib');

//༺─────────────────────────────────────༻

anya({
        name: "block",
        react: "🚧",
        need: "user",
        category: "owner",
        desc: "Block users from bot number",
        rule: 1,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to block!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const blocklist = await anyaV2.fetchBlocklist();
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (userOwner.includes(i)) {
                    caption.push(`🌟 Can't block my owner *@${i.split('@')[0]}*`);
                } else {
                if (blocklist.includes(i)) {
                    caption.push(`☑️ *@${i.split('@')[0]}* is already blocked`);
                } else {
                    const action = await anyaV2.updateBlockStatus(i, 'block');
                    caption.push(`✅ Blocked *@${i.split('@')[0]}*`);
                }
            }
          }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "unblock",
        react: "🚧",
        need: "user",
        category: "owner",
        desc: "Unblock users from bot number",
        rule: 1,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to unblock!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const blocklist = await anyaV2.fetchBlocklist();
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (!blocklist.includes(i)) {
                    caption.push(`⭕ *@${i.split('@')[0]}* is already unblocked`);
                } else {
                    const action = await anyaV2.updateBlockStatus(i, 'unblock');
                    caption.push(`✅ Unblocked *@${i.split('@')[0]}*`);
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "setpp",
        alias: ['setbotpp'],
        react: "🧿",
        need: "image",
        category: "owner",
        desc: "Set bot profile picture",
        rule: 1,
        filename: __filename
     },
     async (anyaV2, pika, { prefix, command }) => {
            const quoted = pika.quoted ? pika.quoted : pika;
            const mime = quoted.msg ? quoted.msg : quoted.mimetype ? quoted.mimetype : quoted.mediaType || '';
            if (/image/.test(mime)) {
                const { key } = await pika.keyMsg(Config.message.wait);
                const media = await quoted.download();
                const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
                await anyaV2.updateProfilePicture(botnumber, media)
                .then(() => pika.edit(Config.message.success, key))
                .catch((err) => {
                    console.error(err);
                    pika.edit(Config.message.error);
                });
            } else pika.reply(`Tag or reply an image with caption *${prefix + command}*`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "restart",
            react: "♻️",
            category: "owner",
            desc: "Use to restart the bot",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika) => {
        const { exec } = require("child_process");
        pika.reply("*Restarting...*");
        await delay(1500);
        exec('pm2 restart all');
     }
)

//༺─────────────────────────────────────༻

/*
anya({
            name: "pin",
            react: "📌",
            category: "owner",
            desc: "Pin messages",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        if (args.length > 0) {
            const {key} = await pika.keyMsg(args.join(" "));
            return await anyaV2.sendMessage(pika.chat, {
                pinMessage: {
                    pinInChatMessage: {
                        key: key,
                        type: 1
                    },
                    duration: 604800
                }
            });
        } else if (pika.quoted) {
            return await anyaV2.sendMessage(pika.chat, {
                pinMessage: {
                    pinInChatMessage: {
                        key: pika.quoted.key,
                        type: 1
                    },
                    duration: 604800
                }
            });
        } else pika.reply("Tag or write a message to pin");
     }
)
*/

//༺─────────────────────────────────────༻

anya({
            name: "ban",
            react: "🚫",
            category: "owner",
            need: "user",
            desc: "Ban user from using commands",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to ban!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const {key} = await pika.keyMsg(Config.message.wait);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (userOwner) {
                    caption.push(`🌟 Can't ban my owner *@${i.split('@')[0]}*`);
                } else {
                const user = await User.findOne({ id: i.split("@")[0] }) || await new User({ id: i.split("@")[0] }).save();
                if (user.ban) {
                    caption.push(`☑️ *@${i.split('@')[0]}* is already banned`);
                } else {
                    await User.findOneAndUpdate({ id: i.split("@")[0] }, { $set: { ban: true } }, { new: true });
                    caption.push(`✅ Banned *@${i.split('@')[0]}*`);
                }
            }
          }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "unban",
            react: "🥁",
            category: "owner",
            need: "user",
            desc: "Unban user from using commands",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to unban!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const {key} = await pika.keyMsg(Config.message.wait);
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                const user = await User.findOne({ id: i.split("@")[0] }) || await new User({ id: i.split("@")[0] }).save();
                if (!user.ban) {
                    caption.push(`⭕ *@${i.split('@')[0]}* is already unbanned`);
                } else {
                    await User.findOneAndUpdate({ id: i.split("@")[0] }, { $set: { ban: false } }, { new: true });
                    caption.push(`✅ Unbanned *@${i.split('@')[0]}*`);
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "addmod",
            react: "🌟",
            category: "owner",
            need: "user",
            desc: "Add users as bot owner",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add to modlist!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const {key} = await pika.keyMsg(Config.message.wait);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (userOwner.includes(i)) {
                    caption.push(`☑️ *@${i.split('@')[0]}* is already a mod`);
                } else {
                    bot.modlist.push(i.split("@")[0]);
                    await bot.save();
                    caption.push(`✅ Added *@${i.split('@')[0]}* as mod`);
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "delmod",
            react: "❌",
            category: "owner",
            need: "user",
            desc: "Remove users from the bot owner's modlist",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to remove from modlist!*`);    
        const text = args.join(" ");
        const users = pika.quoted ? text.includes("selectedButtonMsg") ? text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net') : [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const caption = [];  
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                const userIndex = bot.modlist.indexOf(i.split("@")[0]);
                if (userIndex === -1) {
                    caption.push(`⭕ *@${i.split('@')[0]}* is not a mod`);
                } else {
                    bot.modlist.splice(userIndex, 1);
                    await bot.save();
                    caption.push(`✅ Removed *@${i.split('@')[0]}* from modlist`);
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "autoreply",
            react: "🤖",
            category: "owner",
            desc: "Turn on/off bot autoreply",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.autoReply) {
                return pika.reply("_⭕ Already Enabled Autoreply_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoReply: true } }, { new: true });
                return pika.reply("✅ Autoreply Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.autoReply) {
                return pika.reply("_⭕ Already Disabled Autoreply_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoReply: false } }, { new: true });
                return pika.reply("✅ Autoreply Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "chatbot",
            react: "🤖",
            category: "owner",
            desc: "Artificial intelligence chatbot for private chat",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.chatbot) {
                return pika.reply("_⭕ Already Enabled Chatbot_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { chatbot: true } }, { new: true });
                return pika.reply("✅ Chatbot Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.chatbot) {
                return pika.reply("_⭕ Already Disabled Chatbot_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { chatbot: false } }, { new: true });
                return pika.reply("✅ Chatbot Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "cooldown",
            react: "❄️",
            category: "owner",
            desc: "Cooldown over commands",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.cooldown) {
                return pika.reply("_⭕ Already Enabled Cooldown_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { cooldown: true } }, { new: true });
                return pika.reply("✅ Cooldown Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.cooldown) {
                return pika.reply("_⭕ Already Disabled Cooldown_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { cooldown: false } }, { new: true });
                return pika.reply("✅ Cooldown Turned Off!\n\n*⚠️ Cooldown helps this bot to secure your number by getting banned due to spamming. I highly recommend you to use cooldown*");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "autobio",
            react: "💖",
            category: "owner",
            desc: "Set anime quotes on status randomly",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.autoBio) {
                return pika.reply("_⭕ Already Enabled Autobio_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoBio: true } }, { new: true });
                return pika.reply("✅ Autobio Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.autoBio) {
                return pika.reply("_⭕ Already Disabled Autobio_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoBio: false } }, { new: true });
                return pika.reply("✅ Autobio Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "antipm",
            alias: ['autoblock'],
            react: "💥",
            category: "owner",
            desc: "Auto block if someone messaging in private",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.autoBlock) {
                return pika.reply("_⭕ Already Enabled Autoblock_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoBlock: true } }, { new: true });
                return pika.reply("✅ Autoblock Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.autoBlock) {
                return pika.reply("_⭕ Already Disabled Autoblock_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoBlock: false } }, { new: true });
                return pika.reply("✅ Autoblock Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "onlypm",
            alias: ['onlypc'],
            react: "🌀",
            category: "owner",
            desc: "Bot will run only in private chat",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
          const text = args.join(" ").toLowerCase();
          const bot = await Bot.findOne({ id: "anyabot" });
          const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
          let reply = [];
          if (/on/.test(text)) {
              if (bot.onlypm) {
                reply.push("_⭕ Already Enabled Onlypm_");
              } else {
                await Bot.updateOne({ id: "anyabot" }, { onlypm: true });
                reply.push("✅ Onlypm Turned On!");
                if (system.autoBlock) {
                    await System.updateOne({ id: "system" }, { autoBlock: false });
                    reply.push("✅ Automatically Turned Off Antipm");
                }
              }
          } else if (/off/.test(text)) {
              if (!bot.onlypm) {
                reply.push("_⭕ Already Disabled Onlypm_");
              } else {
                await Bot.updateOne({ id: "anyabot" }, { onlypm: false });
                reply.push("✅ Onlypm Turned Off!");
              }
          } else {
              reply.push(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
          }
          pika.reply(reply.join("\n"));
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "react",
            alias: ['reaction'],
            react: "💝",
            category: "owner",
            desc: "Commands reaction switch",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
          const text = args.join(" ").toLowerCase();
          const bot = await Bot.findOne({ id: "anyabot" });
          const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
          let reply = [];
          if (/on/.test(text)) {
              if (bot.react) {
                reply.push("_⭕ Already Enabled Command Reaction_");
              } else {
                await Bot.updateOne({ id: "anyabot" }, { react: true });
                reply.push("✅ Command Reaction Turned On!");
                if (system.autoReactMsg) {
                    await System.updateOne({ id: "system" }, { autoReactMsg: false });
                    reply.push("✅ Automatically Turned Off Auto React All Messages");
                }
              }
          } else if (/off/.test(text)) {
              if (!bot.react) {
                reply.push("_⭕ Already Disabled Command Reaction_");
              } else {
                await Bot.updateOne({ id: "anyabot" }, { react: false });
                reply.push("✅ Command Reaction Turned Off!");
              }
          } else {
              reply.push(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
          }
          pika.reply(reply.join("\n"));
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "reactmsg",
            alias: ['reactionmsg'],
            react: "💗",
            category: "owner",
            desc: "Auto React All Messages switch",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
           const text = args.join(" ").toLowerCase();
           const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
           const bot = await Bot.findOne({ id: "anyabot" });
           let reply = [];
           if (/on/.test(text)) {
            if (system.autoReactMsg) {
                reply.push("_⭕ Already Enabled Auto React All Messages_");
            } else {
                await System.updateOne({ id: "system" }, { autoReactMsg: true });
                reply.push("✅ Auto React All Messages Turned On!");
                if (bot.react) {
                    await Bot.updateOne({ id: "anyabot" }, { react: false });
                    reply.push("✅ Automatically Turned Off Command Reaction");
                }
            }
        } else if (/off/.test(text)) {
            if (!system.autoReactMsg) {
                reply.push("_⭕ Already Disabled Auto React All Messages_");
            } else {
                await System.updateOne({ id: "system" }, { autoReactMsg: false });
                reply.push("✅ Auto React All Messages Turned Off!");
            }
        } else {
            reply.push(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
        }
        pika.reply(reply.join("\n"));
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "mode",
            react: "🎀",
            category: "owner",
            desc: "Change mode to self or public",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
          const text = args.join(" ").toLowerCase();
          const bot = await Bot.findOne({ id: "anyabot" });
          if (/public/.test(text)) {
              if (bot.worktype === "public") return pika.reply("_⭕ Already Enabled Public Mode_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { worktype: "public" });
                return pika.reply("✅ Enabled Public Mode");
              }
          } else if (/self|private/.test(text)) {
              if (bot.worktype === "self") return pika.reply("_⭕ Already Enabled Self Mode_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { worktype: "self" });
                return pika.reply("✅ Enabled Self Mode");
              }
          } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} public/self`);
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "autostatus",
            react: "👀",
            category: "owner",
            desc: "Automatically mark contacts status as seen",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
          const text = args.join(" ").toLowerCase();
          const bot = await Bot.findOne({ id: "anyabot" });
          if (/on/.test(text)) {
              if (bot.autoStatusRead) return pika.reply("_⭕ Already Enabled Auto Status View_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { autoStatusRead: true });
                return pika.reply("✅ Enabled Auto Status View");
              }
          } else if (/off/.test(text)) {
              if (!bot.autoStatusRead) return pika.reply("_⭕ Already Disabled Auto Status View_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { autoStatusRead: false });
                return pika.reply("✅ Enabled Self Mode");
              }
          } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} public/self`);
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "prefix",
            react: "🎀",
            category: "owner",
            desc: "Change prefix to single or multiple",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
          const text = args.join(" ").toLowerCase();
          const bot = await Bot.findOne({ id: "anyabot" });
          if (/single/.test(text)) {
              if (bot.prefix === "single") return pika.reply("_⭕ Already Enabled Single Prefix_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "single" });
                return pika.reply("✅ Enabled Single Prefix");
              }
          } else if (/multi|multiple/.test(text)) {
              if (bot.prefix === "multi") return pika.reply("_⭕ Already Enabled Multi Prefix Support_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "multi" });
                return pika.reply("✅ Enabled Multi Prefix");
              }
          } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} single/multi\n\n• Single : bot will obey the commands that only starts with *" ${Config.prefa} "*\n• Multi : bot will obey every command with every prefix except *no prefix*`);
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "setbio",
            alias: ['setstatus'],
            react: "💫",
            need: "text",
            category: "owner",
            desc: "Set bot number status",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix }) => {
        if (!pika.quoted && args.length < 1) return pika.reply("Enter some texts to update status");
        const bot = await Bot.findOne({ id: "anyabot" });
        await anyaV2.updateProfileStatus(pika.quoted ? pika.quoted.text : args.join(" "))
        .then(res=> pika.reply(`${Config.message.success}\n\n${bot.autoBio ? "_❕ Your status will automatically get changed because *" + prefix + "autobio* is enabled._" : "*Hint: Use " + prefix + "autobio to set random anime quotes in bio automatically.*"}`))
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "addwarn",
            alias: ['warn'],
            react: "📈",
            need: "user",
            category: "owner",
            desc: "Warn users",
            rule: 1,
            filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to warn!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const reason = users.length > 1 ? "can't specify" : (args.length > 0 ? text : "not provided");
        const keyMsg = await pika.keyMsg(Config.message.wait);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const caption = [];
        const exceeded = [];
        const isPrivateChat = pika.chat.endsWith("@s.whatsapp.net");
        const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (userOwner.includes(i)) {
                    caption.push(`🌟 Can't warn my owner *@${i.split('@')[0]}*`);
                } else {
                    const res = await addWarn(i.split("@")[0], { chat: isPrivateChat ? 1 : 2, reason: reason });
                    if (res.status === 201 || res.status === 200) {
                        caption.push(`✅ Warned *@${i.split("@")[0]}*\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                    } else if (res.status === 429 && /already/.test(res.message)) {
                        caption.push(`⭕ *@${i.split("@")[0]}* already exceeded warns limit\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                    } else if (res.status === 429 && /after/.test(res.message)) {
                        caption.push(`✅ Warned *@${i.split("@")[0]}*\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                        exceeded.push(i);
                    }
                }
            }
        }
        pika.edit(caption.join(caption.length > 2 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'), keyMsg.key, { mentions: users });
        if (exceeded.length > 0) {
            let array = "";
            if (exceeded.length > 1) {
                let lastUser = exceeded.pop();
                array = `${exceeded.map(v => "@" + v.split("@")[0]).join(", ")} and @${lastUser.split("@")[0]}`;
            } else if (exceeded.length === 1) {
                array = `@${exceeded[0].split("@")[0]}`;
            }
            const groupAdmins = await getAdmin(anyaV2, pika);
            const isBotAdmin = pika.isGroup ? groupAdmins.includes(botNumber) : false;
            return await anyaV2.sendMessage(pika.chat, 
                    {
                        text: `💫 *${array}* exceeded their warn limits so I'm ${!isBotAdmin ? 'banning and blocking' : 'banning, blocking and kicking'} them!`,
                        mentions: exceeded
                    },
                    {
                        quoted: pika
                    })
                    .then(async ()=> {
                        const user = await User.findOne({ id: i.split("@")[0] }) || await new User({ id: i.split("@")[0] }).save();
                        for (const i of exceeded) {
                            await anyaV2.updateBlockStatus(i, 'block');
                            await User.findOneAndUpdate({ id: i.split("@")[0] }, { $set: { ban: true } }, { new: true });
                        }
                        if (isBotAdmin) {
                            for (const i of exceeded) {
                                await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'remove');
                            }
                        }
                    }
            );
        }
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "delwarn",
            react: "📉",
            category: "owner",
            need: "user",
            desc: "Decrease user's warns",
            rule: 1,
            filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to decrease their warn!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const reason = users.length > 1 ? "can't specify" : (args.length > 0 ? text : "not provided");
        const keyMsg = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const isPrivateChat = pika.chat.endsWith("@s.whatsapp.net");
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                const res = await delWarn(i.split("@")[0], { chat: isPrivateChat ? 1 : 2, reason: reason });
                if (res.status === 404 || (res.status === 200 && /already/.test(res.message))) {
                    caption.push(`❌ *@${i.split("@")[0]}* has 0 warns\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                } else if (res.status === 200 && /became/.test(res.message)) {
                    caption.push(`✅ Reseted *@${i.split("@")[0]}'s* warns to 0\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                } else if (res.status === 200 && /decreased/.test(res.message)) {
                    caption.push(`✅ Unwarned *@${i.split("@")[0]}*\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                }
            }
        }
        pika.edit(caption.join(caption.length > 2 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'), keyMsg.key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "resetwarn",
            alias: ['clearwarn', 'resetwarns', 'clearwarns'],
            react: "📊",
            category: "owner",
            need: "user",
            desc: "Reset user's all warns",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to reset their warn!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const keyMsg = await pika.keyMsg(Config.message.wait);
        const caption = [];
        for (const i of users) {
            const exist = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (exist.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                const res = await clearWarn(i.split("@")[0]);
                if (res.status === 404) {
                    caption.push(`❌ *@${i.split("@")[0]}* has 0 warns\n└ _current warns : 0_`);
                } else if (res.status === 200) {
                    caption.push(`✅ Reseted *@${i.split("@")[0]}'s* warns to 0\n└ _current warns : 0_`);
                }
            }
        }
        pika.edit(caption.join(caption.length > 2 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'), keyMsg.key, { mentions: users });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setmenu",
            react: "❤️‍🔥",
            category: "owner",
            desc: "Set menu message type",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
        if (/1/.test(text)) {
            if (ui.menu === 1) {
                return pika.reply("_⭕ Menu Type Is Already *Image Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 1 } }, { new: true });
                return pika.reply("✅ Activated *Image Message* for menu");
            }
        } else if (/2/.test(text)) {
            if (ui.menu === 2) {
                return pika.reply("_⭕ Menu Type Is Already *Image Ad Template Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 2 } }, { new: true });
                return pika.reply("✅ Activated *Image Ad Template Message* for menu");
            }
        } else if (/3/.test(text)) {
            if (ui.menu === 3) {
                return pika.reply("_⭕ Menu Type Is Already *Video Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 3 } }, { new: true });
                return pika.reply("✅ Activated *Video Message* for menu");
            }
        } else if (/4/.test(text)) {
            if (ui.menu === 4) {
                return pika.reply("_⭕ Menu Type Is Already *Video Ad Template Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 4 } }, { new: true });
                return pika.reply("✅ Activated *Video Ad Template Message* for menu");
            }
        } else if (/5/.test(text)) {
            if (ui.menu === 5) {
                return pika.reply("_⭕ Menu Type Is Already *Text Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 5 } }, { new: true });
                return pika.reply("✅ Activated *Text Message* for menu");
            }
        } else if (/6/.test(text)) {
            if (ui.menu === 6) {
                return pika.reply("_⭕ Menu Type Is Already *Text Ad Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 6 } }, { new: true });
                return pika.reply("✅ Activated *Text Ad Message* for menu");
            }
        } else if (/7/.test(text)) {
            if (ui.menu === 7) {
                return pika.reply("_⭕ Menu Type Is Already *Document Message*_");
            } else {
                await UI.updateOne({ id: "userInterface" }, { $set: { menu: 7 } }, { new: true });
                return pika.reply("✅ Activated *Document Message* for menu");
            }
        } else await anyaV2.sendMessage(pika.chat,
            {
                image: await getBuffer("https://i.ibb.co/ZK0N16S/ai-generated-ai-generative-beautiful-nature-outdoor-landscape-beautiful-sunset-coastline-sea-95211-2.jpg"),
                caption: `
*Select Your Desired Menu Type*

\`\`\`𝟭. • image message
𝟮. • image ad template
𝟯. • video message
𝟰. • video ad template
𝟱. • text message
𝟲. • text ad template
𝟳. • document message\`\`\`

𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵
_ID: QA18_
`.trim()
            },
            {
                quoted:pika
            });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "antiwords",
            alias: ['antiword', 'antitoxic', 'antibad'],
            react: "🎀",
            category: "owner",
            need: "words",
            desc: "Add words to the antibad list",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} word1, word2, word3 etc...\n\n*Use ${prefix}enable antiword to enable antiwords*`);    
        const text = args.join(" ");
        const words = pika.quoted ? pika.quoted.text.split(',').map(v => v.trim().toLowerCase()) : text.split(',').map(v => v.trim().toLowerCase());    
        const system = await System.findOne({ id: 'system' });
        const existings = system.badWords.filter(existing => words.some(newWord => existing.includes(newWord)));  
        const newWords = new Set([...system.badWords, ...words]);
        if (existings.length === words.length) return pika.reply("❎ All words already exist");
        system.badWords = Array.from(newWords);
        await system.save();
        const reply = [`✅ Added words to antiword: *${words.join("*, *")}*`];
        if (existings.length > 0) reply.push(`⭕ Already existing antiwords: *${existings.join("*, *")}*`);
        reply.push(`_Hint : Use ${prefix}delword to delete words_`);
        return pika.reply(reply.join("\n\n"));
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "delword",
            alias: ['deleteword', 'removeword'],
            react: "🗑️",
            category: "owner",
            need: "words",
            desc: "Remove words from the antibad list",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
         if (args.length < 1) return pika.reply(`*Eg:* ${prefix + command} word1, word2, word3 etc...`);
         const text = args.join(" ");
         const words = text.split(',').map(v => v.trim().toLowerCase());
         const system = await System.findOne({ id: 'system' });
         const existings = system.badWords.map(word => word.toLowerCase());
         const notExists = words.filter(word => !existings.includes(word));
         const filter = words.filter(word => existings.includes(word));
         if (filter.length < 1) return pika.reply(`❎ Words not found in the antibad list: *${notExists.join("*, *")}*`);
         const updatedWords = existings.filter(word => !words.includes(word));
         system.badWords = updatedWords;
         await system.save();
         const reply = [];
         if (filter.length > 0) reply.push(`✅ Removed words from antiword: *${filter.join("*, *")}*`);
         if (notExists.length > 0) reply.push(`⭕ Words not found in antiword: *${notExists.join("*, *")}*`);
         return pika.reply(reply.join("\n\n"));
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "antibot",
            react: "🤖",
            category: "owner",
            desc: "Antibot for all groups",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.antibot) {
                return pika.reply("_⭕ Already Enabled Antibot For All Groups_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antibot: true } }, { new: true });
                return pika.reply("✅ Antibot For All Groups Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.antibot) {
                return pika.reply("_⭕ Already Disabled Antibot For All Groups_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antibot: false } }, { new: true });
                return pika.reply("✅ Antibot For All Groups Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "autoread",
            alias: ['automsgread'],
            react: "📑",
            category: "owner",
            desc: "Automatically read upcoming messages",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.autoMsgRead) {
                return pika.reply("_⭕ Already Enabled Auto Msg Read_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoMsgRead: true } }, { new: true });
                return pika.reply("✅ Auto Msg Read Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.autoMsgRead) {
                return pika.reply("_⭕ Already Disabled Auto Msg Read_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoMsgRead: false } }, { new: true });
                return pika.reply("✅ Auto Msg Read Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "autotyping",
            alias: ['autotype'],
            react: "✍🏻",
            category: "owner",
            desc: "Auto typing seen switch",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.autoTyping) {
                return pika.reply("_⭕ Already Enabled Auto Typing_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoTyping: true } }, { new: true });
                return pika.reply("✅ Auto Typing Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.autoTyping) {
                return pika.reply("_⭕ Already Disabled Auto Typing_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { autoTyping: false } }, { new: true });
                return pika.reply("✅ Auto Typing Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "antifake",
            react: "🤥",
            category: "owner",
            desc: "Remove fake numbers from the group",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.fakelist < 1) return pika.reply(`❕Please add country code to the fake list using *${prefix}addantifake* before turning it on.`);
            else if (system.antifake) {
                return pika.reply("_⭕ Already Enabled Antifake_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antifake: true } }, { new: true });
                return pika.reply("✅ Antifake Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.antifake) {
                return pika.reply("_⭕ Already Disabled Antifake_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antifake: false } }, { new: true });
                return pika.reply("✅ Antifake Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "addantifake",
            react: "📈",
            category: "owner",
            need: "numbers",
            desc: "Add fake numbers country codes",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);    
        const text = args.join(" ");
        const numbers = pika.quoted ? pika.quoted.text.split(',').map(v => v.replace(/[^0-9,]/g, '')) : text.split(',').map(v => v.replace(/[^0-9,]/g, ''));
        const system = await System.findOne({ id: 'system' });
        const existings = system.fakelist.filter(existing => numbers.some(newNum => existing.includes(newNum)));  
        const newNumbers = new Set([...system.fakelist, ...numbers]);
        if (existings.length === numbers.length) return pika.reply("❎ All country codes already exist");
        system.fakelist = Array.from(newNumbers);
        await system.save();
        const reply = [`✅ Added country codes to antifake: *+${numbers.join("*, *+")}*`];
        if (existings.length > 0) reply.push(`⭕ Already existing country codes: *+${existings.join("*, *+")}*`);
        reply.push(`_Hint : Use ${prefix}delantifake to delete country codes_`);
        return pika.reply(reply.join("\n\n"));
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "delantifake",
            react: "🗑️",
            category: "owner",
            need: "numbers",
            desc: "Delete fake numbers country codes",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
         if (args.length < 1) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);
         const text = args.join(" ");
         const numbers = text.split(',').map(v => v.trim().toLowerCase());
         const system = await System.findOne({ id: 'system' });
         const existings = system.fakelist.map(num => num.toLowerCase());
         const notExists = numbers.filter(num => !existings.includes(num));
         const filter = numbers.filter(num => existings.includes(num));
         if (filter.length < 1) return pika.reply(`❎ Numbers not found in the antifake list: *+${notExists.join("*, *+")}*`);
         const updatedNumbers = existings.filter(num => ! numbers.includes(num));
         system.fakelist = updatedNumbers;
         await system.save();
         const reply = [];
         if (filter.length > 0) reply.push(`✅ Removed country codes from fakelist: *+${filter.join("*, *+")}*`);
         if (notExists.length > 0) reply.push(`⭕ Country codes not found in fakelist: *+${notExists.join("*, *+")}*`);
         return pika.reply(reply.join("\n\n"));
     }
)

//༺─────────────────────────────────────༻

const events = [
    {
        cmd: 'welcome',
        emoji: "💐",
        desc: "Welcome message when someone enters the group chat"
    },
    {
        cmd: 'goodbye',
        emoji: "👋🏻",
        desc: "Goodbye message when someone left the group chat"
    },
    {
        cmd: 'pdm',
        emoji: "🧩",
        desc: "Promote • Demote message when someone get promoted to member to admin or admin to member"
    },
    {
        cmd: 'gcm',
        emoji: "🎀",
        desc: "Group changes messages"
    }
];
events.forEach(event => {
    anya({
            name: event.cmd,
            react: event.emoji,
            category: "owner",
            desc: event.desc,
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const name = command.charAt(0).toUpperCase() + command.slice(1);
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system[command]) {
                return pika.reply(`_⭕ Already Enabled ${name} Message_`);
            } else {
                await System.updateOne({ id: "system" }, { $set: { [command]: true } }, { new: true });
                return pika.reply(`✅ ${name} Message Turned On!`);
            }
        } else if (/off/.test(text)) {
            if (!system[command]) {
                return pika.reply(`_⭕ Already Disabled ${name} Message_`);
            } else {
                await System.updateOne({ id: "system" }, { $set: { [command]: false } }, { new: true });
                return pika.reply(`✅ ${name} Message Turned Off!`);
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
    });
});

//༺─────────────────────────────────────༻

anya({
            name: "antionce",
            alias: ['antionceview'],
            react: "🕜",
            category: "owner",
            desc: "No one able to send once view messages",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ").toLowerCase();
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (/on/.test(text)) {
            if (system.antionce) {
                return pika.reply("_⭕ Already Enabled Anti Once View_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antionce: true } }, { new: true });
                return pika.reply("✅ Anti Once View Turned On!");
            }
        } else if (/off/.test(text)) {
            if (!system.antionce) {
                return pika.reply("_⭕ Already Disabled Anti Once View_");
            } else {
                await System.updateOne({ id: "system" }, { $set: { antionce: false } }, { new: true });
                return pika.reply("✅ Anti Once View Turned Off!");
            }
        } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "delete",
            alias: ['del'],
            react: "✅",
            category: "owner",
            desc: "Delete messages sent by this number",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { prefix, command }) => {
        if (!pika.quoted) return pika.reply("Tag a message to delete");
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (pika.quoted.sender !== botNumber) return pika.reply(!pika.isGroup ? "Tag a message sent by this number" : `Use *${prefix+command}2* to delete other's messages as admin`);
        anyaV2.sendMessage(pika.chat, { delete: pika.quoted.fakeObj.key });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "edit",
            alias: ['e'],
            need: "text",
            react: "✅",
            category: "owner",
            desc: "Edit messages sent by this number",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        if (!pika.quoted) return pika.reply("❕Tag a message to edit");
        if (args.length < 1) return pika.reply("❕ Write a message also, to replace current message");
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (pika.quoted.sender !== botNumber) return pika.reply("This message isn't sent by me!");
        return await pika.edit(args.join(" "), pika.quoted.fakeObj.key);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "join",
            react: "💖",
            category: "owner",
            need: "url",
            desc: "Join groups with this number",
            filename: __filename
}, async (anyaV2, pika, { args }) => {
    try {
        if (args.length < 1 || !/https:\/\/chat.whatsapp.com\//.test(args.join(" "))) return pika.reply("❕Enter a valid group chat link to join");
        const inviteCode = args.join(" ").split("https://chat.whatsapp.com/")[1];
        const info = await anyaV2.groupGetInviteInfo(inviteCode).catch(() => {});        
        if (!info) return pika.reply("*❎ Invalid Url or unable to fetch group info*");
        const metadata = await anyaV2.groupMetadata(info.id).catch(() => {});
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (metadata && metadata.participants.map(v => v.id).includes(botNumber)) return pika.reply("☑️ I'm already in this group chat");
        await anyaV2.groupAcceptInvite(inviteCode);
        pika.reply(Config.message.success);
    } catch (e) {
        console.error(e);
        return pika.reply("❌ Unable to join this group chat");
    }
});

//༺─────────────────────────────────────༻

anya({
            name: "kickall",
            alias: ['removeall'],
            react: "☠️",
            category: "owner",
            desc: "Remove everyone from the group",
            cooldown: 10,
            rule: 6,
            filename: __filename
     }, async (anyaV2, pika) => {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (!metadata.participants.filter(v => v.admin !== null).map(v => v.id).includes(botNumber)) return pika.reply("❌I'm sorry, I'm not an admin!");
        const bot = await Bot.findOne({ id: 'anyabot' });
        const owners = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
        if (system.goodbye) {
            await System.updateOne({ id: "system" }, { $set: { goodbye: false } }, { new: true });
            pika.reply("✅ Automatically Turned off goodbye message!");
            await delay(500);
        }
        for (const i of metadata.participants.map(v => v.id)) {
            if (!owners.includes(i)) {
                await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'remove');
                await delay(100);
            }
        }
        return pika.reply("*✅ Done! kicked everyone*");
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "leavegc",
            alias: ['leavegroup'],
            react: "🌱",
            category: "owner",
            desc: "Leave group by bot Number",
            rule: 6,
            filename: __filename
     }, async (anyaV2, pika) => {
        pika.reply("```🌠 Leaving Group...```");
        await delay(1000);
        await anyaV2.groupLeave(pika.chat);
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const owners = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        for (const i of owners) {
            await anyaV2.sendMessage(i, { text: `🌇 Leaved A Group By *@${pika.sender.split("@")[0]}*`, mentions: [pika.sender] }, { quoted:pika }).catch(()=>{});
        }
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "stealpp",
            alias: ['stealdp'],
            react: "🔥",
            need: "user",
            category: "owner",
            desc: "Steal other's profile picture",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} @user`);
        const user = pika.quoted ? pika.quoted.sender : args.join(" ").replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (user === botNumber) return pika.reply('_🙅🏻 I can\'t steal my own profile picture_');
        const {key} = await pika.keyMsg(Config.message.wait);
        let picture;
        try {
            picture = await getBuffer(await anyaV2.profilePictureUrl(user, 'image'));
        } catch (err) {
            return pika.edit(`_❌ @${user.split('@')[0]} doesn't have a profile picture, or it's hidden_`, key, { mentions: [user] });
        }
        anyaV2.updateProfilePicture(botNumber, picture)
        .then(() => pika.edit('✅ 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞 𝐒𝐭𝐞𝐚𝐥𝐞𝐝', key))
        .catch((error) => {
            console.error(error);
            pika.edit('Error! try again later', key);
        });
     }
)