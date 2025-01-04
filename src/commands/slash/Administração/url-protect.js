const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, ChannelType } = require('discord.js');

module.exports = {
    name: "url-protect",
    description: "[💻 Administração] Configure o sistema de proteção de url.",
    type: 1,
    options: [],
    permissions: {},
    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `${interaction.user}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: `${interaction.user}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

        let guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id });
        if (!guilddb) guilddb = await new client.guilddb({ IDs: interaction.guild.id }).save();

        const row = new ActionRowBuilder()

        const estado = new ButtonBuilder()
        const burl = new ButtonBuilder()
            .setCustomId('url')
        const reseturl = new ButtonBuilder()
            .setCustomId('reset')

        if (guilddb.urlprotect.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); row.addComponents(estado) }

        if (guilddb.urlprotect.url === "null") { burl.setStyle(1).setLabel('Setar URL'); row.addComponents(burl) } else { burl.setStyle(2).setLabel('Alterar URL'); row.addComponents(burl) }

        if (guilddb.urlprotect.url == "null") { reseturl.setStyle(4).setLabel('Resetar URL'); row.addComponents(reseturl); reseturl.setDisabled(true) } else { reseturl.setStyle(4).setLabel('Resetar URL'); row.addComponents(reseturl); reseturl.setDisabled(false) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id });

            if (guilddb.urlprotect.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); }

            if (guilddb.urlprotect.url == "null") { burl.setStyle(1).setLabel('Setar URL') } else { burl.setStyle(2).setLabel('Alterar URL') }

            if (guilddb.urlprotect.url == "null") { reseturl.setDisabled(true) } else { reseturl.setDisabled(false) }

        }
        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de proteção de url.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: `Status:`,
                value: `\`${guilddb.urlprotect.status ? "Ativado" : "Desativado"}\``,
            },
            {
                name: `Url:`,
                value: `\`${guilddb.urlprotect.url == "null" ? `\`Não definida.\`` : `\`${guilddb.urlprotect.url}\``}\``,
            }],
            image: {
                url: process.env.IMG_URLPROTECT,
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
                value: `\`${guilddb.urlprotect.status ? "Ativado" : "Desativado"}\``,
            },
            {
                name: `Url:`,
                value: `\`${guilddb.urlprotect.url == "null" ? `\`Não definida.\`` : `\`${guilddb.urlprotect.url}\``}\``,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        interaction.reply({ embeds: [embed], components: [row] }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === interaction.user.id) {
                    if (i.customId === "ativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "urlprotect.status": true } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "desativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "urlprotect.status": false } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "url") {

                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe a url para ser protegida.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 25) {
                                return m.reply({ content: `${i.user}, a url inserida é muito grande, o limite de caracteres é de **25**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else {

                                await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "urlprotect.url": newmsg } })

                                await VerifyButtons();
                                await VerifyFields();

                                m.delete().catch((err) => { })

                                interaction.editReply({ embeds: [embed], components: [row] })
                                m.channel.send({ content: `${i.user}, a url de proteção foi **alterada** para: \`${newmsg}\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });

                    } else if (i.customId === "reset") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "urlprotect.url": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, url **resetada** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

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