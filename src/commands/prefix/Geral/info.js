const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "info",
    aliases: null,
    description: "Veja as informações sobre um comando.",
    category: "geral",
    usage: "info [command]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!args[0]) return message.reply({ content: `${message.author} você precisa informar o nome de um comando.` });

    const command = client.prefix_commands.get(args[0].toLowerCase()) || client.prefix_commands.find((cmd) => cmd.config.aliases && cmd.config.aliases.includes(args[0].toLowerCase()));

    if (!command) return message.reply({ content: `${message.author} este comando não existe.` });

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO)
      .setTitle(`Comando: ${command.config.name.toUpperCase()}`)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()
      .addFields({ name: 'Descrição:', value: `\`${command.config.description}\`` || "`Nenhuma descrição informada.`" })


    let modo = "";
    if (command.config.usage === undefined) { modo = "Nenhum modo de usar informado." } else if (command.config.usage === null) { modo = "Nenhum modo de usar informado." } else { modo = command.config.usage }
    embed.addFields({ name: 'Modo de Usar:', value: `\`${modo}\`` })

    let aliases = "";
    if (command.config.aliases === undefined) { aliases = "Não foi encontrado nenhuma aliases." } else if (command.config.aliases === null) { aliases = "Não foi encontrado nenhuma aliases." } else { aliases = command.config.aliases.join(", ") }

    embed.addFields({ name: 'Aliases:', value: `\`${aliases}\`` })

    let perms = "";
    if (command.permissions === undefined) { perms = "Este comando não requer nenhuma permissão." } else if (command.permissions === null) { perms = "Este comando não requer nenhuma permissão." } else { perms = command.permissions.join(", ") }

    embed.addFields({ name: 'Permissões:', value: `\`${perms}\`` })
    embed.addFields({ name: 'Exclusivo dos Desenvolvedores:', value: command.owner ? '`Sim`' : '`Não`' })

    return message.reply({ embeds: [embed] });

  },
};
