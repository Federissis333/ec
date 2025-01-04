const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    config: {
        name: "emojiinfo",
        aliases: null,
        description: "Puxe as informaçõoes de um emoji.",
        category: "geral",
        usage: "emojiinfo [emoji]",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        let emojiString = args[0].replace(' ', "")
        if (!emojiString) return message.reply({ content: `${message.author}, é preciso infomrar um emoji.` })
        let emoji = client.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` === emojiString) || client.emojis.cache.find(emoji => emoji.name === emojiString) || client.emojis.cache.get(emojiString);

        if (!emoji) return message.reply({ content: `${message.author}, não encontrei este emoji.` })

        if (!emoji.animated) {

            let img = `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=2048`;
            let botao = new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Baixar Emoji")
                .setURL(img));

            let embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR1)
                .setTitle("Informações do Emoji:")
                .setThumbnail(`${img}`)
                .setDescription(`Nome: \`${emoji.name}\`\nID: \`${emoji.id}\`\nMenção: \`${emoji}\`\nFormato: \`Imagem (png/jpg)\`\nCriado em: <t:${parseInt(emoji.createdTimestamp / 1000)}>`)

            message.reply({ embeds: [embed], components: [botao] })
        } else if (emoji.animated) {

            let img = `https://cdn.discordapp.com/emojis/${emoji.id}.gif?size=2048`;
            let botao = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Baixar Emoji")
                        .setURL(`${img}`)
                );

            let embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR1)
                .setTitle("Informações do Emoji:")
                .setThumbnail(`${img}`)
                .setDescription(`Nome: \`${emoji.name}\`\nID: \`${emoji.id}\`\nMenção: \`${emoji}\`\nFormato: \`Gif\`\nCriado em: <t:${parseInt(emoji.createdTimestamp / 1000)}>`)

            await message.reply({ embeds: [embed], components: [botao] })
        }

    }
}