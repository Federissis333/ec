const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "work",
    aliases: ["trabalhar"],
    description: "Realiza trabalho e recebe coins e XP.",
    category: "economia",
    usage: "work",
  },
  permissions: null,
  run: async (client, message, args) => {
    const userId = message.author.id;
    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Você não está registrado no sistema!");

    const now = Date.now();
    const cooldown = user.cooldowns.work || 0;

    if (cooldown > now) {
      const timeLeft = Math.ceil((cooldown - now) / 1000);
      return message.reply(`Você precisa esperar mais ${timeLeft} segundos para trabalhar novamente.`);
    }

    const baseMoney = 2000; // Recompensa base
    const baseXP = 153; // XP base

    let vipBonus = 0;
    if (user.vip.enabled) {
      vipBonus = calculateVipReward(user.vip.level);
    }

    const totalMoney = baseMoney + vipBonus;
    const totalXP = baseXP + vipBonus;

    user.money += totalMoney;
    user.infos.xp += totalXP;
    user.cooldowns.work = now + 3600000; // 1 hora de cooldown
    await user.save();

    const vipText = user.vip.enabled
      ? `${user.vip.level}**.0** (VIP ${user.vip.level}.0) +${vipBonus.toLocaleString()} coins e +${vipBonus} XP!`
      : "Sem bônus VIP.";

    const embed = new EmbedBuilder()
      .setTitle("Você trabalhou e recebeu:")
      .setColor(process.env.COLOR1)
      .setDescription(
        `💰 **${baseMoney.toLocaleString()} coins** + **${baseXP} XP**\n${vipText}\n\nSabia que agora você pode apostar? Use \`!apostar\`!`
      )
      .setThumbnail("https://i.imgur.com/2U8UI3j.png"); // Thumbnail da imagem de trabalho

    return message.reply({ embeds: [embed] });
  },
};

// Função para calcular a recompensa de VIP
const calculateVipReward = (vipLevel) => {
  const rewards = {
    1: 25000,
    2: 50000,
    3: 75000,
    4: 100000,
    5: 125000,
    6: 9000000, // Pink Star
  };
  return rewards[vipLevel] || 0;
};
