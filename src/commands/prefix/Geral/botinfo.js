const { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
  config: {
    name: "botinfo",
    aliases: ["adyrainfo", "adyra-info"],
    description: "Saiba mais sobre mim e minhas informações detalhadas.",
    category: "geral",
    usage: null
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    const creator = client.users.cache.get(process.env.CREATOR);
    const owner = client.users.cache.get(process.env.OWNER);

    let mcount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

    let version = await require(`${process.cwd()}/package.json`, { assert: { type: "json" } })

    let x = String(parseInt(process.memoryUsage().rss / 1024 / 1024) / 512).split('.')[1].slice(0, 4)
    let ram = String(parseInt(x)).slice(0, 2) + '%'

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
          .setDescription(`Fui criada em [JavaScript](https://www.javascript.com/) utilizando [discord.js](https://discord.js.org/#/) e [MongoDB](https://discord.js.org/#/)`)
          .addFields({ name: `Meu desenvolvedor`, value: `**[Creator:](https://github.com/9azonix)** \`${creator.tag}\`\nOwner: \`${owner.tag}\``, inline: false })
          .addFields({ name: `Minhas informações`, value: `Membros: \`${abreviar(mcount)}\`\nServidores: ${inlineCode(client.guilds.cache.size.toLocaleString())}\nMemória usada: ${inlineCode(ram)}\nCriada desde: <t:${parseInt(client.user.createdTimestamp / 1000)}:d>\nTempo ativa: <t:${~~((Date.now() / 1000) - (client.uptime / 1000))}:R>\nVersão: ${inlineCode(version.version)}`, inline: false })
          .setColor(process.env.COLOR1)
          .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
          .setTimestamp()
      ], components: [
        new ActionRowBuilder()
          .addComponents(new ButtonBuilder().setLabel('Me adicione').setStyle(ButtonStyle.Link).setURL(process.env.INVITE))
          .addComponents(new ButtonBuilder().setLabel('Suporte').setStyle(ButtonStyle.Link).setURL(process.env.SUPORTE))
      ]
    })

  },
};

function abreviar(number, precision = 1) { return number.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: precision }); }