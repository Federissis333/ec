const { EmbedBuilder } = require("discord.js");
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "daily",
    aliases: ["diária", "diaria"],
    description: "Resgate sua recompensa diária com bônus de VIP.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    let userdb = await client.userdb.findOne({ userID: message.author.id });
    if (!userdb) userdb = await new client.userdb({ userID: message.author.id }).save();

    // Atualizar o contador de mensagens
    userdb.economia.mensagensDiarias = (userdb.economia.mensagensDiarias || 0) + 1;

    const isVIP = userdb.vip?.enabled || false;
    const vipLevel = userdb.vip?.level || 0;
    let dinheiroBase = Math.floor(Math.random() * (750 - 500) + 500);
    const xpx = Math.floor(Math.random() * (20 - 25) + 20);
    let xpMultiplier = 1;

    // Definir os bônus de VIP de acordo com o nível
    let dinheiroBonus = 0;
    let xpBonus = 0;

    switch (vipLevel) {
      case 1:
        dinheiroBonus = 25000;
        xpMultiplier = 5; // 5x XP
        break;
      case 2:
        dinheiroBonus = 30000;
        xpMultiplier = 6; // 6x XP
        break;
      case 3:
        dinheiroBonus = 35000;
        xpMultiplier = 7; // 7x XP
        break;
      case 4:
        dinheiroBonus = 40000;
        xpMultiplier = 8; // 8x XP
        break;
      case 5:
        dinheiroBonus = 50000;
        xpMultiplier = 10; // 10x XP
        break;
      case 6:
        dinheiroBonus = 10000000; // VIP Ruby Prestige
        xpMultiplier = 15; // 15x XP
        break;
      default:
        dinheiroBonus = 0;
        xpMultiplier = 1;
    }

    // Adicionar bônus de VIP ao dinheiro
    const dinheiro = isVIP ? (dinheiroBase + dinheiroBonus) : dinheiroBase;

    if (Date.now() < userdb.cooldowns.daily) {
      return message.reply({ content: `⏳ ${message.author}, você deve esperar **${toTime(userdb.cooldowns.daily - Date.now())}** para resgatar sua recompensa diária novamente.` });
    }

    const novodaily = userdb.economia.money + dinheiro;
    const novoxp = userdb.infos.xp + xpx * xpMultiplier + userdb.economia.mensagensDiarias; // Adiciona o bônus de XP por mensagens
    const colldown = Date.now() + 86400000; // 1 dia em milissegundos

    await client.userdb.updateOne({ userID: message.author.id }, { $set: { "economia.money": novodaily, "cooldowns.daily": colldown, "infos.xp": novoxp, "economia.mensagensDiarias": userdb.economia.mensagensDiarias } });

    const embed = new EmbedBuilder()
      .setColor(isVIP ? "#FFD700" : "#7289DA")
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setTitle('Recompensa Diária Resgatada!')
      .setDescription(`🪙 Você resgatou sua recompensa diária!`)
      .addFields(
        { name: "Coins Recebidos", value: `**${toMoney(dinheiro)} coins**`, inline: true },
        { name: "XP Ganho", value: `**${xpx * xpMultiplier} XP** + **${userdb.economia.mensagensDiarias}** XP de mensagens`, inline: true },
        { name: "Status VIP", value: isVIP ? `**Nível ${vipLevel}**` : "**Não**", inline: true }
      )
      .setFooter({ text: 'Continue coletando para se tornar mais forte!' })
      .setTimestamp();

    message.reply({ embeds: [embed] });

    VerifyUserLevel(message.author.id, message.channel);
  },
};
