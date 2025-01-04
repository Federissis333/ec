const { EmbedBuilder, PermissionsBitField, underscore } = require("discord.js");
const { request } = require("undici");
const emoji = require(`${process.cwd()}/src/structures/Emoji.js`);
const moment = require('moment');
moment.locale("pt-BR");

module.exports = {
    name: "Ver Informações",
    type: 2,
    run: async (client, interaction) => {

        const membro = interaction.targetId

        const { statusCode, headers, trailers, body } = await request(`http://mistysync.online/users/${membro}`);
        const user = await body.json();

        if (user.error) return interaction.reply({ content: `${interaction.user}, não há informações sobre este usuário no banco de dados.` })
        if (user.data.message === 'Unknown User') return interaction.reply({ content: `${interaction.user}, não há informações sobre este usuário no banco de dados.` })
        let banner = user.data.bannerURL + '?size=4096'

        const flags = {
            DISCORD_EMPLOYEE: `${emoji.discord_staff}`,
            DISCORD_PARTNER: `${emoji.discord_partner}`,
            BUGHUNTER_LEVEL_1: `${emoji.bughunter1}`,
            BUGHUNTER_LEVEL_2: `${emoji.bughunter2}`,
            HYPESQUAD_EVENTS: `${emoji.hypesquad}`,
            EARLY_SUPPORTER: `${emoji.early_supporter}`,
            EARLY_VERIFIED_BOT_DEVELOPER: `${emoji.bot_developer}`,
            VERIFIED_BOT: `${emoji.botverificado}`,
            HOUSE_BRAVERY: `${emoji.hypesquad_bravery}`,
            HOUSE_BRILLIANCE: `${emoji.hypequad_brillance}`,
            HOUSE_BALANCE: `${emoji.hypequad_balance}`,
            ACTIVE_DEVELOPER: `${emoji.activedeveloper}`,
            DISCORD_CERTIFIED_MODERATOR: `${emoji.certified_moderator}`,
            BOOSTER_1: `${emoji.booster_1}`,
            BOOSTER_2: `${emoji.booster_2}`,
            BOOSTER_3: `${emoji.booster_3}`,
            BOOSTER_6: `${emoji.booster_6}`,
            BOOSTER_9: `${emoji.booster_9}`,
            BOOSTER_12: `${emoji.booster_12}`,
            BOOSTER_15: `${emoji.booster_15}`,
            BOOSTER_18: `${emoji.booster_18}`,
            BOOSTER_24: `${emoji.booster_24}`,

            NITRO: `${emoji.nitro} `,
            VERIFIED_BOT: `${emoji.verified_bot}`
        };

        const userflags = user.data.public_flags_array;
        let badges = userflags.map((flag) => flags[flag]).join(" ");
        let bio = user.data.bio;
        const thumb = user.data.avatarURL
        if (badges === " ") { badges = "`Nenhuma insígnia.`" } else { badges = badges }
        if (badges === "") { badges = "`Nenhuma insígnia.`" } else { badges = badges }
        if (badges === null) { badges = "`Nenhuma insígnia.`" } else { badges = badges }
        if (badges === undefined) { badges = "`Nenhuma insígnia.`" } else { badges = badges }

        if (bio === " ") { bio = "`Nenhuma informação.`" } else { bio = bio }
        if (bio === "") { bio = "`Nenhuma informação.`" } else { bio = bio }
        if (bio === null) { bio = "`Nenhuma informação.`" } else { bio = bio }
        if (bio === undefined) { bio = "`Nenhuma informação.`" } else { bio = bio }

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR1)
            .addFields({ name: `Discord TAG:`, value: `\`\`\`${user.data.tag}\`\`\`` })
            .addFields({ name: `Discord ID:`, value: `\`\`\`${user.data.id}\`\`\`` })
            .addFields({ name: `Data de Criação`, value: `\`${moment(user.data.createdTimestamp).format('L')}\` **(${moment(user.data.createdTimestamp).startOf('day').fromNow()})**` })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: "png" })}` })
            .setTimestamp()

        embed.addFields({ name: `Insígnias:`, value: `${badges}` })
        embed.addFields({ name: `Sobre Mim:`, value: `${bio}` })
        if (!thumb) { } else { embed.setThumbnail(thumb) }
        if (banner === "null?size=4096", "?size=4096") { } else { embed.setImage(banner) }


        interaction.reply({ embeds: [embed] })


    },
};
