const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "nuke",
    aliases: [],
    description: "Duplica o canal atual e apaga o original, mantendo as configurações e permissões.",
    category: "admin",
    usage: "nuke",
  },
  permissions: null,
  owner: false,
  run: async (client, message) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply("Você não tem permissão para usar este comando!");

    const channel = message.channel;

    const newChannel = await channel.clone({
      reason: `Nuke realizado por ${message.author.tag}`,
    });

    await channel.delete();

    newChannel.setPosition(channel.rawPosition); // Manter a mesma posição no canal

    const embed = new EmbedBuilder()
      .setTitle("Canal Nukado com Sucesso!")
      .setColor(process.env.COLOR1)
      .setDescription(`O canal ${channel.name} foi duplicado e o original apagado.\nNovo canal: ${newChannel}`);

    return message.reply({ embeds: [embed] });
  },
};