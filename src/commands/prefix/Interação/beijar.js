const { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
  config: {
    name: "beijar",
    aliases: ['kiss'],
    description: "Beije um usuário.",
    category: "interação",
    usage: "bejar [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let user = message.mentions.users.first();

    if (!user) return message.reply({ content: `${message.author}, você precisa mencionar alguem para bejar .` })

    if (user.id == message.author.id) return message.reply({ content: `${message.author}, você não pode se beijar!`, ephemeral: true })

    var lista1 = [
      'https://imgur.com/II1bakc.gif',
      'https://imgur.com/MzAjNdv.gif',
      'https://imgur.com/eKcWCgS.gif',
      'https://imgur.com/3aX4Qq2.gif',
      'https://imgur.com/uobBW9K.gif'
    ];

    var random1 = lista1[Math.floor(Math.random() * lista1.length)];

    let embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setDescription(`\`${message.author.tag}\` deu um beijo em \`${user.tag}\`.`)
      .setImage(`${random1}`)

    message.reply({ embeds: [embed] })

  }
}
