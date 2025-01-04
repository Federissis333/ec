const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "casamento",
    aliases: ["marry"],
    description: "Veja as informações sobre o casamento de alguém.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = client.users.cache.get(args[1]) || message.mentions.users.first() || message.author;

    let userdb = await client.userdb.findOne({ userID: membro.id })

    if (!userdb || !userdb.economia.marry.casado) return message.reply({ content: `${message.author}, este usuário não está casado.` })

    const casado = await client.users.cache.get(userdb.economia?.marry?.user);

    if (!casado) return message.reply({ content: `${message.author}, não encontrei este usuário.` })

    const embed = new EmbedBuilder()
      .setColor(`${userdb.color == null ? process.env.COLOR1 : user.color}`)
      .setDescription(`Casado com: \`${casado.tag}\`\nCasado há: \`${toTime(Date.now() - userdb.economia.marry.time)}\``)

    if (userdb.icon === null) { embed.setAuthor({ name: `Casamento de ${membro.tag}`, iconURL: process.env.ICON_PRIMARY }) } else { embed.setAuthor({ name: `Csamento de ${membro.tag}`, iconURL: userdb.icon }) }

    message.reply({ embeds: [embed] })

  },
};