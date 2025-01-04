const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "vender",
    aliases: ["sell"],
    description: "Venda seus peixes e receba dinheiro em troca.",
    category: "economia",
    usage: "vender",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const user = await User.findOne({ userID: message.author.id });

    if (!user) {
      const newUser = new User({ userID: message.author.id });
      await newUser.save();
      return message.reply("Você foi registrado no sistema! Use o comando novamente.");
    }

    const fishingData = user.economia.pesca;

    if (fishingData.peixes.length === 0 && fishingData.itensPerda.length === 0) {
      return message.reply("Você não tem peixes ou itens para vender!");
    }

    let totalDinheiro = 0;
    let totalXP = 0;

    fishingData.peixes.forEach((peixe) => {
      if (peixe === "Peixe Comum") totalDinheiro += 10, totalXP += 5;
      if (peixe === "Peixe Raro") totalDinheiro += 50, totalXP += 20;
      if (peixe === "Peixe Epico") totalDinheiro += 100, totalXP += 30;
      if (peixe === "Peixe Lendário") totalDinheiro += 300, totalXP += 70;
      if (peixe === "Peixe Mítico") totalDinheiro += 1000, totalXP += 100;
      if (peixe === "Peixe Secreto") totalDinheiro += 10000, totalXP += 300;
    });

    fishingData.itensPerda.forEach((item) => {
      if (item === "Bota Velha" || item === "Garrafão Antigo" || item === "Lata Enferrujada" || item === "Algas") {
        // Nenhum dinheiro ou XP é gerado de itens de perda
      }
    });

    // Reseta os dados de pesca temporários
    fishingData.peixes = [];
    fishingData.itensPerda = [];

    user.economia.money += totalDinheiro; // Adiciona o dinheiro à conta
    user.infos.xp += totalXP;              // Adiciona o XP à conta
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("💰 Venda Realizada!")
      .setDescription(`Você vendeu todos os seus peixes e recebeu **$${totalDinheiro}** e **${totalXP} XP**!`)
      .setColor("Green");

    return message.reply({ embeds: [embed] });
  },
};
