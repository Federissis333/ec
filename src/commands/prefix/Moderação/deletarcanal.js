const { PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "deletarcanal",
    aliases: null,
    description: "Delete um chat.",
    category: "moderação",
    usage: "deletarcanal [nome]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Administrador** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Administrador** para executar esta função.`, ephemeral: true });

    let canal = message.mentions.channels.first() || await message.guild.channels.cache.find((x) => x.id == args[0]);
    let erro = false;

    if (!canal) return message.reply({ content: `${message.author}, é preciso mencionar um canal.` })

    await canal.delete().catch(e => { erro = true })

    if (erro === true) { message.reply({ content: `${message.author}, não foi possivel deletar o canal.` }) } else { message.reply({ content: `${message.author}, o canal \`${canal.name}\` foi deletado com sucesso.` }) }

  },
};