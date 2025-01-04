const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = {
    config: {
        name: "logs",
        aliases: ["log"],
        description: "Configure o sistema de logs.",
        category: "ADM",
        usage: null,
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await message.reply({ content: `${message.author}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

        let guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
        if (!guilddb) guilddb = await new client.guilddb({ IDs: message.guild.id }).save();

        const row = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()

        const estado = new ButtonBuilder()
        const sentrada = new ButtonBuilder()
        const rentrada = new ButtonBuilder()
        const ssaida = new ButtonBuilder()
        const rsaida = new ButtonBuilder()
        const smensagem = new ButtonBuilder()
        const rmensagem = new ButtonBuilder
        const svoz = new ButtonBuilder()
        const rvoz = new ButtonBuilder()

        if (guilddb.logs.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); row.addComponents(estado) }

        if (guilddb.logs.entrada == "null") { sentrada.setStyle(1).setLabel('Setar Entrada').setCustomId('entrada-setar'); row.addComponents(sentrada) } else { sentrada.setStyle(2).setLabel('Alterar Entrada').setCustomId('entrada-setar'); row.addComponents(sentrada) }

        if (guilddb.logs.entrada == "null") { rentrada.setStyle(4).setLabel('Resetar Entrada').setCustomId('entrada-resetar').setDisabled(true); row2.addComponents(rentrada) } else { rentrada.setStyle(4).setLabel('Resetar Entrada').setCustomId('entrada-resetar'); row2.addComponents(rentrada) }

        if (guilddb.logs.saida == "null") { ssaida.setStyle(1).setLabel('Setar Saída').setCustomId('saida-setar'); row.addComponents(ssaida) } else { ssaida.setStyle(2).setLabel('Alterar Saída').setCustomId('saida-setar'); row.addComponents(ssaida) }

        if (guilddb.logs.saida == "null") { rsaida.setStyle(4).setLabel('Resetar Saída').setCustomId('saida-resetar').setDisabled(true); row2.addComponents(rsaida) } else { rsaida.setStyle(4).setLabel('Resetar Saída').setCustomId('saida-resetar'); row2.addComponents(rsaida) }

        if (guilddb.logs.mensagem == "null") { smensagem.setStyle(1).setLabel('Setar Mensagem').setCustomId('msg-setar'); row.addComponents(smensagem) } else { smensagem.setStyle(2).setLabel('Alterar Mensagem').setCustomId('msg-setar'); row.addComponents(smensagem) }

        if (guilddb.logs.mensagem == "null") { rmensagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); row2.addComponents(rmensagem) } else { rmensagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar'); row2.addComponents(rmensagem) }

        if (guilddb.logs.trafego == "null") { svoz.setStyle(1).setLabel('Setar Voz').setCustomId('voz-setar'); row.addComponents(svoz) } else { svoz.setStyle(2).setLabel('Alterar Voz').setCustomId('voz-setar'); row.addComponents(svoz) }

        if (guilddb.logs.trafego == "null") { rvoz.setStyle(4).setLabel('Resetar Voz').setCustomId('voz-resetar').setDisabled(true); row2.addComponents(rvoz) } else { rvoz.setStyle(4).setLabel('Resetar Voz').setCustomId('voz-resetar'); row2.addComponents(rvoz) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: message.guild.id });

            if (guilddb.logs.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); }

            if (guilddb.logs.entrada == "null") { sentrada.setStyle(1).setLabel('Setar Entrada').setCustomId('entrada-setar'); } else { sentrada.setStyle(2).setLabel('Alterar Entrada').setCustomId('entrada-setar'); }

            if (guilddb.logs.entrada == "null") { rentrada.setStyle(4).setLabel('Resetar Entrada').setCustomId('entrada-resetar').setDisabled(true); } else { rentrada.setStyle(4).setLabel('Resetar Entrada').setCustomId('entrada-resetar').setDisabled(false); }

            if (guilddb.logs.saida == "null") { ssaida.setStyle(1).setLabel('Setar Saída').setCustomId('saida-setar'); } else { ssaida.setStyle(2).setLabel('Alterar Saída').setCustomId('saida-setar'); }

            if (guilddb.logs.saida == "null") { rsaida.setStyle(4).setLabel('Resetar Saída').setCustomId('saida-resetar').setDisabled(true); } else { rsaida.setStyle(4).setLabel('Resetar Saída').setCustomId('saida-resetar').setDisabled(false); }

            if (guilddb.logs.mensagem == "null") { smensagem.setStyle(1).setLabel('Setar Mensagem').setCustomId('msg-setar'); } else { smensagem.setStyle(2).setLabel('Alterar Mensagem').setCustomId('msg-setar'); }

            if (guilddb.logs.mensagem == "null") { rmensagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); } else { rmensagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(false); }

            if (guilddb.logs.trafego == "null") { svoz.setStyle(1).setLabel('Setar Voz').setCustomId('voz-setar'); } else { svoz.setStyle(2).setLabel('Alterar Voz').setCustomId('voz-setar'); }

            if (guilddb.logs.trafego == "null") { rvoz.setStyle(4).setLabel('Resetar Voz').setCustomId('voz-resetar').setDisabled(true); } else { rvoz.setStyle(4).setLabel('Resetar Voz').setCustomId('voz-resetar').setDisabled(false); }

        }
        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de logs.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: "Informações:",
                value: `Estado: ${guilddb.logs.status == false ? "`Desativado`" : "`Ativado`"}\nEntrada: ${guilddb.logs.entrada == "null" ? "`Não localizado`" : `<#${guilddb.logs.entrada}>`}\nSaída: ${guilddb.logs.saida == "null" ? "`Não localizado`" : `<#${guilddb.logs.saida}>`}\nMensagem: ${guilddb.logs.mensagem == "null" ? "`Não localizado`" : `<#${guilddb.logs.mensagem}>`}\nVoz: ${guilddb.logs.trafego == "null" ? "`Não localizado`" : `<#${guilddb.logs.trafego}>`}`,
            }],
            image: {
                url: process.env.IMG_LOGS,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({ format: "png" })}`,
            },
        };

        async function VerifyFields() {
            guilddb = await client.guilddb.findOne({ IDs: message.guild.id })

            embed.fields = [{
                name: "Informações:",
                value: `Estado: ${guilddb.logs.status == false ? "`Desativado`" : "`Ativado`"}\nEntrada: ${guilddb.logs.entrada == "null" ? "`Não localizado`" : `<#${guilddb.logs.entrada}>`}\nSaída: ${guilddb.logs.saida == "null" ? "`Não localizado`" : `<#${guilddb.logs.saida}>`}\nMensagem: ${guilddb.logs.mensagem == "null" ? "`Não localizado`" : `<#${guilddb.logs.mensagem}>`}\nVoz: ${guilddb.logs.trafego == "null" ? "`Não localizado`" : `<#${guilddb.logs.trafego}>`}`,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        message.reply({ embeds: [embed], components: [row, row2] }).then(async (msg) => {
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === message.author.id) {
                    if (i.customId === "ativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.status": true } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "desativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.status": false } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "entrada-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **logs de entrada**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.logs.entrada) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.entrada": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **logs de entrada** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });
                    } else if (i.customId === "saida-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **logs de saia**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.logs.saida) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.saida": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **logs de saída** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });
                    } else if (i.customId === "msg-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **logs de mensagem**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.logs.mensagem) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.mensagem": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **logs de mensagem** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });
                    } else if (i.customId === "voz-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **logs de voz**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.logs.trafego) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.trafego": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **logs de voz** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });
                    } else if (i.customId === "entrada-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.entrada": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, canal de **logs de entrada** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "saida-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.saida": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, canal de **logs de saída** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "voz-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.trafego": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, canal de **logs de voz** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "msg-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "logs.mensagem": "null" } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, canal de **logs de mensagem** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)
                sentrada.setDisabled(true)
                rentrada.setDisabled(true)
                ssaida.setDisabled(true)
                rsaida.setDisabled(true)
                smensagem.setDisabled(true)
                rmensagem.setDisabled(true)
                svoz.setDisabled(true)
                rvoz.setDisabled(true)

                msg.edit({ components: [row, row2] })
            });

        })

    }
}