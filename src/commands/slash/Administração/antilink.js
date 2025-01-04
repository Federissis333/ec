const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, ChannelType } = require('discord.js');

module.exports = {
    name: "antilink",
    description: "[💻 Administração] Configure o sistema de anti-links.",
    type: 1,
    options: [],
    permissions: {},
    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `${interaction.user}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: `${interaction.user}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

        let guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id })
        if (!guilddb) guilddb = await new client.guilddb({ IDs: interaction.guild.id }).save();

        const row = new ActionRowBuilder()

        const estado = new ButtonBuilder()

        if (guilddb.antilink.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); row.addComponents(estado) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id });

            if (guilddb.antilink.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); }

        }
        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de anti-links.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: `Status:`,
                value: `\`${guilddb.antilink.status ? "Ativado" : "Desativado"
                    }\``,
            }],
            image: {
                url: process.env.IMG_ANTILINK,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `${interaction.user.tag}`,
                icon_url: `${interaction.user.displayAvatarURL({ format: "png" })}`,
            },
        };

        async function VerifyFields() {
            guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id })

            embed.fields = [{
                name: `Status:`,
                value: `\`${guilddb.antilink.status ? "Ativado" : "Desativado"
                    }\``,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        interaction.reply({ embeds: [embed], components: [row] }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === interaction.user.id) {
                    if (i.customId === "ativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "antilink.status": true } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "desativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "antilink.status": false } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)

                interaction.editReply({ components: [row] })
            });

        })

    }
}