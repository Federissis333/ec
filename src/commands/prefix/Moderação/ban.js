const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    config: {
        name: "ban",
        aliases: ["banir"],
        description: "Bana um usuário do servidor.",
        category: "moderação",
        usage: "ban [user]",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {

        let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let membrox = message.guild.members.cache.get(membro.id);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Nenhum motivo inserido.";

        if (!membro) return message.reply({ content: `${message.author}, você precisa informar um usário que você deseja banir.` });

        if (!message.guild.members.cache.get(membro.id)) return message.reply({ content: `${message.author}, este usuário não está no servidor.` });

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await message.reply({ content: `${message.author}, você precisa da permissão de **Banir Membros** para executar esta função.`, ephemeral: true });
        } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Banir Membros** para executar esta função.`, ephemeral: true });

        if (membro.id == message.author.id) return message.reply({ content: `${message.author}, você não pode se banir!`, ephemeral: true });

        if (membro.id == client.user.id) return message.reply({ content: `${message.authorr}, você não pode me banir!`, ephemeral: true });

        if (membro.id == message.guild.ownerId) return message.reply({ content: `${message.author}, você não pode banir o dono do servidor!`, ephemeral: true });

        if (message.guild.members.cache.get(client.user.id).roles.highest.position <= membrox.roles.highest.position) return message.reply({ content: `${message.author}, eu não tenho permissão de banir este usuario.`, ephemeral: true });

        if (message.member.roles.highest.position <= membrox.roles.highest.position) return message.reply({ content: `${message.author}, você não tem permissão de banir este usuario.`, ephemeral: true });

        let userdb = await client.userdb.findOne({ userID: message.author.id })
        if (!userdb) userdb = await new client.userdb({ userID: message.author.id }).save();

        let totalbanido = Number(userdb.infos.bans) + 1;

        let sucess = new EmbedBuilder()
            .setAuthor({ name: `Sistema de punições`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: "png", size: 4096 }))
            .setColor(process.env.COLOR1)
            .setFooter({ text: `${message.author.username} já baniu ${totalbanido} usuários`, iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png", size: 4096 }) })
            .setTimestamp()
            .addFields(
                {
                    name: `Usuário banido:`,
                    value: `⠀Tag: \`${membro.user.tag}\`\n⠀ID: \`${membro.id}\``,
                    inline: false
                },
                {
                    name: `Autor do banimento:`,
                    value: `⠀Tag: \`${message.author.tag}\`\n⠀ID: \`${message.author.id}\``,
                    inline: false
                },
                {
                    name: `Motivo:`,
                    value: `⠀${reason}`,
                    inline: false
                })

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Sistema de punições`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            .setColor(process.env.COLOR1)
            .setFooter({ text: `${message.author.username} já baniu ${totalbanido} usuários`, iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) })
            .setTimestamp()
            .setDescription(`Olá \`${membro.user.tag}\`, você foi banido de \`${message.guild.name}\`.`)
            .addFields(
                {
                    name: `Autor do banimento:`,
                    value: `⠀Tag: \`${message.author.tag}\`\n⠀ID: \`${message.author.id}\``,
                    inline: false
                },
                {
                    name: `Motivo:`,
                    value: `⠀${reason}`,
                    inline: false
                });



        await membro.send({ embeds: [embed] }).then(async (msg) => {
            await membrox.ban({ reason: `Autor: ${message.author.tag} | Motivo: ${reason}` }).then(async () => {
                await client.userdb.updateOne({
                    userID: message.author.id
                }, {
                    $set: {
                        "infos.bans": totalbanido,
                    }
                });
                message.reply({ embeds: [sucess] });
            }).catch(e => { message.reply({ content: `${message.author}, não foi possível banir este membro.` }) });
        }).catch(async (e) => {
            await membrox.ban({ reason: `Autor: ${message.author.tag} | Motivo: ${reason}` }).then(async () => {
                await client.userdb.updateOne({
                    userID: message.author.id
                }, {
                    $set: {
                        "infos.bans": totalbanido,
                    }
                });
                message.reply({ embeds: [sucess] });
            }).catch(e => { message.reply({ content: `${message.author}, não foi possível banir este membro.` }) });
        })

    },
};