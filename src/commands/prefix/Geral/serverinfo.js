const { ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, ChannelType, } = require('discord.js');
const moment = require('moment');
moment.locale('pt-BR')

module.exports = {
    config: {
        name: "serverinfo",
        aliases: null,
        description: "Veja as informações sobre um servidor.",
        category: "geral",
        usage: "serverinfo [serverid]"
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        const guild = await client.guilds.cache.get(args[0]) || message.guild;

        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        let membroscall = 0;
        await voiceChannels.forEach(c => membroscall += c.members.size);

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR1)
            .addFields(
                {
                    name: `Proprietário:`,
                    value: `<@!${guild.ownerId}>\n\`(${guild.ownerId})\``,
                    inline: true
                },
                {
                    name: `Membros:`,
                    value: `\`${guild.memberCount}\``,
                    inline: true
                },
                {
                    name: `Membros em call:`,
                    value: `\`${membroscall}\``,
                    inline: true
                },
                {
                    name: `Impulsos:`,
                    value: `\`${guild.premiumSubscriptionCount}\`\n**(Level ${guild.premiumTier})**`,
                    inline: true
                },
                {
                    name: `Data de criação:`,
                    value: `\`${moment(guild.createdAt).format('L')}\`\n**(${moment(guild.createdAt).startOf('day').fromNow()})**`,
                    inline: true
                },
                {
                    name: `Canais:`,
                    value: `\`${guild.channels.cache.size}\``,
                    inline: true
                },
                {
                    name: `Cargos:`,
                    value: `\`${guild.roles.cache.size}\``,
                    inline: true
                },
                {
                    name: `Emojis:`,
                    value: `\`${guild.emojis.cache.size}\``,
                    inline: true
                }
            );

        const vainity = guild.vanityURLCode;
        const uses = guild.vanityURLUses ?? 0;
        if (vainity === null) { } else {
            embed.addFields(
                {
                    name: `VanityURL:`,
                    value: `\`${vainity}\`\n(${uses.toLocaleString()}) `,
                    inline: true
                }
            );
        }

        const icon = new ButtonBuilder()
            .setLabel("Baixar Ícone")
            .setStyle(5)

        const banner = new ButtonBuilder()
            .setLabel("Baixar Banner")
            .setStyle(5)

        const invite = new ButtonBuilder()
            .setLabel("Baixar Banner de Convite")
            .setStyle(5)

        const discovery = new ButtonBuilder()
            .setLabel("Baixar Banner de Discovery")
            .setStyle(5)

        const iconlink = guild.iconURL({ dinamyc: true }) + '?size=4096';
        const bannerlink = guild.bannerURL({ dinamyc: true }) + '?size=4096';
        const invitelink = guild.splashURL({ dinamyc: true }) + '?size=4096';
        const discoverylink = guild.discoverySplashURL({ dinamyc: true }) + '?size=4096';

        if (iconlink === 'null?size=4096') { embed.setAuthor({ name: `${guild.name}` }); icon.setURL(process.env.SUPORTE).setDisabled(true); } else { embed.setAuthor({ name: `${guild.name}`, iconURL: iconlink }); icon.setURL(iconlink) }
        if (bannerlink === 'null?size=4096') { banner.setURL(process.env.SUPORTE).setDisabled(true) } else { embed.setImage(bannerlink); banner.setURL(bannerlink); }
        if (invitelink === 'null?size=4096') { invite.setURL(process.env.SUPORTE).setDisabled(true) } else { invite.setURL(invitelink) }
        if (discoverylink === 'null?size=4096') { discovery.setURL(process.env.SUPORTE).setDisabled(true) } else { discovery.setURL(discoverylink) }

        const row = new ActionRowBuilder()
            .addComponents(icon)
            .addComponents(banner)
            .addComponents(invite)
            .addComponents(discovery)

        message.reply({ embeds: [embed], components: [row] })

    },
};