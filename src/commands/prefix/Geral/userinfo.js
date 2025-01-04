const axios = require('axios');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

const badgesOBJ = {
    Staff: "<:Staff:>",
    Partner: "<:Partner:>",
    Hypesquad: "<:HypeSquad:>",
    CertifiedModerator: "<:CertifiedModerator:>",
    BugHunterLevel1: "<:BugHunterLevel1:>",
    BugHunterLevel2: "<:BugHunterLevel2:>",
    HypeSquadOnlineHouse1: "<:HypesquadHouseOfBravery:1210937837881524294> ",
    HypeSquadOnlineHouse2: "<:HypeSquadOnlineHouse2:>",
    HypeSquadOnlineHouse3: "<:HypesquadHouseOfBalance:1210937836413657118> ",
    PremiumEarlySupporter: "<:PremiumEarlySupporter:>",
    TeamPseudoUser: "<:TeamPseudoUser:>",
    VerifiedBot: "<:VerifiedBot:>",
    VerifiedDeveloper: "<:VerifiedDeveloper:>",
    bot_commands: "<:BotHTTPInteractions:>",
    ActiveDeveloper: "<:dev2:1196503009685934080>",
    legacy_username: "<:name:1196502997019152574> ",
    premium: "<:nitro:1319733887462670396> ",
    guild_booster_lvl1: "<:1:1319733554363502723>",
    guild_booster_lvl2: " <:2:1319733616787456181>",
    guild_booster_lvl3: "<:3:1319733664711577671>",
    guild_booster_lvl4: "<:4:1319733704943341618>",
    guild_booster_lvl5: "<:5:1319733728804864062>",
    guild_booster_lvl6: "<:6:1319733753949454386>",
    guild_booster_lvl7: "<:7:1319733781405503540>",
    guild_booster_lvl8: "<:8:1319733803962597439> ",
    guild_booster_lvl9: "<:9_:1319733849370136696> "
};

module.exports = {
    config: {
        name: "userinfo",
        aliases: null,
        description: "Puxe as informações de um usuário.",
        category: "geral",
        usage: "userinfo [user]",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        // Obtém o usuário mencionado ou o autor da mensagem
        const user = message.mentions.users.first() || message.author;

        try {
            // Faz a requisição para pegar os dados do usuário
            const response = await axios({
                method: 'get',
                url: `https://mistysync.online/users/${user.id}`,
            });

            const { data: res } = response;

            if (res.apiStatusResponse === 200) {
                // Cria um embed com as informações básicas do usuário
                const embedBasicInfos = new EmbedBuilder()
                    .setColor(res.userProfile.profileColor)
                    .setThumbnail(res.userProfile.avatar.iconURL)
                    .setDescription(`# ${res.user.globalName || res.user.username}`)
                    .addFields(
                        {
                            name: '**Nome:**',
                            value: `\`\`\`${res.user.username}\`\`\``,
                            inline: true,
                        },
                        {
                            name: '**ID:**',
                            value: `\`\`\`${res.user.id}\`\`\``,
                            inline: true,
                        },
                        {
                            name: '**Pronomes:**',
                            value: `\`\`\`${res.userProfile.pronouns || 'Nenhum'}\`\`\``,
                            inline: true,
                        },
                        {
                            name: '**Badges:**',
                            value: `${res.badges.map(badge => badgesOBJ[badge.name] || '```Desconhecida```').join(' ') || '```Sem badges```'}`,
                            inline: true,
                        }
                    );

                // Cria uma Action Row com botões para bio e status de Nitro
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('service_bio')
                        .setLabel('Bio do user')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setCustomId('service_nitro')
                        .setLabel('Status de Nitro')
                        .setStyle(2)
                );

                // Envia o embed e os botões para o canal
                await message.reply({ embeds: [embedBasicInfos], components: [row] });
            } else {
                message.reply('Erro ao buscar dados do usuário.');
            }
        } catch (error) {
            console.error(error);
            message.reply('Houve um erro ao tentar buscar as informações do usuário.');
        }
    }
};
