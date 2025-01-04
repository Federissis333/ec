const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "divórcio",
    aliases: ["divorcio", "divorce", "divorciar"],
    description: "Divorcie-se de algum usuário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let userdb = await client.userdb.findOne({ userID: message.author.id })

    if (!userdb || !userdb.economia.marry.casado) return message.reply({ content: `${message.author}, você não esta casado.` });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`aceitar`)
          .setLabel('Sim')
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId(`recusar`)
          .setLabel('Não')
          .setStyle(4),
      );

    message.reply({ content: `${message.author} você deseja se divorciar de ${client.users.cache.get(userdb.economia?.marry?.user)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(userdb.economia?.marry?.user)?.tag}\``}?`, components: [row], fetchReply: true }).then(async (msg) => {

      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (i) => {

        if (i.user.id !== message.author.id) return i.deferUpdate();

        if (i.customId == "aceitar") {

          await client.userdb.updateOne({ userID: userdb.economia.marry.user }, {
            $set: {
              "economia.marry.casado": false,
              "economia.marry.time": 0
            }
          })

          await client.userdb.updateOne({ userID: message.author.id }, {
            $set: {
              "economia.marry.casado": false,
              "economia.marry.time": 0
            }
          })

          msg.edit({ content: `${message.author}, você se divorciou com sucesso.`, components: [] })
        }

        if (i.customId == "recusar") {

          msg.edit({ content: `${message.author}, divórcio cancelado com sucesso.`, components: [] })

        }

      })

    })

  },
};