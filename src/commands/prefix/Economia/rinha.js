const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Ajuste o caminho para o arquivo onde está o schema do User
const { rinhaEmoji, vencedorEmoji, dinheiroEmoji } = require(`${process.cwd()}/src/structures/Emoji`);

module.exports = {
  config: {
    name: "rinha",
    aliases: ["duelo", "emoji-rinha"],
    description: "Participe de uma rinha de emojis com aposta!",
    category: "diversao",
    usage: "rinha <valor>",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const minPrice = 1000000; // Valor mínimo para participar da rinha
    const maxPrice = 50000000; // Valor máximo para participar da rinha
    const maxParticipants = 8; // Limite de participantes
    const duration = 60000; // Tempo de duração (60 segundos)
    let participants = [];

    // Verifica se o usuário forneceu um valor
    const priceArg = args[0];
    if (!priceArg || !/^\d+[M|m]$/.test(priceArg)) {
      return message.reply({ content: `Por favor, insira um valor válido (exemplo: \`!rinha 1M\` ou \`!rinha 10M\`).`, ephemeral: true });
    }

    const price = parseInt(priceArg.replace(/[M|m]/g, "")) * 1000000; // Remove "M" e converte para número em moeda

    // Verifica se o preço é válido
    if (price < minPrice || price > maxPrice) {
      return message.reply({ content: `O valor deve estar entre ${minPrice.toLocaleString()} e ${maxPrice.toLocaleString()} Money.`, ephemeral: true });
    }

    // Embed inicial com emoji personalizado
    const embed = new EmbedBuilder()
      .setTitle(`${rinhaEmoji} Rinha de Emoji`)
      .setColor("#FFD700")
      .setDescription(
        `${dinheiroEmoji} **Valor de entrada:** ${price.toLocaleString()} Money\n` +
        `${vencedorEmoji} **Prêmio:** \nO valor total será somado com base na quantidade de participantes!\n\n` +
        `Para participar, insira um valor entre **1.000.000** e **50.000.000** Money!\n` +
        `O vencedor será revelado após **60 segundos** ou quando atingirmos o limite de participantes!`
      );

    const joinButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join_rinha")
        .setLabel("Participar")
        .setStyle(ButtonStyle.Success)
        .setEmoji(dinheiroEmoji)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [joinButton] });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: duration,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "join_rinha") {
        const user = await User.findOne({ userID: interaction.user.id });

        if (!user || user.economia.money < price) {
          return interaction.reply({ content: "Você não tem dinheiro suficiente para participar!", ephemeral: true });
        }

        // Caso o jogador já esteja participando
        if (participants.includes(interaction.user.id)) {
          return interaction.reply({ content: "Você já está participando!", ephemeral: true });
        }

        // Deduz o valor da aposta
        user.economia.money -= price;
        await user.save();

        participants.push(interaction.user.id);

        await interaction.reply({ content: `Você entrou na rinha com uma aposta de ${price.toLocaleString()} Money! ${vencedorEmoji}`, ephemeral: true });

        // Atualizar o embed com os participantes
        embed.setDescription(
          `${dinheiroEmoji} **Valor de entrada:** ${price.toLocaleString()} Money\n` +
          `${vencedorEmoji} **Prêmio:** \nO valor total será somado com base na quantidade de participantes!\n\n` +
          `**Participantes (${participants.length}/${maxParticipants}):**\n` +
          `${participants.map((id) => `<@${id}>`).join("\n")}\n\n` +
          `Clique no botão abaixo para participar!`
        );
        msg.edit({ embeds: [embed] });

        // Finaliza o coletor se atingir o limite de jogadores
        if (participants.length >= maxParticipants) {
          collector.stop("max_participants");
        }
      }
    });

    collector.on("end", async (_, reason) => {
      if (participants.length < 2) {
        embed.setDescription("Número insuficiente de participantes para iniciar a rinha.");
        embed.setColor("#FF0000");
        msg.edit({ embeds: [embed], components: [] });
        return;
      }

      // Escolher um vencedor aleatório
      const winnerId = participants[Math.floor(Math.random() * participants.length)];
      const totalPrize = participants.length * price; // Total do prêmio baseado no número de participantes

      // Adiciona o prêmio ao vencedor
      const winner = await User.findOne({ userID: winnerId });
      if (winner) {
        winner.economia.money += totalPrize; // Adiciona o prêmio ao saldo do vencedor
        await winner.save();
      }

      embed.setDescription(
        `${vencedorEmoji} **A rinha terminou!**\n\n` +
        `${vencedorEmoji} **Vencedor:** <@${winnerId}>\n` +
        `${dinheiroEmoji} **Prêmio:** ${totalPrize.toLocaleString()} Money\n\n` +
        `Obrigado a todos que participaram!`
      );
      embed.setColor("#00FF00");
      msg.edit({ embeds: [embed], components: [] });
    });
  },
};
