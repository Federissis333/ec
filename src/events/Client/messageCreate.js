const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require(`${process.cwd()}/index.js`);
const chalk = require('chalk');
const ccmd = chalk.hex('#00ffcb');
const cred = chalk.hex('#ff0000');

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {
  if (message?.author?.bot) return;
  if (!message?.guild) return;

  let guilddb = await client.guilddb.findOne({ IDs: message.guild.id }) || { prefix: process.env.PREFIX }
  let prefix = guilddb.prefix

  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(mention)) {
    message.react('💜');

    let argsaznx = message.content.toLowerCase().slice(client.user.id).trim().split(/ +/g);
    let conteudomenção = '';
    if (!argsaznx.slice(0).join(" ")) { conteudomenção = 'Nenhum argumento'; } else { conteudomenção = argsaznx.slice(0).join(" "); }

    logm('Menção', `${message.author.tag}`, `${message.author.id}`, `${message.guild.name}`, `${message.guild.id}`, `${conteudomenção}`, message)

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setDescription(`Olá \`${message.author.tag}\`, meu prefixo neste servidor é \`${prefix}\`\nUtilize \`${prefix}ajuda\` para mais informações.`)

    message.reply({ embeds: [embed] })

  };

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  const cmdName = cmd
  if (cmd.length == 0) return;
  let conteudo = '';
  if (!args.slice(0).join(" ")) { conteudo = 'Nenhum argumento'; } else { conteudo = args.slice(0).join(" "); }

  let command = client.prefix_commands.get(cmd) || client.prefix_commands.find((cmd) => cmd.config.aliases && cmd.config.aliases.includes(cmdName));

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`🚫 Você não está autorizado de usar este comando.`)
            .setColor("Red")
        ]
      })
    };

    if (command.owner, command.owner == true) {
      if (process.env.CREATOR) {

        if (!message.member.id.includes(process.env.CREATOR)) return message.reply({
          content: `${message.author}, somente meu criador pode executar este comando.`
        })
      }
    };

    try {
      command.run(client, message, args, prefix);
      log('Prefix', `${cmd}`, `${message.author.tag}`, `${message.author.id}`, `${message.guild.name}`, `${message.guild.id}`, conteudo, message)
    } catch (error) {
      console.error(error);
      logf('Prefix', `${cmd}`, `${message.author.tag}`, `${message.author.id}`, `${message.guild.name}`, `${message.guild.id}`, conteudo, message)
    };

    if (message.content.toLowerCase().includes(client.user.id)) {
      message.react('💜')

      logm('Menção', `${message.author.tag}`, `${message.author.id}`, `${message.guild.name}`, `${message.guild.id}`, conteudo, message)

    }

  }
});

function log(type, command, authortag, authorid, servername, serverid, conteudo, message) {
  console.log(`[${ccmd('Command Manager')}, ${ccmd(type)}]: ${command} | ${authortag} (${authorid}) | ${servername} (${serverid})`)

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username}: ${type} Command`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
    .setColor(process.env.COLOR1)
    .setThumbnail(process.env.LOGO)
    .setDescription(`Command: \`${command}\`\nContent: \`${conteudo}\`\nAuthor: \`${authortag} (${authorid})\`\nServer: \`${servername} (${serverid})\``)
    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ display: true, size: 4096 })}` })
    .setTimestamp()

  client.channels.cache.get(process.env.CMDLOG).send({ embeds: [embed] })
}

function logf(type, command, authortag, authorid, servername, serverid, conteudo, message) {
  console.log(`[${cred('Command Manager')}, ${cred(type)}]: ${command} | ${authortag} (${authorid}) | ${servername} (${serverid})`)

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username}: ${type} Command`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
    .setColor('#ff0000')
    .setThumbnail(process.env.LOGO)
    .setDescription(`Command: \`${command}\`\nContent: \`${conteudo}\`\nAuthor: \`${authortag} (${authorid})\`\nServer: \`${servername} (${serverid})\``)
    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ display: true, size: 4096 })}` })
    .setTimestamp()

  client.channels.cache.get(process.env.CMDLOG).send({ embeds: [embed] })
}

function logm(type, authortag, authorid, servername, serverid, conteudo, message) {
  console.log(`[${ccmd('Command Manager')}, ${ccmd(type)}]: ${authortag} (${authorid}) | ${servername} (${serverid})`)

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username}: ${type} Command`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
    .setColor(process.env.COLOR1)
    .setThumbnail(process.env.LOGO)
    .setDescription(`${type}\nContent: \`${conteudo}\`\nAuthor: \`${authortag} (${authorid})\`\nServer: \`${servername} (${serverid})\``)
    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ display: true, size: 4096 })}` })
    .setTimestamp()

  client.channels.cache.get(process.env.CMDLOG).send({ embeds: [embed] })
}