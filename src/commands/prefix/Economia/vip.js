const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB
const moment = require("moment"); // Biblioteca para manipular datas
require("moment-duration-format"); // Plugin para formatar duração

module.exports = {
  config: {
    name: "vip",
    aliases: ["vipstatus"],
    description: "Veja seu status VIP.",
    category: "economia",
    usage: "vip",
  },
  permissions: null,
  owner: false,
  run: async (client, message) => {
    const userId = message.author.id;

    // Buscar informações do usuário na DB
    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    // Dados do VIP do usuário
    const vipStatus = user.vip.enabled;
    const vipLevel = user.vip.level || 0;
    const vipExpiresAt = user.vip.expiresAt;

    // Emojis personalizados para cada nível de VIP
    const vipEmojis = {
      0: "❌", // Sem VIP
      1: "🥉", // VIP Bronze
      2: "🥈", // VIP Prata
      3: "🥇", // VIP Ouro
      4: "💎", // VIP Diamante
      5: "👑", // VIP Platina
      6: "🔥", // VIP Supremo
    };

    // Verificar se o usuário tem VIP ativo
    if (!vipStatus) {
      const embedNoVip = new EmbedBuilder()
        .setTitle("Status VIP")
        .setColor("#FF0000")
        .setDescription(`**Usuário:** <@${userId}>\n**Status:** ❌ Você não possui VIP ativo.`);

      return message.reply({ embeds: [embedNoVip] });
    }

    // Calcular tempo restante
    const now = new Date();
    const expiresAt = new Date(vipExpiresAt);
    const remainingTime = expiresAt - now;

    const formattedTime =
      remainingTime > 0
        ? moment.duration(remainingTime).format("D [dias], H [horas], m [minutos]")
        : "Expirado";

    // Criar embed para exibir status VIP
    const embedVip = new EmbedBuilder()
      .setTitle("Status VIP")
      .setColor("#FFD700")
      .setDescription(
        `**Usuário:** <@${userId}>\n**Status:** ${vipEmojis[vipLevel]} VIP Ativo\n**Nível:** ${vipLevel}\n**Expira em:** ${formattedTime}`
      );

    return message.reply({ embeds: [embedVip] });
  },
};