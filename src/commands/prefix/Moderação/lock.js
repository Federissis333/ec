const { PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "lock",
    aliases: null,
    description: "Tranque um chat.",
    category: "moderação",
    usage: "lock [canal]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Gerenciar Canais** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Gerenciar Canais** para executar esta função.`, ephemeral: true });

    let canal = message.mentions.channels.first() || await message.guild.channels.cache.find((x) => x.id == args[0]) || message.channel;
    let erro = false;

    await canal.permissionOverwrites.edit(message.guild.id, { SendMessages: false }).catch(e => { erro = true })

    if (erro === true) { message.reply({ content: `${message.author}, não foi possivel trancar o canal.` }) } else { message.reply({ content: `${message.author}, o canal ${canal} foi trancado com sucesso.` }) }

  },
};