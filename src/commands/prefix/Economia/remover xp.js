const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "removexp",
    aliases: ["removexp"],
    description: "Remove o XP de um usuário manualmente.",
    category: "economia",
    usage: "removexp [@usuario] [quantidade]",
  },
  permissions: "Administrator", // Permissão necessária para alterar XP
  owner: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Você não tem permissão para usar este comando!");

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const xpAmount = parseInt(args[1]);

    if (!userId || isNaN(xpAmount)) {
      return message.reply("Uso correto: `removexp [@usuario] [quantidade]`");
    }

    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    // Remove o XP especificado
    user.infos.xp = Math.max(0, user.infos.xp - xpAmount); // Não permite XP negativo
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("XP Removido")
      .setColor(process.env.COLOR1)
      .setDescription(`O XP de <@${userId}> foi reduzido em ${xpAmount} e agora está em ${user.infos.xp}.`);

    return message.reply({ embeds: [embed] });
  },
};