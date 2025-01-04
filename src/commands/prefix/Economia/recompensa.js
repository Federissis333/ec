const { EmbedBuilder } = require("discord.js");
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "recompensa",
    aliases: ["recompensa-vip"],
    description: "Resgate sua recompensa VIP a cada 15 dias.",
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
    let coinsBonus = 0;

    switch (vipLevel) {
      case 1:
        coinsBonus = 500000; // 500k coins a cada 15 dias
        break;
      case 2:
        coinsBonus = 1000000; // 1M coins a cada 15 dias
        break;
      case 3:
        coinsBonus = 1500000; // 1.5M coins a cada 15 dias
        break;
      case 4:
        coinsBonus = 2000000; // 2M coins a cada 15 dias
        break;
      case 5:
        coinsBonus = 3000000; // 3M coins a cada 15 dias
        break;
      case 6:
        coinsBonus = 60000000; // 60M coins a cada 15 dias (VIP Ruby Prestige)
        break;
      default:
        return message.reply({ content: "Você não tem acesso a esta recompensa VIP." });
    }

    if (Date.now() < userdb.cooldowns.recompensa) {
      return message.reply({ content: `⏳ ${message.author}, você deve esperar **${toTime(userdb.cooldowns.recompensa - Date.now())}** para resgatar sua recompensa VIP novamente.` });
    }

    const novaMoney = userdb.economia.money + coinsBonus;
    const colldown = Date.now() + 1296000000; // 15 dias em milissegundos

    await client.userdb.updateOne({ userID: message.author.id }, { $set: { "economia.money": novaMoney, "cooldowns.recompensa": colldown } });

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setTitle('Recompensa VIP Resgatada!')
      .setDescription(`🪙 Você resgatou sua recompensa VIP!`)
      .addFields(
        { name: "Coins Recebidos", value: `**${toMoney(coinsBonus)} coins**`, inline: true },
        { name: "Status VIP", value: `**Nível ${vipLevel}**`, inline: true }
      )
      .setFooter({ text: 'Continue aproveitando as vantagens de ser VIP!' })
      .setTimestamp();

    message.reply({ embeds: [embed] });

    VerifyUserLevel(message.author.id, message.channel);
  },
};