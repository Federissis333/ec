const { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
  config: {
    name: "abraçar",
    aliases: ['abracar'],
    description: "Abraçe um usuário.",
    category: "interação",
    usage: "abraçar [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let user = message.mentions.users.first();

    if (!user) return message.reply({ content: `${message.author}, você precisa mencionar alguem para abraçar.` })

    if (user.id == message.author.id) return message.reply({ content: `${message.author}, você não pode se abraçar!`, ephemeral: true })


    let lista1 = [
      'https://imgur.com/RgfGLNk.gif',
      'https://i.imgur.com/r9aU2xv.gif',
      'https://i.imgur.com/wOmoeF8.gif',
      'https://i.imgur.com/nrdYNtL.gif',
      'https://imgur.com/82xVqUg.gif'
    ];

    let random1 = lista1[Math.floor(Math.random() * lista1.length)];

    let embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setDescription(`\`${message.author.tag}\` abraçou \`${user.tag}\`.`)
      .setImage(`${random1}`)

    message.reply({ embeds: [embed] })

  }
}
