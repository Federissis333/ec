const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "unban",
    aliases: ["desbanir"],
    description: "Remova o ban um usuário do servidor.",
    category: "moderação",
    usage: "unban [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = args[0];

    if (!membro) return message.reply({ content: `${message.author}, você precisa informar um usário que você deseja desbanir.` });

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Banir Membros** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Banir Membros** para executar esta função.`, ephemeral: true });


    const motivo = `Autor: ${message.author} | ${message.author.id}`

    message.guild.members.unban(membro, motivo).then(() => {
      message.reply({ content: `${message.author.tag}, \`${membro}\` foi desbanido com sucesso.` });
    }).catch(async (e) => { message.reply({ content: `${message.author}, não foi possivel desbanir o usuário.` }); })

  },
};