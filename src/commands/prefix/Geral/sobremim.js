const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    config: {
        name: "sobremim",
        aliases: ['aboutme', 'about'],
        description: "Puxe o sobremim de um usuário.",
        category: "geral",
        usage: "sobremim [user]",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        let membro = message.mentions.users.first()?.id || args[0] || message.author.id;

        const { statusCode, headers, trailers, body } = await request(`https://japi.rest/discord/v1/user/${membro}`);
        const user = await body.json();

        if (user.error) return message.reply({ content: `${message.author}, não há informações sobre este usuário no banco de dados.` })
        if (user.data.message === 'Unknown User') return message.reply({ content: `${message.author}, não há informações sobre este usuário no banco de dados.` })

        const sobremim = user.data.bio;

        if (sobremim === null) return message.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === undefined) return message.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === "") return message.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });
        if (sobremim === " ") return message.reply({ content: `Este usuário não possui um sobre mim.`, emphemeral: true });

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(sobremim)
            .setAuthor({ name: `${user.data.tag}`, iconURL: `${user.data.avatarURL}` + '?size=4096' })
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
            .setTimestamp()

        message.reply({ embeds: [embed] })

    },
};