const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB
const { economiaEmoji, infosEmoji, vipEmoji, allEmoji } = require(`${process.cwd()}/src/structures/Emoji`);

module.exports = {
  config: {
    name: "reset",
    aliases: ["resetar"],
    description: "Reseta informações específicas do usuário (dinheiro, nível, rep, VIP) usando botões.",
    category: "admin",
    usage: "reset [@usuario]",
  },
  permissions: null, // Permissão necessária para utilizar o comando
  owner: true,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("Administrador")) 
      return message.reply("Você não tem permissão para usar este comando!");

    const userId = args[0]?.replace(/[<@!>]/g, "");
    if (!userId) return message.reply("Uso correto: `reset [@usuario]`");

    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    const options = ["dinheiro", "nivel", "rep", "vip", "tudo"];

    const embed = new EmbedBuilder()
      .setTitle("Escolha o que deseja resetar")
      .setColor(process.env.COLOR1)
      .setDescription("Por favor, selecione o tipo de reset que você deseja:")
      .addFields(
        { name: `${economiaEmoji} Dinheiro`, value: "Resetar apenas Dinheiro e Banco" },
        { name: `${infosEmoji} Nível`, value: "Resetar apenas Nível, XP e Reputação" },
        { name: `${vipEmoji} VIP`, value: "Resetar apenas VIPs" },
        { name: `${allEmoji} Tudo`, value: "Resetar tudo (Dinheiro + Nível + VIP)" }
      );

    const buttons = [
      { label: "Dinheiro", customId: "dinheiro", style: "Primary" },
      { label: "Nível", customId: "nivel", style: "Primary" },
      { label: "VIP", customId: "vip", style: "Primary" },
      { label: "Tudo", customId: "tudo", style: "Primary" }
    ];

    const row = new ActionRowBuilder()
      .addComponents(
        buttons.map(b => new ButtonBuilder().setLabel(b.label).setCustomId(b.customId).setStyle(b.style))
      );

    const sentMessage = await message.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = i => i.customId && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async i => {
      await i.deferUpdate(); // Deferir para editar a resposta com base no botão

      if (!options.includes(i.customId)) return;

      let updateFields = {};

      switch (i.customId) {
        case "dinheiro":
          updateFields = {
            "economia.money": 0,
            "economia.banco": 0,
          };
          break;

        case "nivel":
          updateFields = {
            "infos.xp": 0,
            "infos.level": 0,
            "infos.rep": 0,
          };
          break;

        case "vip":
          updateFields = {
            "economia.vip.enabled": false,
            "economia.vip.expiresAt": null, // Resetar VIP
          };
          break;

        case "tudo":
          updateFields = {
            "economia.money": 0,
            "economia.banco": 0,
            "infos.xp": 0,
            "infos.level": 0,
            "infos.rep": 0,
            "economia.vip.enabled": false,
            "economia.vip.expiresAt": null, // Resetar VIP
          };
          break;
      }

      await User.updateOne({ userID: userId }, updateFields);

      const confirmationEmbed = new EmbedBuilder()
        .setTitle("Informações Resetadas")
        .setColor(process.env.COLOR1)
        .setDescription(`As informações \`${i.customId}\` de <@${userId}> foram resetadas com sucesso!`);

      await i.editReply({ embeds: [confirmationEmbed], components: [] });
      collector.stop();
    });

    collector.on("end", collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("Tempo Expirado")
          .setColor(process.env.COLOR1)
          .setDescription("O tempo para confirmação expirou. O reset não foi realizado.");
        message.edit({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};
