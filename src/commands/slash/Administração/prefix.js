const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: "prefix",
    description: "[💻 Administração] Configure o meu prefixo.",
    type: 1,
    options: [],
    permissions: {},
    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `${interaction.user}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: `${interaction.user}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

        let guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id })
        if (!guilddb) guilddb = await new client.guilddb({ IDs: interaction.guild.id }).save();

        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de prefixo.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: "Informações:",
                value: `Prefixo: \`${guilddb.prefix}\``,
            }],
            image: {
                url: process.env.IMG_PREFIX,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `${interaction.user.tag}`,
                icon_url: `${interaction.user.displayAvatarURL({ format: "png" })}`,
            },
        };

        const row = new ActionRowBuilder()

        const alterar = new ButtonBuilder()
        const resetar = new ButtonBuilder()

        if (guilddb.prefix === "a!") { alterar.setStyle(1).setLabel('Alterar Prefixo').setCustomId('prefixo-alterar'); resetar.setStyle(4).setCustomId('prefixo-resetar').setLabel('Resetar Prefixo').setDisabled(true); row.addComponents(alterar).addComponents(resetar) } else { alterar.setStyle(1).setLabel('Alterar Prefixo').setCustomId('prefixo-alterar'); resetar.setStyle(4).setCustomId('prefixo-resetar').setLabel('Resetar Prefixo').setDisabled(false); row.addComponents(alterar).addComponents(resetar) }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        interaction.reply({ embeds: [embed], components: [row] }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === interaction.user.id) {
                    if (i.customId === "prefixo-alterar") {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe o novo prefixo que deseja setar.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m, args) => {

                            let aznx = m.content.trim().split(/ +/g);
                            let pfx = aznx[0]
                            if (pfx.length > 5) {
                                return m.reply({ content: `${i.user}, o prefixo inserido é muito grande, o limite de caracteres é de **5**.` });
                            } else {

                                if (pfx === guilddb.prefix) return m.channel.send({ content: `${i.user}, o prefixo inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                                await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "prefix": pfx } })

                                guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id })

                                embed.fields = [{
                                    name: "Informações:",
                                    value: `Prefixo: \`${guilddb.prefix}\``,
                                }],

                                    resetar.setDisabled(false)

                                interaction.editReply({ embeds: [embed], components: [row] })
                                m.channel.send({ content: `${i.user}, meu prefixo foi **alterado** para \`${pfx}\`.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }

                        });

                    } else if (i.customId === "prefixo-resetar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "prefix": "a!" } })
                        i.deferUpdate();
                        resetar.setDisabled(true)

                        guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id })
                        embed.fields = [{
                            name: "Informações:",
                            value: `Prefixo: \`${guilddb.prefix}\``,
                        }],

                            interaction.editReply({ embeds: [embed], components: [row] })
                        i.channel.send({ content: `${i.user}, meu prefixo foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', collected => {

                alterar.setDisabled(true)
                resetar.setDisabled(true)
                interaction.editReply({ components: [new ActionRowBuilder().addComponents(alterar).addComponents(resetar)] })
            });

        })

    },
};