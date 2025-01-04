const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  config: {
    name: "avatar",
    aliases: ['av', 'avata'],
    description: "Puxe o avatar de um usuário.",
    category: "geral",
    usage: "avatar [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = message.mentions.users.first()?.id || args[0] || message.author.id;

    const { statusCode, headers, trailers, body } = await request(`https://japi.rest/discord/v1/user/${membro}`);
    const user = await body.json();

    if (user.error) return message.reply({ content: `${message.author}, não há informações sobre este usuário no banco de dados.` })
    if (user.data.message === 'Unknown User') return message.reply({ content: `${message.author}, não há informações sobre este usuário no banco de dados.` })

    const avatar = user.data.avatarURL + '?size=4096'

    const row = new ActionRowBuilder()
    const button = new ButtonBuilder()
      .setLabel('Baixar Avatar')
      .setStyle(5)

    const embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setAuthor({ name: `${user.data.tag}` })
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    if (avatar === 'null?size=4096') { message.reply({ content: `Não encontrei o avatar deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else if (avatar === 'undefined?size=4096') { message.reply({ content: `Não encontrei o avatar deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else { button.setURL(avatar); row.addComponents(button); embed.setImage(avatar); message.reply({ embeds: [embed], components: [row] }) }

  },
};