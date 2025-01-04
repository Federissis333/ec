const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB
const { economiaEmoji, infosEmoji, cooldownsEmoji, vipEmoji, allEmoji } = require(`${process.cwd()}/src/structures/Emoji`);

module.exports = {
  config: {
    name: "resetall",
    aliases: ["reset-tudo"],
    description: "Reseta informações dos usuários com confirmação e permite escolher quais dados serão resetados usando botões.",
    category: "admin",
    usage: "resetall",
  },
  permissions: null,
  owner: true, // Apenas o dono do bot pode usar
  run: async (client, message, args) => {
    if (message.author.id !== process.env.OWNER) 
      return message.reply("Apenas o dono do bot pode usar este comando!");

    const options = ["infos", "cooldowns", "vip", "economia", "all"];
    const embed = new EmbedBuilder()
      .setTitle("Escolha o que deseja resetar")
      .setColor(process.env.COLOR1)
      .setDescription("Por favor, selecione o tipo de reset que você deseja:")
      .addFields(
        { name: `${infosEmoji} Informações`, value: "Resetar apenas Informações" },
        { name: `${cooldownsEmoji} Cooldowns`, value: "Resetar apenas Cooldowns" },
        { name: `${vipEmoji} VIPs`, value: "Resetar apenas VIPs" },
        { name: `${economiaEmoji} Economia`, value: "Resetar apenas Economia" },
        { name: `${allEmoji} Tudo`, value: "Resetar Tudo (Informações + Cooldowns + Economia)" }
      );

    const buttons = [
      { label: "Informações", customId: "infos", style: "Primary" },
      { label: "Cooldowns", customId: "cooldowns", style: "Primary" },
      { label: "VIPs", customId: "vip", style: "Primary" },
      { label: "Economia", customId: "economia", style: "Primary" },
      { label: "Tudo", customId: "all", style: "Primary" }
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
        case "infos":
          updateFields = {
            "infos.xp": 0,
            "infos.level": 0,
            "infos.rep": 0,
          };
          break;

        case "cooldowns":
          updateFields = {
            "cooldowns.daily": 0,
            "cooldowns.work": 0,
            "cooldowns.mensal": 0,
            "cooldowns.semanal": 0,
          };
          break;

        case "vip":
          updateFields = {
            "economia.vip.enabled": false,
            "economia.vip.expiresAt": null, // Resetar VIP
          };
          break;

        case "economia":
          updateFields = {
            "economia.money": 0,
            "economia.banco": 0,
          };
          break;

        case "all":
          updateFields = {
            "infos.xp": 0,
            "infos.level": 0,
            "infos.rep": 0,
            "cooldowns.daily": 0,
            "cooldowns.work": 0,
            "cooldowns.mensal": 0,
            "cooldowns.semanal": 0,
            "economia.money": 0,
            "economia.banco": 0,
          };
          break;
      }

      await User.updateMany({}, updateFields);

      const confirmationEmbed = new EmbedBuilder()
        .setTitle("Informações Resetadas")
        .setColor(process.env.COLOR1)
        .setDescription(`As informações \`${i.customId}\` de todos os usuários foram resetadas com sucesso!`);

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