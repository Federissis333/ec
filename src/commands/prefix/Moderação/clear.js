const { PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "clear",
    aliases: null,
    description: "Limpe as mensagens de um chat.",
    category: "moderação",
    usage: "clear [quantidade]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Gerenciar Mensagens** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Gerenciar Mensagens** para executar esta função.`, ephemeral: true });

    let quantidade = args[0]

    if (!quantidade) return message.reply({ content: `${message.author}, é preciso informar a quantidade de mensagens que deve ser deletadas.` });

    if (isNaN(quantidade)) return message.reply({ content: `${message.author}, é preciso informar a quantidade de mensagens que deve ser deletadas.` });

    quantidade = Number(quantidade) + 1;

    if (quantidade > 1) quantidade = 100;

    let msgs = await message.channel.messages.fetch({ limit: quantidade });

    message.channel.bulkDelete(msgs).then((x) => message.channel.send({ content: `${message.author}, foram \`${msgs.size - 1}\` mensagens apagadas.` }));

  },
};