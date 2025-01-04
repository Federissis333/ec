const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "jokenpo",
    aliases: ["jp"],
    description: "Desafie outro jogador para uma partida de Jokenpô apostando dinheiro!",
    category: "economia",
    usage: "jokenpo @usuário valor",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const authorData = await User.findOne({ userID: message.author.id });
    const opponent = message.mentions.users.first();
    const betAmount = parseInt(args[1]);

    // Defina o ID do canal de logs aqui
    const logChannelId = "1319693450630926506"; // Substitua por seu ID de canal de logs

    if (!opponent) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro!")
            .setDescription("Você precisa mencionar um jogador para desafiá-lo!")
        ]
      });
    }

    if (opponent.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro!")
            .setDescription("Você não pode desafiar a si mesmo!")
        ]
      });
    }

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro!")
            .setDescription("Informe um valor válido para apostar.")
        ]
      });
    }

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro!")
            .setDescription("O canal de logs configurado não existe neste servidor!")
        ]
      });
    }

    const opponentData = await User.findOne({ userID: opponent.id });

    if (authorData.economia.money < betAmount) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Saldo Insuficiente!")
            .setDescription("Você não tem dinheiro suficiente para apostar.")
        ]
      });
    }

    if (!opponentData || opponentData.economia.money < betAmount) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Saldo Insuficiente!")
            .setDescription(`${opponent.username} não tem dinheiro suficiente para apostar.`)
        ]
      });
    }

    const embedDesafio = new EmbedBuilder()
      .setColor("#0099FF")
      .setTitle("Desafio de Jokenpô!")
      .setDescription(`${opponent}, você foi desafiado por ${message.author} para uma partida de Jokenpô valendo **${betAmount} coins**!\n\nClique para aceitar ou recusar.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("accept").setLabel("Aceitar").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("decline").setLabel("Recusar").setStyle(ButtonStyle.Danger)
    );

    const msg = await message.channel.send({ embeds: [embedDesafio], components: [row] });

    const filter = (i) => i.user.id === opponent.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "accept") {
        collector.stop();
        await interaction.update({ components: [] });

        const embedJogo = new EmbedBuilder()
          .setColor("#0099FF")
          .setTitle("Escolha sua jogada!")
          .setDescription("Clique no botão correspondente à sua escolha: Pedra, Papel ou Tesoura.");

        const rowJogo = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("pedra").setLabel("Pedra").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("papel").setLabel("Papel").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("tesoura").setLabel("Tesoura").setStyle(ButtonStyle.Primary)
        );

        const msgJogo = await message.channel.send({ embeds: [embedJogo], components: [rowJogo] });

        const choices = {};
        const gameFilter = (i) => [message.author.id, opponent.id].includes(i.user.id);
        const gameCollector = msgJogo.createMessageComponentCollector({ filter: gameFilter, max: 2, time: 30000 });

        gameCollector.on("collect", (i) => {
          if (choices[i.user.id]) {
            return i.reply({ content: "Você já escolheu sua jogada!", ephemeral: true });
          }

          choices[i.user.id] = i.customId;
          i.reply({ content: `Você escolheu **${i.customId}**!`, ephemeral: true });

          if (Object.keys(choices).length === 2) {
            gameCollector.stop();
          }
        });

        gameCollector.on("end", async () => {
          if (Object.keys(choices).length < 2) {
            return msgJogo.edit({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FF0000")
                  .setTitle("Jogo Cancelado")
                  .setDescription("Nem todos os jogadores fizeram sua escolha a tempo.")
              ],
              components: []
            });
          }

          const resultado = getWinner(choices[message.author.id], choices[opponent.id]);
          let embedResultado;

          if (resultado === "empate") {
            embedResultado = new EmbedBuilder()
              .setColor("#FFFF00")
              .setTitle("Empate!")
              .setDescription("Ambos os jogadores fizeram a mesma escolha. Ninguém perdeu dinheiro.");
          } else if (resultado === message.author.id) {
            embedResultado = new EmbedBuilder()
              .setColor("#00FF00")
              .setTitle("Vitória!")
              .setDescription(`${message.author} venceu a partida e ganhou **${betAmount} coins**!`);

            await User.updateOne({ userID: message.author.id }, { $inc: { "economia.money": betAmount } });
            await User.updateOne({ userID: opponent.id }, { $inc: { "economia.money": -betAmount } });
          } else {
            embedResultado = new EmbedBuilder()
              .setColor("#00FF00")
              .setTitle("Vitória!")
              .setDescription(`${opponent} venceu a partida e ganhou **${betAmount} coins**!`);

            await User.updateOne({ userID: opponent.id }, { $inc: { "economia.money": betAmount } });
            await User.updateOne({ userID: message.author.id }, { $inc: { "economia.money": -betAmount } });
          }

          // Envio do log ao canal configurado
          const logEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Registro de Jokenpô")
            .setDescription(`**Jogadores:**\n${message.author} vs ${opponent}\n\n**Resultado:** ${resultado === "empate" ? "Empate" : resultado === message.author.id ? message.author : opponent}\n**Aposta:** ${betAmount} coins`);

          logChannel.send({ embeds: [logEmbed] });

          msgJogo.edit({ embeds: [embedResultado], components: [] });
        });
      } else if (interaction.customId === "decline") {
        collector.stop();
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Desafio Recusado")
              .setDescription(`${opponent} recusou o desafio.`)
          ],
          components: []
        });
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Tempo Esgotado")
              .setDescription("O desafio de Jokenpô expirou.")
          ],
          components: []
        });
      }
    });
  },
};

function getWinner(choice1, choice2) {
  const rules = {
    pedra: "tesoura",
    papel: "pedra",
    tesoura: "papel",
  };

  if (choice1 === choice2) return "empate";
  return rules[choice1] === choice2 ? choice1 : choice2;
}
