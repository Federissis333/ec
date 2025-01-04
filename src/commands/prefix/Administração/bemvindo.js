const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
const ms = require("ms");
const { Color, isColor } = require("coloras");

module.exports = {
    config: {
        name: "bemvindo",
        aliases: ["welcome", "boasvindas", "bem-vindo", "boas-vindas", "welcomer"],
        description: "Configure o sistema de boas vindas.",
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
        const setarcanal = new ButtonBuilder()
        const resetcanal = new ButtonBuilder()
        const tempo = new ButtonBuilder()
        const modo = new ButtonBuilder()
        const cor = new ButtonBuilder()
        const resetcor = new ButtonBuilder
        const mesagem = new ButtonBuilder()
        const resetmesagem = new ButtonBuilder()

        if (guilddb.welcome.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); row.addComponents(estado) }

        if (guilddb.welcome.channel == "null") { setarcanal.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); row.addComponents(setarcanal) } else { setarcanal.setStyle(2).setLabel('Alterar canal').setCustomId('canal-alterar'); row.addComponents(setarcanal) }

        if (guilddb.welcome.msg == "null") { mesagem.setStyle(1).setLabel('Setar Mensagem').setCustomId('msg-setar'); row2.addComponents(mesagem) } else { mesagem.setStyle(2).setLabel('Alterar Mensagem').setCustomId('msg-alterar'); row2.addComponents(mesagem) }

        if (guilddb.welcome.msg == "null") { resetmesagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); row2.addComponents(resetmesagem) } else { resetmesagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(false); row2.addComponents(resetmesagem) }

        if (guilddb.welcome.channel == "null") { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); row2.addComponents(resetcanal) } else { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); row2.addComponents(resetcanal) }

        tempo.setStyle(1).setLabel('Alterar Tempo').setCustomId('tempo-alterar'); row.addComponents(tempo)

        if (guilddb.welcome.mode == "1") { modo.setStyle(2).setLabel('Modo Embed').setCustomId('modo-embed'); row.addComponents(modo) } else { modo.setStyle(2).setLabel('Modo Texto').setCustomId('modo-texto'); row.addComponents(modo) }

        cor.setStyle(1).setLabel('Alterar Cor').setCustomId('cor-alterar'); row.addComponents(cor)

        if (guilddb.welcome.cor == "#2f3136") { resetcor.setStyle(4).setLabel('Resetar Cor').setCustomId('cor-resetar').setDisabled(true); row2.addComponents(resetcor) } else { resetcor.setStyle(4).setLabel('Resetar Cor').setCustomId('cor-resetar').setDisabled(false); row2.addComponents(resetcor) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: message.guild.id });

            if (guilddb.welcome.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); }

            if (guilddb.welcome.channel == "null") { setarcanal.setStyle(1).setLabel('Setar Canal').setCustomId('canal-setar'); } else { setarcanal.setStyle(2).setLabel('Alterar canal').setCustomId('canal-alterar'); }

            if (guilddb.welcome.msg == "null") { mesagem.setStyle(1).setLabel('Setar Mensagem').setCustomId('msg-setar'); } else { mesagem.setStyle(2).setLabel('Alterar Mensagem').setCustomId('msg-alterar'); }

            if (guilddb.welcome.msg == "null") { resetmesagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(true); } else { resetmesagem.setStyle(4).setLabel('Resetar Mensagem').setCustomId('msg-resetar').setDisabled(false); }

            if (guilddb.welcome.channel == "null") { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(true); } else { resetcanal.setStyle(4).setLabel('Resetar Canal').setCustomId('canal-resetar').setDisabled(false); }

            tempo.setStyle(1).setLabel('Alterar Tempo').setCustomId('tempo-alterar');

            if (guilddb.welcome.mode == "1") { modo.setStyle(2).setLabel('Modo Embed').setCustomId('modo-embed'); } else { modo.setStyle(2).setLabel('Modo Texto').setCustomId('modo-texto'); }

            cor.setStyle(1).setLabel('Alterar Cor').setCustomId('cor-alterar');

            if (guilddb.welcome.cor == "#2f3136") { resetcor.setStyle(4).setLabel('Resetar Cor').setCustomId('cor-resetar').setDisabled(true); } else { resetcor.setStyle(4).setLabel('Resetar Cor').setCustomId('cor-resetar').setDisabled(false); }

        }
        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de boas vindas.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: 'Funções:',
                value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
            },
            {
                name: "Informações:",
                value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
            }],
            image: {
                url: process.env.IMG_BEMVINDO,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({ format: "png" })}`,
            },
        };

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        message.reply({ embeds: [embed], components: [row, row2] }).then(async (msg) => {
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === message.author.id) {
                    if (i.customId === "estado-ativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.status": true } })
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],
                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "estado-desativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.status": false } })
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],

                            msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "canal-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.channel": canal.id } })

                            await VerifyButtons();
                            guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                            embed.fields = [{
                                name: 'Funções:',
                                value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                            }, {
                                name: "Informações:",
                                value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                            }],
                                msg.edit({ embeds: [embed], components: [row, row2] })

                            m.channel.send({ content: `${i.user}, canal de **boas vindas** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });

                        });

                    } else if (i.customId === "canal-alterar") {
                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.welcome.channel) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.channel": canal.id } })

                            await VerifyButtons();
                            guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                            embed.fields = [{
                                name: 'Funções:',
                                value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                            }, {
                                name: "Informações:",
                                value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                            }],

                                msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **boas vindas** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });

                    } else if (i.customId === "canal-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.channel": "null" } })
                        i.deferUpdate();
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],

                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.channel.send({ content: `${i.user}, canal de **boas vindas** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    } else if (i.customId === "tempo-alterar") {
                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe o novo tempo de exclusão que deseja setar.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m, args) => {
                            let aznx = m.content.trim().split(/ +/g);
                            let pfx = aznx[0]
                            var timeToMs = ms(pfx);

                            if (timeToMs > '2400000') {
                                return m.channel.send({ content: `${i.user}, o tempo inserido é muito grande, o tempo limite é \`40m\`` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });
                            } else if (timeToMs == guilddb.welcome.time) {
                                return m.channel.send({ content: `${i.user}, o tempo inserido é mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });
                            } else {
                                await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.time": timeToMs } })
                                await VerifyButtons();
                                guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                                embed.fields = [{
                                    name: 'Funções:',
                                    value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                                }, {
                                    name: "Informações:",
                                    value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                                }],

                                    msg.edit({ embeds: [embed], components: [row, row2] })
                                i.channel.send({ content: `${i.user}, o tempo de exclusão da mensagem foi alterado para: \`${time(timeToMs)}\`` });

                            }
                        });

                    } else if (i.customId === "modo-texto") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.mode": "1" } })
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],
                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, modo de mensagem de boas vindas foi **alterado** para **texto** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "modo-embed") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.mode": "2" } })
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],
                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, modo de mensagem de boas vindas foi **alterado** para **embed** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "cor-alterar") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe uma cor para ser setada na embed de **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let aznx = m.content.trim().split(/ +/g);
                            let pfx = aznx[0]

                            if (isColor(pfx).color === true) {
                                let cor = new Color(pfx);
                                cor = cor.toHex();
                                if (cor === guilddb.welcome.cor) { return m.channel.send({ content: `${i.user}, a cor inserida é a mesma setada atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); }); } else {
                                    await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.cor": cor } })

                                    await VerifyButtons();
                                    guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                                    embed.fields = [{
                                        name: 'Funções:',
                                        value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                                    }, {
                                        name: "Informações:",
                                        value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                                    }],

                                        msg.edit({ embeds: [embed], components: [row, row2] })
                                    m.channel.send({ content: `${i.user}, a cor da embed de boas vindas foi alterada para \`${cor}\`.` }).then(async (m) => { await sleep(10000); m.delete(); });
                                }
                            } else { return m.channel.send({ content: `${i.user}, você deve inserir uma cor válida. A cor pode ser em: RGB, HEX, HSL, HSV, CMYK. Exemplo \`#ce52fe\`` }).then(async (m) => { await sleep(10000); m.delete(); }); }



                        });

                    } else if (i.customId === 'cor-resetar') {
                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.cor": "#2f3136" } })
                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],
                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, cor da embed de boas vindas foi **resetada** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === 'msg-setar') {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe a nova mensagem para ser setada como **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 1000) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **1000**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else if (newmsg == guilddb.welcome.msg) { return m.reply({ content: `${i.user}, a mensagem inserida é a mesma setada atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); }); } else {

                                await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.msg": newmsg } })

                                await VerifyButtons();
                                guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                                embed.fields = [{
                                    name: 'Funções:',
                                    value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                                }, {
                                    name: "Informações:",
                                    value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                                }],

                                    msg.edit({ embeds: [embed], components: [row, row2] })
                                m.channel.send({ content: `${i.user}, a mensagem de boas vindas foi **alterada** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });
                    } if (i.customId === 'msg-alterar') {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe a nova mensagem para ser setada como **boas vindas**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 1000) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **1000**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else if (newmsg == guilddb.welcome.msg) { return m.reply({ content: `${i.user}, a mensagem inserida é a mesma setada atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); }); } else {

                                await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.msg": newmsg } })

                                await VerifyButtons();
                                guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                                embed.fields = [{
                                    name: 'Funções:',
                                    value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                                }, {
                                    name: "Informações:",
                                    value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                                }],

                                    msg.edit({ embeds: [embed], components: [row, row2] })
                                m.channel.send({ content: `${i.user}, a mensagem de boas vindas foi **alterada** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });
                    } else if (i.customId === 'msg-resetar') {
                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "welcome.msg": "null" } })

                        await VerifyButtons();
                        guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
                        embed.fields = [{
                            name: 'Funções:',
                            value: "```{member} - Marca o usuário;\n{username} - Exibe o nome do usuário;\n{servername} - Exibe o nome do servidor;```"
                        }, {
                            name: "Informações:",
                            value: `Estado: ${guilddb.welcome.status == false ? "`Desativado`" : "`Ativado`"}\nCanal: ${guilddb.welcome.channel == "null" ? "`Não localizado`" : `<#${guilddb.welcome.channel}>`}\nTempo de exclusão: ${guilddb.welcome.time == "0" ? "`0`" : `\`${time(guilddb.welcome.time)}\``}\nModo: ${guilddb.welcome.mode == "1" ? "`Normal`" : "`Embed`"}\nCor: ${guilddb.welcome.cor == "`#2f3136`" ? `\`#2f3136` : `\`${guilddb.welcome.cor}\``}\nMensagem: ${guilddb.welcome.msg == "null" ? "`Nenhuma Mensagem`" : `\`\`\`${guilddb.welcome.msg}\`\`\``}`,
                        }],

                            msg.edit({ embeds: [embed], components: [row, row2] })
                        i.channel.send({ content: `${i.user}, a mensagem de boas vindas foi **resetada** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });
                        i.deferUpdate();
                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)
                setarcanal.setDisabled(true)
                resetcanal.setDisabled(true)
                tempo.setDisabled(true)
                modo.setDisabled(true)
                cor.setDisabled(true)
                resetcor.setDisabled(true)
                mesagem.setDisabled(true)
                resetmesagem.setDisabled(true)

                msg.edit({ components: [row, row2] })
            });

        })

    },
};

function time(tempo) {
    let totalSeconds = (tempo / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${minutes}m ${seconds}s`;
}