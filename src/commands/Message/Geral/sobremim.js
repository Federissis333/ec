const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    name: "Ver Sobre-Mim",
    type: 3,
    run: async (client, interaction) => {

        const membro = interaction.targetMessage.author.id;

        const { statusCode, headers, trailers, body } = await request(`https://japi.rest/discord/v1/user/${membro}`);
        const user = await body.json();

        const sobremim = user.data.bio;

        if (sobremim === null) return interaction.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === undefined) return interaction.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === "") return interaction.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === " ") return interaction.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(sobremim)
            .setAuthor({ name: `${user.data.tag}`, iconURL: `${user.data.avatarURL}` + '?size=4096' })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: "png" })}` })
            .setTimestamp()

        interaction.reply({ embeds: [embed] })


    },
};
