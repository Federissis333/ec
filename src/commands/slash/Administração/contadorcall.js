const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, ChannelType } = require('discord.js');

module.exports = {
    name: "contadorcall",
    description: "[💻 Administração] Configure o sistema de contador de membros em call.",
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
        const row2 = new ActionRowBuilder()

        const estado = new ButtonBuilder()
        const canal = new ButtonBuilder()
        const mensagem = new ButtonBuilder()
        const resetcanal = new ButtonBuilder()
        const resetmsg = new ButtonBuilder()

        if (guilddb.contador.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); row.addComponents(estado) }

        if (guilddb.contador.channel == "null") { canal.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); row.addComponents(canal) } else { canal.setStyle(2).setLabel('Alterar Canal').setCustomId('canal-setar'); row.addComponents(canal) }

        mensagem.setStyle(1).setLabel('Alterar Mensagem').setCustomId('msg-setar'); row.addComponents(mensagem)

        if (guilddb.contador.channel == "null") { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); row.addComponents(resetcanal) } else { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); row.addComponents(resetcanal) }

        if (guilddb.contador.msg == "null") { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); row.addComponents(resetmsg) } else if (guilddb.contador.msg === "🔊 Membros em call: {contador}") { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); row.addComponents(resetmsg) } else { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(false); row.addComponents(resetmsg) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: interaction.guild.id });

            if (guilddb.contador.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); }

            if (guilddb.contador.channel == "null") { canal.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); } else { canal.setStyle(2).setLabel('Alterar Canal').setCustomId('canal-setar'); }

            mensagem.setStyle(1).setLabel('Alterar Mensagem').setCustomId('msg-setar');

            if (guilddb.contador.channel == "null") { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); } else { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); }

            if (guilddb.contador.msg == "null") { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); } else if (guilddb.contador.msg === "🔊 Membros em call: {contador}") { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); } else { resetmsg.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(false); }

        }
        
        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de contador de membros em call.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: 'Funções:',
                value: "```{contador} - Retorna a quantidade de membros em call.```"
            },
            {
                name: "Informações:",
                value: `Estado: ${guilddb.contador.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.contador.channel == "null" ? "`Não localizado`" : `<#${guilddb.contador.channel}>`}\nMensagem: ${guilddb.contador.msg == "null" ? "`🔊 Membros em call: {contador}`" : `\`\`\`${guilddb.contador.msg}\`\`\``}`,
            }],
            image: {
                url: process.env.IMG_CONTADORCALL,
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
                name: 'Funções:',
                value: "```{contador} - Retorna a quantidade de membros em call.```"
            },
            {
                name: "Informações:",
                value: `Estado: ${guilddb.contador.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.contador.channel == "null" ? "`Não localizado`" : `<#${guilddb.contador.channel}>`}\nMensagem: ${guilddb.contador.msg == "null" ? "`🔊 Membros em call: {contador}`" : `\`\`\`${guilddb.contador.msg}\`\`\``}`,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        interaction.reply({ embeds: [embed], components: [row] }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === interaction.user.id) {
                    if (i.customId === "ativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.status": true, "contador.status2": 2 } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "desativar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.status": false, "contador.status2": 1 } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "canal-setar") {

                        const filter = m => m.author.id === interaction.user.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **contador de membros em call**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.contador.channel) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            let certo = false;

                            if (canal.type === ChannelType.GuildVoice) { certo = true } else if (canal.type === ChannelType.GuildCategory) { certo = true } else { certo = false }

                            if (certo === true) {
                                await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.channel": canal.id } })

                                await VerifyButtons();
                                await VerifyFields();

                                interaction.editReply({ embeds: [embed], components: [row] })
                                m.channel.send({ content: `${i.user}, canal de **contador de membros em call** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else { m.channel.send({ content: `${i.user}, o canal inserido precisa ser um canal de voz ou uma catergoria.` }).then(async (m) => { await sleep(10000); m.delete(); }) }

                        });
                    } else if (i.customId === "msg-setar") {

                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe a nova mensagem para ser setada como **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 50) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **50**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else if (newmsg == guilddb.contador.msg) { return m.reply({ content: `${i.user}, a mensagem inserida é a mesma setada atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); }); } else {

                                await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.msg": newmsg } })

                                await VerifyButtons();
                                await VerifyFields();

                                interaction.editReply({ embeds: [embed], components: [row] })
                                m.channel.send({ content: `${i.user}, a mensagem do cotador de membros em call foi **alterada** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });
                    } else if (i.customId === "canal-resetar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.channel": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, canal de **contador de membros em call** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "msg-resetar") {

                        await client.guilddb.updateOne({ IDs: interaction.guild.id }, { $set: { "contador.msg": "🔊 Membros em call: {contador}" } })

                        await VerifyButtons();
                        await VerifyFields();

                        interaction.editReply({ embeds: [embed], components: [row] })

                        i.reply({ content: `${i.user}, a mensagem do cotador de membros em call foi **resetada** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)
                canal.setDisabled(true)
                mensagem.setDisabled(true)
                resetcanal.setDisabled(true)
                resetmsg.setDisabled(true)

                interaction.editReply({ components: [row] })
            });

        })

    }
}