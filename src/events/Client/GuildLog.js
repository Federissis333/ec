const { EmbedBuilder } = require("discord.js");

const client = require(`${process.cwd()}/index.js`);

module.exports = {
  name: "GuildLog"
};

client.on('guildCreate', async (guild) => {

  try {
    if (!guild || guild.available === false) return

    const channel = client.channels.cache.get(process.env.SERVERLOG);
    if (!channel) return;

    const owner = client.users.cache.get(guild.ownerId)

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Novo servidor`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .addFields({ name: `Informações`, value: `Server Name: \`${guild.name}\`\nServer ID:\`${guild.id}\`\nOwner: \`${owner.tag}\`\nOwner ID: \`${guild.ownerId}\`\nMembros: \`${guild.memberCount}\`` })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor(process.env.COLOR_GREEN)
      .setFooter({ text: `Total de ${client.guilds.cache.size} servidores` })
      .setTimestamp();
    channel.send({ embeds: [embed] }).catch(() => { })
  } catch (e) {
    console.log(e)
  }

})

client.on('guildDelete', async (guild) => {

  try {
    if (!guild || guild.available === false) return

    const channel = client.channels.cache.get(process.env.SERVERLOG);
    if (!channel) return;

    const owner = client.users.cache.get(guild.ownerId)

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Remoção`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .addFields({ name: `Informações`, value: `Server Name: \`${guild.name}\`\nServer ID:\`${guild.id}\`\nOwner: \`${owner.tag}\`\nOwner ID: \`${guild.ownerId}\`\nMembros: \`${guild.memberCount}\`` })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor(process.env.COLOR_RED)
      .setFooter({ text: `Total de ${client.guilds.cache.size} servidores` })
      .setTimestamp();
    channel.send({ embeds: [embed] }).catch(() => { })
  } catch (e) {
    console.log(e)
  }

})