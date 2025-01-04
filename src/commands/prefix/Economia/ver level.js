const { EmbedBuilder } = require('discord.js');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "ver level",
    aliases: ["nivel", "xp"],
    description: "Veja o level de um usuário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = client.users.cache.get(args[1]) || message.mentions.users.first() || message.author;

    const user = await client.userdb.findOne({ userID: membro.id }) || { economia: { ruby: 0, banco: 0, money: 0, sujo: 0, sobremim: `null`, marry: { casado: false, user: null, time: 0 } }, icon: null, color: null, emblemas: {}, infos: { xp: 0, level: 0, rep: 0 } }

    let getLevelfromDB = user.infos.level ?? 0;
    let requiredXp = getLevelfromDB * 2 * 250 + 250;

    const embed = new EmbedBuilder()
      .setThumbnail(membro.displayAvatarURL({ dynamic: true, display: true, size: 4096 }))
      .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true, display: true, size: 4096 }) })
      .setColor(`${user.color == null ? process.env.COLOR1 : user.color}`)
      .setTimestamp()
      .setDescription(`Level: \`${user.infos.level == null ? `0` : `${user.infos.level.toLocaleString()}`}\`\nXP: \`${user.infos.xp == null ? `0/${requiredXp}` : `\`${user.infos.xp}/${requiredXp}\``}\``)

    if (user.icon === null) { embed.setAuthor({ name: `Level de ${membro.tag}`, iconURL: process.env.ICON_PRIMARY }) } else { embed.setAuthor({ name: `Level de ${membro.tag}`, iconURL: user.icon }) }
    message.reply({ embeds: [embed] })

  },
};