const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = {
    config: {
        name: "random",
        aliases: null,
        description: "Configure o sistema de random gif/icon/banner",
        category: "ADM",
        usage: null,
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await message.reply({ content: `${message.author}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true })

        let guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
        if (!guilddb) guilddb = await new client.guilddb({ IDs: message.guild.id }).save();

        const row = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()

        const estado = new ButtonBuilder()
        const gif = new ButtonBuilder()
        const icon = new ButtonBuilder()
        const banner = new ButtonBuilder()
        const gif2 = new ButtonBuilder()
        const icon2 = new ButtonBuilder()
        const banner2 = new ButtonBuilder()

        if (guilddb.random.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); row.addComponents(estado) }

        if (guilddb.random.gif == "null") { gif.setStyle(1).setLabel('Setar Gif').setCustomId('gif-setar'); row.addComponents(gif) } else { gif.setStyle(2).setLabel('Alterar Gif').setCustomId('gif-alterar'); row.addComponents(gif) }

        if (guilddb.random.icon == "null") { icon.setStyle(1).setLabel('Setar Icon').setCustomId('icon-setar'); row.addComponents(icon) } else { icon.setStyle(2).setLabel('Alterar Icon').setCustomId('icon-alterar'); row.addComponents(icon) }

        if (guilddb.random.banner == "null") { banner.setStyle(1).setLabel('Setar Banner').setCustomId('banner-setar'); row.addComponents(banner) } else { banner.setStyle(2).setLabel('Alterar Banner').setCustomId('banner-alterar'); row.addComponents(banner) }

        if (guilddb.random.gif == "null") { gif2.setStyle(4).setLabel('Resetar Gif').setCustomId('gif-resetar').setDisabled(true); row2.addComponents(gif2) } else { gif2.setStyle(4).setLabel('Resetar Gif').setCustomId('gif-resetar').setDisabled(false); row2.addComponents(gif2) }

        if (guilddb.random.icon == "null") { icon2.setStyle(4).setLabel('Resetar Icon').setCustomId('icon-resetar').setDisabled(true); row2.addComponents(icon2) } else { icon2.setStyle(4).setLabel('Resetar Icon').setCustomId('icon-resetar').setDisabled(false); row2.addComponents(icon2) }

        if (guilddb.random.banner == "null") { banner2.setStyle(4).setLabel('Resetar Banner').setCustomId('banner-resetar').setDisabled(true); row2.addComponents(banner2) } else { banner2.setStyle(4).setLabel('Resetar Banner').setCustomId('banner-resetar'); row2.addComponents(banner2) }

        async function VerifyButtons() {

            guilddb = await client.guilddb.findOne({ IDs: message.guild.id });

            if (guilddb.random.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('estado-ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('estado-desativar'); }

            if (guilddb.random.gif == "null") { gif.setStyle(1).setLabel('Setar Gif').setCustomId('gif-setar'); } else { gif.setStyle(2).setLabel('Alterar Gif').setCustomId('gif-alterar'); }

            if (guilddb.random.icon == "null") { icon.setStyle(1).setLabel('Setar Icon').setCustomId('icon-setar'); } else { icon.setStyle(2).setLabel('Alterar Icon').setCustomId('icon-alterar'); }

            if (guilddb.random.banner == "null") { banner.setStyle(1).setLabel('Setar Banner').setCustomId('banner-setar'); } else { banner.setStyle(2).setLabel('Alterar Banner').setCustomId('banner-alterar'); }

            if (guilddb.random.gif == "null") { gif2.setStyle(4).setLabel('Resetar Gif').setCustomId('gif-resetar').setDisabled(true); } else { gif2.setStyle(4).setLabel('Resetar Gif').setCustomId('gif-resetar').setDisabled(false); }

            if (guilddb.random.icon == "null") { icon2.setStyle(4).setLabel('Resetar Icon').setCustomId('icon-resetar').setDisabled(true); } else { icon2.setStyle(4).setLabel('Resetar Icon').setCustomId('icon-resetar').setDisabled(false); }

            if (guilddb.random.banner == "null") { banner2.setStyle(4).setLabel('Resetar Banner').setCustomId('banner-resetar').setDisabled(true); } else { banner2.setStyle(4).setLabel('Resetar Banner').setCustomId('banner-resetar'); }

        }

        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de random.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [{
                name: "Informações:",
                value: `Estado: ${guilddb.random.status == false ? "`Desativado`" : "`Ativado`"}\nGif: ${guilddb.random.gif == "null" ? "`Não localizado`" : `<#${guilddb.random.gif}>`}\nIcon: ${guilddb.random.icon == "null" ? "`Não localizado`" : `<#${guilddb.random.icon}>`}\nBanner: ${guilddb.random.banner == "null" ? "`Não localizado`" : `<#${guilddb.random.banner}>`}`,
            }],
            image: {
                url: process.env.IMG_RANDOMGIF,
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
                value: `Estado: ${guilddb.random.status == false ? "`Desativado`" : "`Ativado`"}\nGif: ${guilddb.random.gif == "null" ? "`Não localizado`" : `<#${guilddb.random.gif}>`}\nIcon: ${guilddb.random.icon == "null" ? "`Não localizado`" : `<#${guilddb.random.icon}>`}\nBanner: ${guilddb.random.banner == "null" ? "`Não localizado`" : `<#${guilddb.random.banner}>`}`,
            }]
        }

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        message.reply({ embeds: [embed], components: [row, row2] }).then(async (msg) => {
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {

                if (i.user.id === message.author.id) {
                    if (i.customId === "estado-ativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.status": true, "random.status2": 2 } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })
                        i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "estado-desativar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.status": false, "random.status2": 1 } })

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })

                        i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                    } else if (i.customId === "gif-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random gif**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.gif": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })


                            m.channel.send({ content: `${i.user}, canal de **random gif** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });


                        });

                    } else if (i.customId === "gif-alterar") {
                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random gif**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.random.gif) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.gif": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **random gif** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });

                    } else if (i.customId === "gif-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.gif": "null" } })
                        i.deferUpdate();

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })
                        i.channel.send({ content: `${i.user}, canal de **random gif** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    } else if (i.customId === "icon-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random icon**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.icon": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })


                            m.channel.send({ content: `${i.user}, canal de **random icon** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });


                        });

                    } else if (i.customId === "icon-alterar") {
                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random icon**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.random.icon) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.icon": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **random icon** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });

                    } else if (i.customId === "icon-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.icon": "null" } })
                        i.deferUpdate();

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })
                        i.channel.send({ content: `${i.user}, canal de **random icon** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    } else if (i.customId === "banner-setar") {

                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random banner**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.banner": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })

                            m.channel.send({ content: `${i.user}, canal de **random banner** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); try { m.delete(); } catch (error) { } });


                        });

                    } else if (i.customId === "banner-alterar") {
                        const filter = m => m.author.id === message.author.id && m.mentions.channels.first() || m.guild.channels.cache.find((x) => x.id == m.content);
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, mencione o canal que você deseja setar para **random banner**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


                        collector.on('collect', async (m) => {

                            let canal = m.mentions.channels.first() || await m.guild.channels.cache.find((x) => x.id == m.content);

                            if (canal.id === guilddb.random.banner) return m.channel.send({ content: `${i.user}, o canal inserido é o mesmo setado atualmente.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.banner": canal.id } })

                            await VerifyButtons();
                            await VerifyFields();

                            msg.edit({ embeds: [embed], components: [row, row2] })
                            m.channel.send({ content: `${i.user}, canal de **random banner** alterado para ${canal}.` }).then(async (m) => { await sleep(10000); m.delete(); });

                        });

                    } else if (i.customId === "banner-resetar") {

                        await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "random.banner": "null" } })
                        i.deferUpdate();

                        await VerifyButtons();
                        await VerifyFields();

                        msg.edit({ embeds: [embed], components: [row, row2] })
                        i.channel.send({ content: `${i.user}, canal de **random banner** foi **resetado** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                estado.setDisabled(true)
                gif.setDisabled(true)
                icon.setDisabled(true)
                banner.setDisabled(true)
                gif2.setDisabled(true)
                icon2.setDisabled(true)
                banner2.setDisabled(true)
                msg.edit({ components: [new ActionRowBuilder().addComponents(estado).addComponents(gif).addComponents(icon).addComponents(banner), new ActionRowBuilder().addComponents(gif2).addComponents(icon2).addComponents(banner2)] })
            });

        })

    },
};