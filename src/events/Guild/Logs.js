const client = require(`${process.cwd()}/index.js`);
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, WebhookClient, ButtonStyle, TextInputBuilder, ModalBuilder, ChannelType, TextInputStyle } = require('discord.js');
const moment = require('moment')
const logs = require('discord-logs');
logs(client);

module.exports = {
    name: "Logs.js"
};

client.on("guildMemberAdd", async (member) => {

    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    try {

        // Boas Vindas
        if (server.welcome.status) {

            if (server.welcome.mode == '1') {
                client.channels.cache.get(server.welcome.channel).send(
                    server.welcome.msg
                        .replace(/{member}/g, `<@${member.id}>`)
                        .replace(/{username}/g, `${member.user.username}`)
                        .replace(/{servername}/g, guild.name)
                ).then(msg => {
                    if (server.welcome.time == '0') { } else {
                        setTimeout(() => {
                            msg.delete()
                        }, server.welcome.time)
                    }
                });
            }

            if (server.welcome.mode == '2') {
                let embed = new EmbedBuilder()
                    .setColor(server.welcome.cor)
                    .setDescription(server.welcome.msg
                        .replace(/{member}/g, `<@${member.id}>`)
                        .replace(/{username}/g, `${member.user.username}`)
                        .replace(/{servername}/g, guild.name))

                client.channels.cache.get(server.welcome.channel).send({ embeds: [embed] }).then(msg => {
                    if (server.welcome.time == '0') { } else {
                        setTimeout(() => {
                            msg.delete()
                        }, server.welcome.time)
                    }
                });

            }

        }

    } catch (err) {
    }

    try {
        // Logs Entrada
        if (server.logs.status) {

            const data = moment(member.user.createdAt).format("DD/MM/YYYY");

            if (server.logs.entrada == null) { } else {

                let logentrada = new EmbedBuilder()
                    .setColor("#47b27f")
                    .setTitle(`Entrada de membro`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`Usuário: \`${member.user.tag}\`\nID: \`${member.id}\`\nData de Criação: \`${data}\`\nTotal de Membros: \`${guild.memberCount.toLocaleString()}\``);

                client?.channels?.cache?.get(server.logs.entrada)?.send({ embeds: [logentrada] });
            }
        }

    } catch (err) {
    }

    try {

        // Auto-Role
        if (server.autorole.status) {
            member.roles.add(server.autorole.roles, "Sistema de auto-roles");
        }

    } catch (err) {
    }

})

client.on("guildMemberRemove", async (member) => {

    try {

        let guild = member.guild;

        const server = await client.guilddb.findOne({
            IDs: guild.id,
        });


        // Logs Saída
        if (server.logs.status) {

            const data = moment(member.user.createdAt).format("DD/MM/YYYY");

            if (server.logs.saida == null) { } else {

                let logsaida = new EmbedBuilder()
                    .setColor("#ef4647")
                    .setTitle(`Saída de membro`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`Usuário: \`${member.user.tag}\`\nID: \`${member.id}\`\nData de Criação: \`${data}\`\nTotal de Membros: \`${guild.memberCount.toLocaleString()}\``);

                client?.channels?.cache?.get(server.logs.saida)?.send({ embeds: [logsaida] });
            }
        }

    } catch (err) {
    }

})

client.on("messageDelete", async (message) => {
    try {

        if (message.author.bot) return;
        if (!message.guild) return;

        let guild = message.guild;
        let user = message.author;
        let msg = message.content;
        let canal = message.channel;

        const server = await client.guilddb.findOne({
            IDs: guild.id,
        });

        // Logs Mensagem Deletada
        if (server.logs.status) {

            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Mensagem excluída', iconURL: user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) })
                .setColor('ef4647')
                .addFields({ name: `Autor:`, value: `\`${user.tag}\``, inline: true })
                .addFields({ name: `Canal`, value: `${canal}`, inline: true })
                .addFields({ name: `Mensagem:`, value: `\`\`\`${msg}\`\`\``, inline: false })

            client.channels.cache.get(server.logs.mensagem).send({ embeds: [embed] })

        }

    } catch (err) {
    }

})

