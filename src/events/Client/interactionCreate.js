const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const client = require(`${process.cwd()}/index.js`);

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction) => {
  // Caso seja uma interação de comandos de barra (/)
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.run(client, interaction);
    } catch (err) {
      console.error(`Erro no comando: ${interaction.commandName}`);
      console.error(err);
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Erro!")
        .setDescription("Ocorreu um erro ao executar este comando. Tente novamente mais tarde.");
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  // Caso seja uma interação com modals
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal_comprar_licenca") {
      const licencaValor = 500; // Valor fixo da licença

      // Verificar saldo do usuário
      const userdb = await client.userdb.findOne({ userID: interaction.user.id });
      if (userdb.economia.money < licencaValor) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Saldo Insuficiente")
          .setDescription("Você não tem dinheiro suficiente para comprar a licença!");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Atualizar banco de dados
      await client.userdb.updateOne(
        { userID: interaction.user.id },
        { $inc: { "economia.money": -licencaValor }, $set: { "economia.licenca": true } }
      );

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Licença Comprada")
        .setDescription("Parabéns! Agora você possui uma licença válida.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  // Caso seja uma interação com botões
  if (interaction.isButton()) {
    if (interaction.customId === "comprar_licenca") {
      const modal = new ModalBuilder()
        .setCustomId("modal_comprar_licenca")
        .setTitle("Compra de Licença");

      const input = new TextInputBuilder()
        .setCustomId("valor_licenca")
        .setLabel("O valor da licença é de 500 coins.")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const actionRow = new ActionRowBuilder().addComponents(input);
      modal.addComponents(actionRow);

      return await interaction.showModal(modal);
    }
  }

  // Caso seja um comando de prefixo com subcomando
  if (interaction.isCommand()) {
    const [command, subcommand] = interaction.commandName.split(" ");

    if (command === "prefeitura") {
      if (subcommand === "comprar_licenca") {
        // Exibir o modal de compra de licença
        const modal = new ModalBuilder()
          .setCustomId("modal_comprar_licenca")
          .setTitle("Compra de Licença");

        const input = new TextInputBuilder()
          .setCustomId("input_licenca")
          .setLabel("Confirme a compra de sua licença (500 coins)")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
      }
    }
  }
});

// Função para gerar uma resposta padronizada em embed
function embedResposta(titulo, descricao, cor = "#0099FF") {
  return new EmbedBuilder().setTitle(titulo).setDescription(descricao).setColor(cor);
}
