const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    name: "Ver Avatar",
    type: 2,
    run: async (client, interaction) => {

        const membro = interaction.targetId

        const { statusCode, headers, trailers, body } = await request(`https://japi.rest/discord/v1/user/${membro}`);
        const user = await body.json();

        const avatar = user.data.avatarURL + '?size=4096'

        const row = new ActionRowBuilder()
        const button = new ButtonBuilder()
            .setLabel('Baixar Avatar')
            .setStyle(5)

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setAuthor({ name: `${user.data.tag}` })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: "png" })}` })
            .setTimestamp()

        if (avatar === 'null?size=4096') { interaction.reply({ content: `Não encontrei o avatar deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else if (avatar === 'undefined?size=4096') { interaction.reply({ content: `Não encontrei o avatar deste usuário.`, ephemeral: true }); button.setURL(process.env.SUPORTE).setDisabled(true) } else { button.setURL(avatar); row.addComponents(button); embed.setImage(avatar); interaction.reply({ embeds: [embed], components: [row] }) }

    },
};
