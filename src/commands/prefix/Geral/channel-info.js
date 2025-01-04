const { EmbedBuilder } = require("discord.js");
const moment = require('moment');

module.exports = {
  config: {
    name: "channel-info",
    aliases: ["channelinfo", "canal-info", "canalinfo"],
    category: "geral",
    description: 'Veja as informções de um canal.',
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;

    const canalType = {
      "15": "Forum",
      "2": "Canal de Voz",
      "0": "Canal de Texto",
      "5": "Canal de Anúncios",
      "4": "Categoria",
      "11": "Tópico",
      "12": "Tópico Privado",
      "10": "Tópico"
    }

    let topic = channel.topic ?? 'Sem descrição';

    const channelinfo = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .addFields({ name: `Nome do Canal`, value: `\`${channel.name || `${channel.parent.name}`}\``, inline: true })
      .addFields({ name: `ID do Canal`, value: `\`${channel.id}\``, inline: true })
      .addFields({ name: `Data de criação:`, value: `\`${moment(channel.createdAt).format('DD/MM/YYYY')}\``, inline: true })
      .addFields({ name: `Tipo do Canal`, value: `\`${canalType[channel.type]}\``, inline: true })
      .addFields({ name: `Posição (Por categoria)`, value: `\`${channel.position + 1}°\``, inline: true })
      .setFooter({ text: `Requisitado por: ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })

    if (channel.parent) { channelinfo.addFields({ name: `Categoria do Canal`, value: `\`${channel.parent?.name || "Sem categoria"}\``, inline: true }) }
    if (channel.topic) { channelinfo.addFields({ name: `Descrição do canal`, value: `${topic}`, inline: true }) }

    message.reply({ embeds: [channelinfo] })

  },
};
