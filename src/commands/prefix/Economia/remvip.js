const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`);

module.exports = {
  config: {
    name: "remvip",
    aliases: ["removervip"],
    description: "Remove o VIP de um usuário.",
    category: "economia",
    usage: "remvip [@usuario]",
  },
  permissions: "Administrator",
  owner: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) 
      return message.reply("Você não tem permissão para usar este comando!");

    const userId = args[0]?.replace(/[<@!>]/g, "");

    if (!userId) return message.reply("Uso correto: `remvip [@usuario]`");

    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    user.vip.enabled = false;
    user.vip.level = 0;
    user.vip.expiresAt = null;
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("VIP Removido")
      .setColor(process.env.COLOR1)
      .setDescription(`O VIP de <@${userId}> foi removido.`);

    return message.reply({ embeds: [embed] });
  },
};