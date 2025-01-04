const { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
  config: {
    name: "bater",
    aliases: null,
    description: "Bata em um usuário.",
    category: "interação",
    usage: "bater [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let user = message.mentions.users.first();

    if (!user) return message.reply({ content: `${message.author}, você precisa mencionar alguem para bater.` })

    if (user.id == message.author.id) return message.reply({ content: `${message.author}, você não pode se bater!`, ephemeral: true })

    var lista1 = [
      'https://imgur.com/HYJHoG7.gif',
      'https://imgur.com/9GxTsgl.gif',
      'https://imgur.com/mT4VjD6.gif',
      'https://imgur.com/mT4VjD6.gif',
      'https://imgur.com/w66ZqGR.gif'
    ];

    var random1 = lista1[Math.floor(Math.random() * lista1.length)];

    let embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setDescription(`\`${message.author.tag}\` deu um tapa em \`${user.tag}\`.`)
      .setImage(`${random1}`)

    message.reply({ embeds: [embed] })

  }
}