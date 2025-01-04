const { PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "renomearcanal",
    aliases: null,
    description: "Renomie um chat.",
    category: "moderação",
    usage: "renomearcanal [nome]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let guilddb = await client.guilddb.findOne({ IDs: message.guild.id }) || { prefix: process.env.PREFIX }
    let prefix = guilddb.prefix

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Administrador** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Administrador** para executar esta função.`, ephemeral: true });

    let canal = message.mentions.channels.first() || await message.guild.channels.cache.find((x) => x.id == args[0]);
    let nome = args.slice(1).join(" ");
    let erro = false;

    if (!canal) return message.reply({ content: `${message.author}, é preciso mencionar um canal. Ex: ${prefix}renomearcanal <#canal> [nome]` })
    if (!nome) return message.reply({ content: `${message.author}, é preciso informar o nome para o canal. Ex: ${prefix}renomearcanal <#canal> [nome]` })

    if (nome.length > 100) return message.reply({ content: `${message.author}, o nome inserido é muito grande, o limite de caracteres é de **100**.` })

    await canal.setName(nome).catch(e => { erro = true })

    if (erro === true) { message.reply({ content: `${message.author}, não foi possivel renomear o canal.` }) } else { message.reply({ content: `${message.author}, o canal ${canal} foi renomeado para \`${nome}\` com sucesso.` }) }

  },
};