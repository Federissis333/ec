const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, WebhookClient } = require('discord.js');

module.exports = {
    name: "instagram",
    description: "[💻 Administração] Configure o sistema de instagram.",
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
        const canalb = new ButtonBuilder()
        const reset = new ButtonBuilder()


        if (guilddb.insta.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); row.addComponents(estado) }

        if (guilddb.insta.canal == "null") { canalb.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); row.addComponents(canalb) } else { canalb.setStyle(2).setLabel('Alterar canal').setCustomId('canal-alterar'); row.addComponents(canalb) }

        if (guilddb.insta.canal == "null") { reset.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); row.addComponents(reset) } else { reset.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); row.addComponents(reset) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id });

            if (guilddb.insta.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); }

            if (guilddb.insta.canal == "null") { canalb.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); } else { canalb.setStyle(2).setLabel('Alterar canal').setCustomId('canal-alterar'); }

            if (guilddb.insta.canal == "null") { reset.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); } else { reset.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); }

        }

        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de instagram.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: "Informações:",
                value: `Estado: ${guilddb.insta.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.insta.canal == "null" ? "`Não localizado`" : `<#${guilddb.insta.canal}>`}`,
            }],
            image: {
                url: process.env.IMG_INSTAGRAM,
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
                name: "Informações:",
                value: `Estado: ${guilddb.insta.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.insta.canal == "null" ? "`Não localizado`" : `<#${guilddb.insta.canal}>`}`,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        interaction.reply({ embeds: [embed], components: [row] }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === interaction.user.id) {
                    if (i.customId === "estado-ativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "insta.status": true } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "estado-desativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "insta.status": false } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "canal-setar") {

                        const filter = m => m.author.id === interaction.user.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **instagram**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "insta.canal": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            interaction.editReply({ embeds: [embed], components: [row] })

                            m.channel.send({ content: `${i.user}, canal do **instagram** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });

                        });

                    } else if (i.customId === "canal-alterar") {
                        const filter = m => m.author.id === interaction.user.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **instagram**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.random.gif) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "insta.canal": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            interaction.editReply({ embeds: [embed], components: [row] })
                            m.channel.send({ content: `${i.user}, canal do **instagram** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });

                    } else if (i.customId === "canal-resetar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "insta.canal": "null" } })
                        i.deferUpdate();
                        canalb.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar');
                        reset.setDisabled(true)

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })
                        i.channel.send({ content: `${i.user}, canal do **instagram** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)
                canalb.setDisabled(true)
                reset.setDisabled(true)
                interaction.editReply({ components: [new ActionRowBuilder().addComponents(estado).addComponents(canalb).addComponents(reset)] })
            });

        })

    },
};