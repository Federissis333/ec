const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    config: {
        name: "invite",
        aliases: ["convite"],
        description: "Me adicione em seu servidor.",
        usage: null,
        category: "geral"
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setColor(process.env.COLOR1)
            .setDescription(`\`${message.author.tag}\`, para me adicionar em seu servidor ou entrar no meu servidor de suporte basta clicar em um dos botões abaixo.`)
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
            .setTimestamp()

        const add = new ButtonBuilder()
            .setLabel('Me adicione em seu servidor')
            .setStyle(ButtonStyle.Link)
            .setURL(process.env.INVITE)
        const sup = new ButtonBuilder()
            .setLabel('Entre no meu servidor de suporte')
            .setStyle(ButtonStyle.Link)
            .setURL(process.env.SUPORTE)

        const row = new ActionRowBuilder()
            .addComponents(add)
            .addComponents(sup)

        message.reply({ embeds: [embed], components: [row] })

    },
};