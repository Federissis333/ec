const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
  config: {
    name: "criarcanal",
    aliases: null,
    description: "Crie um chat.",
    category: "moderação",
    usage: "criarcanal [nome]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Administrador** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Administrador** para executar esta função.`, ephemeral: true });

    let nome = args.slice(0).join(" ");

    if (!nome) return message.reply({ content: `${message.author}, é preciso informar um nome para o canal.` })

    if (nome.length > 100) return message.reply({ content: `${message.author}, o nome inserido é muito grande, o limite de caracteres é de **100**.` })

    let erro = false;

    const canal = await message.guild.channels.create({
      name: nome,
      type: ChannelType.GuildText
    }).catch(e => { erro = true })

    if (erro === true) { message.reply({ content: `${message.author}, não foi possivel criar o canal.` }) } else { message.reply({ content: `${message.author}, o canal ${canal} foi criado com sucesso.` }) }

  },
};