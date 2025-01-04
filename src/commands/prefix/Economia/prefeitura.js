const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  config: {
    name: "prefeitura",
    aliases: ["gov", "administração"],
    description: "Interaja com a prefeitura para adquirir licenças e serviços.",
    category: "economia",
  },
  permissions: null,
  owner: false,

  run: async (client, message, args) => {
    // Embed inicial da Prefeitura
    const embed = new EmbedBuilder()
      .setTitle("Prefeitura")
      .setDescription("Bem-vindo à Prefeitura! Aqui você pode:\n\n**1.** Comprar Licença\n\nSelecione a opção abaixo.")
      .setColor("Blue");

    // Botão para abrir a interação de comprar licença
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("comprar_licenca")
        .setLabel("Comprar Licença")
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await message.reply({ embeds: [embed], components: [buttons] });

    // Criação do coletor para interagir com os botões
    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "comprar_licenca") {
        // Criação do modal
        const modal = new ModalBuilder()
          .setCustomId("modal_comprar_licenca")
          .setTitle("Comprar Licença");

        const input = new TextInputBuilder()
          .setCustomId("input_licenca")
          .setLabel("Digite o valor (500 coins):")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const modalRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(modalRow);

        await interaction.showModal(modal);
      }
    });

    collector.on("end", () => {
      buttons.components.forEach((button) => button.setDisabled(true));
      msg.edit({ components: [buttons] });
    });
  },
};
