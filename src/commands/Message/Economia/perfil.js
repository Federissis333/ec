const { EmbedBuilder } = require('discord.js');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
    name: "Ver Perfil",
    type: 3,
    run: async (client, interaction) => {

        let membro = client.users.cache.get(interaction.targetMessage.author.id);

        const user = await client.userdb.findOne({ userID: membro.id }) || { economia: { ruby: 0, banco: 0, money: 0, sujo: 0, sobremim: `null`, marry: { casado: false, user: null, time: 0 } }, icon: null, color: null, emblemas: {}, infos: { xp: 0, level: 0, rep: 0 } }

        const embed = new EmbedBuilder()
            .setDescription(`${user.economia.sobremim == "null" ? `Prazer, **${membro.username}**!` : `${user.sobremim}`}`)
            .setThumbnail(membro.displayAvatarURL({ dynamic: true, display: true, size: 4096 }))
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, display: true, size: 4096 }) })
            .setColor(`${user.color == null ? process.env.COLOR1 : user.color}`)
            .setTimestamp()

        if (!user.emblmeas === '') { } else if (!user.emblemas.length) { } else { embed.addFields({ name: `Emblemas:`, value: `${user.emblemas.map((x) => `${x}`).join(" ")}` }) }

        embed.addFields({ name: `Saldo:`, value: `🪙 \`${toMoney(user.economia.money)}\`\n🏦 \`${toMoney(user.economia.banco)}\``, inline: true })

        embed.addFields({ name: `Experiência:`, value: `Level: \`${user.infos.level == null ? `0` : `${user.infos.level.toLocaleString()}`}\`\nXP: \`${user.infos.xp == null ? `0` : `\`${toMoney(user.infos.xp)}\``}\``, inline: true })

        embed.addFields({ name: `Reps:`, value: `\`${user.infos.rep == null ? `0` : `\`${user.infos.rep.toLocaleString()}\``}\``, inline: true })

        embed.addFields({ name: `Relacionamento:`, value: `${user.economia.marry.casado == false ? `Solteiro!` : `Casado com: ${client.users.cache.get(user.economia?.marry?.user)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.economia?.marry?.user)?.tag}\``} `}`, inline: true })

        if (user.icon === null) { embed.setAuthor({ name: `Perfil de ${membro.tag}`, iconURL: process.env.ICON_PRIMARY }) } else { embed.setAuthor({ name: `Perfil de ${membro.tag}`, iconURL: user.icon }) }

        interaction.reply({ embeds: [embed] })

    },
}