client.on("messageUpdate", async (message, oldMessage) => {
    try {

        if (message.author.bot) return;
        if (!message.guild) return;

        let guild = message.guild;
        let user = message.author;
        let newmsg = oldMessage.content;
        let oldmsg = message.content;
        let canal = message.channel;

        const server = await client.guilddb.findOne({
            IDs: guild.id,
        });

        // Logs Mensagem Editada
        if (server.logs.status) {

            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Mensagem editada', iconURL: user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) })
                .setColor('f8a31a')
                .addFields({ name: `Autor:`, value: `\`${user.tag}\``, inline: true })
                .addFields({ name: `Canal`, value: `${canal}`, inline: true })
                .addFields({ name: `Antiga mensagem:`, value: `\`\`\`${oldmsg}\`\`\``, inline: false })
                .addFields({ name: `Nova mensagem:`, value: `\`\`\`${newmsg}\`\`\``, inline: false })

            client.channels.cache.get(server.logs.mensagem).send({ embeds: [embed] })

        }

    } catch (err) {
    }

})

client.on("voiceChannelJoin", async (member, channel) => {

    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    try {

        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        let membroscall = 0;
        await voiceChannels.forEach(c => membroscall += c.members.size);

        if (server.logs.status) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Entrada em voz', iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR_GREEN)
                .addFields({ name: `Membro:`, value: `\`${member.user.tag}\``, inline: true })
                .addFields({ name: `Membro ID:`, value: `\`${member.user.id}\``, inline: true })
                .addFields({ name: `Canal:`, value: `${channel}`, inline: false })
                .addFields({ name: `Total em call:`, value: `\`${membroscall}\``, inline: false })
                .setTimestamp()

            client.channels.cache.get(server.logs.trafego).send({ embeds: [embed] })
        }
    } catch (err) { }
});

client.on("voiceChannelLeave", async (member, channel) => {
    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });
    try {

        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        let membroscall = 0;
        await voiceChannels.forEach(c => membroscall += c.members.size);

        if (server.logs.status) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Saída de voz', iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR_RED)
                .addFields({ name: `Membro:`, value: `\`${member.user.tag}\``, inline: true })
                .addFields({ name: `Membro ID:`, value: `\`${member.user.id}\``, inline: true })
                .addFields({ name: `Canal:`, value: `${channel}`, inline: false })
                .addFields({ name: `Total em call:`, value: `\`${membroscall}\``, inline: false })
                .setTimestamp()

            client.channels.cache.get(server.logs.trafego).send({ embeds: [embed] })
        }
    } catch (err) { }
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    try {
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        let membroscall = 0;
        await voiceChannels.forEach(c => membroscall += c.members.size);

        if (server.logs.status) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Troca de voz', iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR_YELLOW)
                .addFields({ name: `Membro:`, value: `\`${member.user.tag}\``, inline: true })
                .addFields({ name: `Membro ID:`, value: `\`${member.user.id}\``, inline: true })
                .addFields({ name: `Novo ganal:`, value: `${newChannel}`, inline: false })
                .addFields({ name: `Antigo ganal:`, value: `${oldChannel}`, inline: false })
                .addFields({ name: `Total em call:`, value: `\`${membroscall}\``, inline: false })
                .setTimestamp()

            client.channels.cache.get(server.logs.trafego).send({ embeds: [embed] })
        }
    } catch (err) { }
});

client.on("voiceStreamingStart", async (member, voiceChannel) => {
    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    try {
        if (server.logs.status) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Transmissão iniciada', iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR_GREEN)
                .addFields({ name: `Membro:`, value: `\`${member.user.tag}\``, inline: true })
                .addFields({ name: `Membro ID:`, value: `\`${member.user.id}\``, inline: true })
                .addFields({ name: `Canal:`, value: `${voiceChannel}`, inline: false })
                .setTimestamp()

            client.channels.cache.get(server.logs.trafego).send({ embeds: [embed] })
        }
    } catch (err) { }
});

client.on("voiceStreamingStop", async (member, voiceChannel) => {
    let guild = member.guild;

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    try {
        if (server.logs.status) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Transmissão encerrada', iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
                .setColor(process.env.COLOR_RED)
                .addFields({ name: `Membro:`, value: `\`${member.user.tag}\``, inline: true })
                .addFields({ name: `Membro ID:`, value: `\`${member.user.id}\``, inline: true })
                .addFields({ name: `Canal:`, value: `${voiceChannel}`, inline: false })
                .setTimestamp()

            client.channels.cache.get(server.logs.trafego).send({ embeds: [embed] })
        }
    } catch (err) { }
});