const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, ChannelType } = require('discord.js');

module.exports = {
    config: {
    name: "contadorcall",
    description: "Configure o sistema de contador de membros em call.",
        category: "administração",
        usage: null, 
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(`${message.author}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`);
        }

        if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(`${message.author}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`);
        }

        let guilddb = await client.guilddb.findOne({ IDs: message.guild.id });
        if (!guilddb) {
            guilddb = new client.guilddb({ IDs: message.guild.id });
            await guilddb.save();
        }

        const row = new ActionRowBuilder();
        const estado = new ButtonBuilder()
            .setStyle(guilddb.contador.status ? 4 : 3)
            .setLabel(guilddb.contador.status ? 'Desativar' : 'Ativar')
            .setCustomId(guilddb.contador.status ? 'desativar' : 'ativar');

        const canal = new ButtonBuilder()
            .setStyle(guilddb.contador.channel === "null" ? 1 : 2)
            .setLabel(guilddb.contador.channel === "null" ? 'Setar Canal' : 'Alterar Canal')
            .setCustomId('canal-setar');

        const mensagem = new ButtonBuilder()
            .setStyle(1)
            .setLabel('Alterar Mensagem')
            .setCustomId('msg-setar');

        const resetCanal = new ButtonBuilder()
            .setStyle(4)
            .setLabel('Resetar Canal')
            .setCustomId('canal-resetar')
            .setDisabled(guilddb.contador.channel === "null");

        const resetMsg = new ButtonBuilder()
            .setStyle(4)
            .setLabel('Resetar Mensagem')
            .setCustomId('msg-resetar')
            .setDisabled(guilddb.contador.msg === "null" || guilddb.contador.msg === "🔊 Membros em call: {contador}");

        row.addComponents(estado, canal, mensagem, resetCanal, resetMsg);

        const embed = {
            color: 3092790,
            author: {
                name: `${client.user.username}`,
                icon_url: `${client.user.displayAvatarURL({ size: 4096 })}`,
            },
            description: `Seja bem-vindo ao sistema de contador de membros em call.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
            thumbnail: {
                url: process.env.LOGO2,
            },
            fields: [
                {
                    name: 'Funções:',
                    value: "```{contador} - Retorna a quantidade de membros em call.```",
                },
                {
                    name: "Informações:",
                    value: `Estado: ${guilddb.contador.status ? "`Ativado`" : "`Desativado`"}\nCanal: ${guilddb.contador.channel === "null" ? "`Não localizado`" : `<#${guilddb.contador.channel}>`}\nMensagem: ${guilddb.contador.msg === "null" ? "`🔊 Membros em call: {contador}`" : `\`\`\`${guilddb.contador.msg}\`\`\``}`,
                },
            ],
            image: {
                url: process.env.IMG_CONTADORCALL,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({ format: "png" })}`,
            },
        };

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.deferUpdate();
            }

            if (i.customId === 'ativar') {
                await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "contador.status": true } });
                i.reply(`${i.user}, sistema **ativado** com sucesso.`).then(() => i.deleteReply());
            }

            if (i.customId === 'desativar') {
                await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "contador.status": false } });
                i.reply(`${i.user}, sistema **desativado** com sucesso.`).then(() => i.deleteReply());
            }

            // Outros comandos podem ser adicionados aqui com base nos IDs.
        });

        collector.on('end', () => {
            estado.setDisabled(true);
            canal.setDisabled(true);
            mensagem.setDisabled(true);
            resetCanal.setDisabled(true);
            resetMsg.setDisabled(true);
            msg.edit({ components: [row] });
        });
    },
};

