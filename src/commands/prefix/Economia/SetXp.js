const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "setxp",
    aliases: ["addxp"],
    description: "Configure o XP de um usuário manualmente.",
    category: "economia",
    usage: "setxp [@usuario] [quantidade]",
  },
  permissions: "Administrator", // Permissão necessária para alterar XP
  owner: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Você não tem permissão para usar este comando!");

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const xpAmount = parseInt(args[1]);

    if (!userId || isNaN(xpAmount)) {
      return message.reply("Uso correto: `setxp [@usuario] [quantidade]`");
    }

    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    user.infos.xp = xpAmount; // Atualiza o XP manualmente
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("XP Atualizado")
      .setColor(process.env.COLOR1)
      .setDescription(`O XP de <@${userId}> foi atualizado para ${xpAmount}.`);

    return message.reply({ embeds: [embed] });
  },
};
