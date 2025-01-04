const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "setvip",
    aliases: ["vip"],
    description: "Define o nível de VIP e a duração para um usuário.",
    category: "economia",
    usage: "setvip [@usuario] [nível] [dias]",
  },
  permissions: "Administrator", // Permissão necessária para alterar VIP
  owner: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Você não tem permissão para usar este comando!");

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const vipLevel = parseInt(args[1]);
    const vipDays = parseInt(args[2]);

    if (!userId || isNaN(vipLevel) || isNaN(vipDays)) {
      return message.reply("Uso correto: `setvip [@usuario] [nível] [dias]`");
    }

    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    user.vip.level = vipLevel;
    user.vip.expiresAt = new Date(Date.now() + vipDays * 24 * 60 * 60 * 1000); // Expiração em dias
    user.vip.enabled = true;
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("VIP Atualizado")
      .setColor(process.env.COLOR1)
      .setDescription(`O nível de VIP de <@${userId}> foi definido como **${vipLevel}** por **${vipDays} dias**.`);

    return message.reply({ embeds: [embed] });
  },
};
