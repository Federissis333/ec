const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, EmbedBuilder } = require('discord.js');
const { Color, isColor } = require("coloras");
const { ImgurClient } = require('imgur');
const imgur = new ImgurClient({ clientId: process.env.IMGUR });

module.exports = {
    config: {
        name: "embed",
        aliases: null,
        description: "Crie uma embed personalizada.",
        category: "ADM",
        usage: null,
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await message.reply({ content: `${message.author}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
        } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

        let hasTitle = false;
        let hasDescription = false;
        let hasImage = false;
        let hasThumb = false;
        let hasFooter = false;
        let hasColor = false;
        let send = false;

        const embed = new EmbedBuilder()
            .setTitle('Título')
            .setDescription('Todos os campos que estiverem vazios não irá aparecer ao enviar a mensagem.')
            .setImage(client.user.displayAvatarURL({ display: true, size: 4096 }))
            .setThumbnail(client.user.displayAvatarURL({ display: true, size: 4096 }))
            .setFooter({ text: `Rodapé` })
            .setColor(process.env.COLOR1)

        const newEmbed = new EmbedBuilder()

        const row1 = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()
        const row3 = new ActionRowBuilder()

        const bTitle = new ButtonBuilder()
            .setCustomId('title')
        const bDescription = new ButtonBuilder()
            .setCustomId('description')
        const bImage = new ButtonBuilder()
            .setCustomId('image')
        const bThumb = new ButtonBuilder()
            .setCustomId('thumb')
        const bFooter = new ButtonBuilder()
            .setCustomId('footer')
        const bColor = new ButtonBuilder()
            .setCustomId('color')
        const bSend = new ButtonBuilder()
            .setCustomId('send')
        const bClose = new ButtonBuilder()
            .setCustomId('close')
            .setLabel('Fechar')
            .setStyle(4)

        async function VerifyButtons() {

            if (hasTitle === false) { bTitle.setLabel('Setar Título').setStyle(1) } else { bTitle.setLabel('Alterar Título').setStyle(2); send = true; embed.setTitle(hasTitle); }

            if (hasDescription === false) { bDescription.setLabel('Setar Descrição').setStyle(1) } else { bDescription.setLabel('Alterar Descrição').setStyle(2); send = true; embed.setDescription(hasDescription) }

            if (hasColor === false) { bColor.setLabel('Setar Cor').setStyle(1) } else { bColor.setLabel('Alterar Cor').setStyle(2); send = true; embed.setColor(hasColor) }

            if (hasFooter === false) { bFooter.setLabel('Setar Rodapé').setStyle(1) } else { bFooter.setLabel('Alterar Rodapé').setStyle(2); send = true; embed.setFooter({ text: hasFooter }) }

            if (hasImage === false) { bImage.setLabel('Setar Imagem').setStyle(1) } else { bImage.setLabel('Alterar Imagem').setStyle(2); send = true; embed.setImage(hasImage) }

            if (hasThumb === false) { bThumb.setLabel('Setar Thumb').setStyle(1) } else { bThumb.setLabel('Alterar Thumb').setStyle(2); send = true; embed.setThumbnail(hasThumb) }

            if (send === false) { bSend.setLabel('Enviar').setStyle(3).setDisabled(true); } else { bSend.setLabel('Enviar').setStyle(3).setDisabled(false); }

        }

        async function VerifyEmbed() {

            if (hasTitle === false) { } else { newEmbed.setTitle(hasTitle); }

            if (hasDescription === false) { } else { newEmbed.setDescription(hasDescription) }

            if (hasColor === false) { newEmbed.setColor(process.env.COLOR1) } else { newEmbed.setColor(hasColor) }

            if (hasFooter === false) { } else { newEmbed.setFooter({ text: hasFooter }) }

            if (hasImage === false) { } else { newEmbed.setImage(hasImage) }

            if (hasThumb === false) { } else { newEmbed.setThumbnail(hasThumb) }

        }

        row1.addComponents(bTitle)
        row1.addComponents(bDescription)
        row1.addComponents(bColor)
        row1.addComponents(bFooter)
        row2.addComponents(bImage)
        row2.addComponents(bThumb)
        row3.addComponents(bSend)
        row3.addComponents(bClose)

        const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

        await VerifyButtons();
        message.reply({ embeds: [embed], components: [row1, row2, row3] }).then(async (msg) => {
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 * 3 });

            collector.on('collect', async (i) => {

                if (i.user.id === message.author.id) {

                    if (i.customId === "title") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe um título para ser setado na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 200) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **200**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else {

                                hasTitle = newmsg

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })
                                m.channel.send({ content: `${i.user}, o título foi **alterada** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });

                    } else if (i.customId === "description") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe a descrição para ser setada na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 4000) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **4000**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else {

                                hasDescription = newmsg

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })
                                m.channel.send({ content: `${i.user}, a descrição foi **alterada** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });

                    } else if (i.customId === "image") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, envie uma imagem para ser setada na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let attachment = m.attachments.first();

                            if (!attachment) return i.channel.send({ content: `${i.user}, é preciso enviar uma imagem.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            let ImageLink = attachment.proxyURL;
                            const tempName = ImageLink.split("/");
                            const attachName = tempName[tempName.length - 1];

                            if (attachName.includes(".jpg") || attachName.includes(".jpeg") || attachName.includes(".png") || attachName.includes(".svg") || attachName.includes(".tiff") || attachName.includes(".bmp") || attachName.includes(".webp") || attachName.includes(".JPEG") || attachName.includes(".PNG") || attachName.includes(".JPG") || attachName.includes(".SVG") || attachName.includes(".TIFF") || attachName.includes(".BMP") || attachName.includes(".WEBP") || attachName.includes(".gif") || attachName.includes(".GIF")) {

                                ImageLink = ImageLink.replace(/.webp/g, '.png')
                                ImageLink = ImageLink.replace(/.WEBP/g, '.png')

                                const image = await imgur.upload({
                                    image: ImageLink,
                                    title: 'Adyra',
                                    description: 'Adyra Bot Service | By: azonix#0001',
                                });

                                hasImage = image.data.link;

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })
                                m.channel.send({ content: `${i.user}, a imagem foi alterada com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            } else {

                                i.channel.send({ content: `${i.user}, é preciso enviar uma imagem.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            }

                        });

                    } else if (i.customId === "thumb") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, envie uma imagem para ser setada como thumb na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let attachment = m.attachments.first();

                            if (!attachment) return i.channel.send({ content: `${i.user}, é preciso enviar uma imagem.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            let ImageLink = attachment.proxyURL;
                            const tempName = ImageLink.split("/");
                            const attachName = tempName[tempName.length - 1];

                            if (attachName.includes(".jpg") || attachName.includes(".jpeg") || attachName.includes(".png") || attachName.includes(".svg") || attachName.includes(".tiff") || attachName.includes(".bmp") || attachName.includes(".webp") || attachName.includes(".JPEG") || attachName.includes(".PNG") || attachName.includes(".JPG") || attachName.includes(".SVG") || attachName.includes(".TIFF") || attachName.includes(".BMP") || attachName.includes(".WEBP") || attachName.includes(".gif") || attachName.includes(".GIF")) {

                                ImageLink = ImageLink.replace(/.webp/g, '.png')
                                ImageLink = ImageLink.replace(/.WEBP/g, '.png')

                                const image = await imgur.upload({
                                    image: ImageLink,
                                    title: 'Adyra',
                                    description: 'Adyra Bot Service | By: azonix#0001',
                                });

                                hasThumb = image.data.link;

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })
                                m.channel.send({ content: `${i.user}, a imagem foi alterada com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            } else {

                                i.channel.send({ content: `${i.user}, é preciso enviar uma imagem.` }).then(async (m) => { await sleep(10000); m.delete(); });

                            }

                        });

                    } else if (i.customId === "footer") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe uma mensagem de rodapé para ser setada na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let newmsg = m.content

                            if (newmsg.length > 200) {
                                return m.reply({ content: `${i.user}, a mensagem inserida é muito grande, o limite de caracteres é de **200**.` }).then(async (m) => { await sleep(10000); m.delete(); });
                            } else {

                                hasFooter = newmsg

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })
                                m.channel.send({ content: `${i.user}, o rodapé da embed foi **alterado** para: \`\`\` ${newmsg} \`\`\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                            }
                        });

                    } else if (i.customId === "color") {

                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                        i.reply({ content: `${i.user}, informe uma cor para ser setada na embed.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

                        collector.on('collect', async (m) => {

                            let aznx = m.content.trim().split(/ +/g);
                            let pfx = aznx[0]

                            if (isColor(pfx).color === true) {
                                let cor = new Color(pfx);
                                cor = cor.toHex();

                                hasColor = cor

                                await VerifyButtons();

                                m.delete().catch((err) => { })

                                msg.edit({ embeds: [embed], components: [row1, row2, row3] })

                                m.channel.send({ content: `${i.user}, a cor da embed foi **alterada** para: \`${cor}\`` }).then(async (m) => { await sleep(10000); m.delete(); });

                            } else {
                                m.channel.send({ content: `${i.user}, você deve inserir uma cor válida. A cor pode ser em: RGB, HEX, HSL, HSV, CMYK. Exemplo \`#ce52fe\`` }).then(async (m) => { await sleep(10000); m.delete(); });
                                m.delete().catch((err) => { })
                            }
                        });

                    } else if (i.customId === "send") {

                        i.deferUpdate();
                        await VerifyEmbed()
                        await message.channel.send({ embeds: [newEmbed], components: [] }).catch((err) => { })
                        msg.delete().catch((err) => { });

                    } else if (i.customId === "close") {

                        i.deferUpdate();

                        await VerifyButtons();

                        bTitle.setDisabled(true)
                        bDescription.setDisabled(true)
                        bImage.setDisabled(true)
                        bThumb.setDisabled(true)
                        bFooter.setDisabled(true)
                        bColor.setDisabled(true)
                        bSend.setDisabled(true)
                        bClose.setDisabled(true)

                        msg.edit({ components: [row1, row2, row3] })

                    }

                } else { i.deferUpdate(); }
            });

            collector.on('end', async (collected) => {

                await VerifyButtons();

                bTitle.setDisabled(true)
                bDescription.setDisabled(true)
                bImage.setDisabled(true)
                bThumb.setDisabled(true)
                bFooter.setDisabled(true)
                bColor.setDisabled(true)
                bSend.setDisabled(true)
                bClose.setDisabled(true)

                msg.edit({ components: [row1, row2, row3] })
            });

        })

    },
};