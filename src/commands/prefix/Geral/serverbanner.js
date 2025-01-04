const { ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
moment.locale('pt-BR')

module.exports = {
  config: {
    name: "serverbanner",
    aliases: ["server-banner", "svbanner", "svbn"],
    description: 'Veja o banner de um servidor.',
    category: "geral",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    const guild = await client.guilds.cache.get(args[0]) || message.guild;

    const embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)

    const banner = new ButtonBuilder()
      .setLabel("Baixar Banner")
      .setStyle(5)

    const bannerlink = guild.bannerURL({ dinamyc: true }) + '?size=4096';

    if (bannerlink === 'null?size=4096') { embed.setAuthor({ name: `${guild.name}` }); banner.setURL(process.env.SUPORTE).setDisabled(true); embed.setDescription(`O servidor não possui um banner.`) } else { embed.setAuthor({ name: `${guild.name}` }); banner.setURL(bannerlink); embed.setImage(bannerlink) }


    const row = new ActionRowBuilder()
      .addComponents(banner)

    message.reply({ embeds: [embed], components: [row] })

  }
}
