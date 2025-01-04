const { ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
moment.locale('pt-BR')

module.exports = {
  config: {
    name: "servericon",
    aliases: ["server-icon", "svicon"],
    description: 'Veja o ícone de um servidor.',
    category: "geral",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    const guild = await client.guilds.cache.get(args[0]) || message.guild;

    const embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)

    const icon = new ButtonBuilder()
      .setLabel("Baixar Ícone")
      .setStyle(5)

    const iconlink = guild.iconURL({ dinamyc: true }) + '?size=4096';

    if (iconlink === 'null?size=4096') { embed.setAuthor({ name: `${guild.name}` }); icon.setURL(process.env.SUPORTE).setDisabled(true); embed.setDescription(`O servidor não possui um ícone.`) } else { embed.setAuthor({ name: `${guild.name}`, iconURL: iconlink }); icon.setURL(iconlink); embed.setImage(iconlink) }


    const row = new ActionRowBuilder()
      .addComponents(icon)

    message.reply({ embeds: [embed], components: [row] })

  }
}
