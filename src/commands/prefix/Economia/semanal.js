const { EmbedBuilder } = require("discord.js");
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "semanal",
    aliases: null,
    description: "Resgate sua recompensa semanal com bônus de VIP.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    let userdb = await client.userdb.findOne({ userID: message.author.id });

    if (!userdb) userdb = await new client.userdb({ userID: message.author.id }).save();

    const isVIP = userdb.vip?.enabled || false;
    const vipLevel = userdb.vip?.level || 0;
    let dinheiroBase = Math.floor(Math.random() * (1500 - 1000) + 1000);
    const xpx = Math.floor(Math.random() * (20 - 25) + 20);
    let xpMultiplier = 1;
    let dinheiroBonus = 0;

    switch (vipLevel) {
      case 1:
        dinheiroBonus = 40000;
        xpMultiplier = 5; // 5x XP
        break;
      case 2:
        dinheiroBonus = 60000;
        xpMultiplier = 6; // 6x XP
        break;
      case 3:
        dinheiroBonus = 80000;
        xpMultiplier = 7; // 7x XP
        break;
      case 4:
        dinheiroBonus = 90000;
        xpMultiplier = 8; // 8x XP
        break;
      case 5:
        dinheiroBonus = 100000;
        xpMultiplier = 10; // 10x XP
        break;
      case 6:
        dinheiroBonus = 150000000; // VIP Ruby Prestige
        xpMultiplier = 15; // 15x XP
        break;
      default:
        dinheiroBonus = 0;
        xpMultiplier = 1;
    }

    const dinheiro = isVIP ? (dinheiroBase + dinheiroBonus) : dinheiroBase;
    const semanal = userdb.economia.money + dinheiro;
    const novoxp = userdb.infos.xp + (xpx * xpMultiplier);

    if (Date.now() < userdb.cooldowns.semanal) {
      return message.reply({ content: `⏳ ${message.author}, você deve esperar **${toTime(userdb.cooldowns.semanal - Date.now())}** para resgatar sua recompensa semanal novamente.` });
    }

    const colldown = Date.now() + 604800000; // 7 dias em milissegundos

    await client.userdb.updateOne({ userID: message.author.id }, { $set: { "economia.money": semanal, "cooldowns.semanal": colldown, "infos.xp": novoxp } });

    const embed = new EmbedBuilder()
      .setColor(isVIP ? "#FFD700" : "#7289DA")
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setTitle('Recompensa Semanal Resgatada!')
      .setDescription(`🪙 Você resgatou sua recompensa semanal!`)
      .addFields(
        { name: "Coins Recebidos", value: `**${toMoney(dinheiro)} coins**`, inline: true },
        { name: "XP Ganho", value: `**${xpx * xpMultiplier} XP**`, inline: true },
        { name: "Status VIP", value: isVIP ? `**Nível ${vipLevel}**` : "**Não**", inline: true }
      )
      .setFooter({ text: 'Continue coletando para se tornar mais forte!' })
      .setTimestamp();

    message.reply({ embeds: [embed] });

    VerifyUserLevel(message.author.id, message.channel);
  },
};
