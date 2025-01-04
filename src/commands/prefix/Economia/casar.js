const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = {
  config: {
    name: "casar",
    aliases: null,
    description: "Case com algum usuário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = client.users.cache.get(args[1]) || message.mentions.users.first();

    if (membro.bot) return message.reply({ content: `${message.author}, você não pode se casar com um bot!` })

    let userdb = await client.userdb.findOne({ userID: message.author.id })

    if (!userdb) userdb = await new client.userdb({ userID: message.author.id }).save();

    let userdb2 = await client.userdb.findOne({ userID: membro.id })

    if (!userdb2) {
      const newuser = new client.userdb({ userID: membro.id })
      await newuser.save();

      userdb2 = await client.userdb.findOne({ userID: membro.id })
    }

    if (message.author.id === membro.id) return message.reply({ content: `${message.author}, você não pode casar consigo mesmo.` });

    if (userdb.economia.marry.casado === true) return message.reply({ content: `${message.author}, você já está casado com alguém.` })

    if (userdb2.economia.marry.casado === true) return message.reply({ content: `${message.author}, \`${membro.tag}\`, já está casado com alguém.` })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`aceitar`)
          .setLabel('Aceitar')
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId(`recusar`)
          .setLabel('Recusar')
          .setStyle(4),
      );

    message.reply({ content: `${membro}, ${message.author} lhe pediu em casamento!`, components: [row], fetchReply: true }).then(async (msg) => {

      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (i) => {

        if (i.user.id !== membro.id) return i.deferUpdate();

        if (i.customId == "aceitar") {

          await client.userdb.updateOne({ userID: message.author.id }, {
            $set: {
              "economia.marry.casado": true,
              "economia.marry.time": Date.now(),
              "economia.marry.user": membro.id
            }
          })

          await client.userdb.updateOne({
            userID: membro.id
          }, {
            $set: {
              "economia.marry.casado": true,
              "economia.marry.time": Date.now(),
              "economia.marry.user": message.author.id
            }
          })

          msg.edit({ content: `❤️ ${membro} aceitou o pedido de casamento de ${message.author}.`, components: [] })
        }

        if (i.customId == "recusar") {

          msg.edit({ content: `💔 ${membro} recusou o pedido de casamento de ${message.author}.`, components: [] })

        }

      })

    })

  },
};