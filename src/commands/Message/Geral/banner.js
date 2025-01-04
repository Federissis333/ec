const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  name: "Ver Banner",
  type: 3,
  run: async (client, interaction) => {

    const membro = interaction.targetMessage.author.id;

    const { statusCode, headers, trailers, body } = await request(`https://japi.rest/discord/v1/user/${membro}`);
    const user = await body.json();

    const banner = user.data.bannerURL + '?size=4096'

    const row = new ActionRowBuilder()
    const button = new ButtonBuilder()
      .setLabel('Baixar Banner')
      .setStyle(5)

    const embed = new EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setAuthor({ name: `${user.data.tag}` })
      .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    if (banner === 'null?size=4096') { interaction.reply({ content: `Não encontrei o banner deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else if (banner === 'undefined?size=4096') { interaction.reply({ content: `Não encontrei o banner deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else { button.setURL(banner); row.addComponents(button); embed.setImage(banner); interaction.reply({ embeds: [embed], components: [row] }) }





  },
};
