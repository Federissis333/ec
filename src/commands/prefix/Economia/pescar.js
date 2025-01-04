const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "pescar",
    aliases: ["fishing"],
    description: "Pesque para ganhar dinheiro e XP! Você pode vender seus peixes depois.",
    category: "economia",
    usage: "pescar",
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

    const peixes = user.economia.pesca.peixes || [];
    const itensPerda = user.economia.pesca.itensPerda || [];

    const itens = [
      { nome: "Peixe Comum", tipo: "peixe", valor: 10, xp: 5 },
      { nome: "Peixe Raro", tipo: "peixe", valor: 50, xp: 20 },
      { nome: "Peixe Épico", tipo: "peixe", valor: 100, xp: 30 }, 
      { nome: "Peixe Lendário", tipo: "peixe", valor: 500, xp: 50 },
      { nome: "Peixe Mítico", tipo: "peixe", valor: 1000, xp: 70 },
      { nome: "Peixe Secreto", tipo: "peixe", valor: 10000, xp: 300 },
      { nome: "Bota Velha", tipo: "lixo", valor: 0, xp: 1 },
      { nome: "Garrafão Antigo", tipo: "lixo", valor: 0, xp: 0 },
      { nome: "Lata Enferrujada", tipo: "lixo", valor: 0, xp: 0 },
      { nome: "Algas", tipo: "lixo", valor: 0, xp: 0 },
    ];

    const itemPescado = itens[Math.floor(Math.random() * itens.length)];

    if (itemPescado.tipo === "peixe") {
      peixes.push(itemPescado.nome); // Adiciona ao histórico de peixes
    } else {
      itensPerda.push(itemPescado.nome); // Adiciona ao histórico de itens "lixo"
    }

    user.economia.pesca.peixes = peixes;
    user.economia.pesca.itensPerda = itensPerda;
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎣 Pesca!")
      .setDescription(
        itemPescado.tipo === "peixe"
          ? `Você pescou: **${itemPescado.nome}**!\n> XP ganho: **${itemPescado.xp}**\n> Dinheiro ganho: **$${itemPescado.valor}**`
          : `Você pescou: **${itemPescado.nome}**. Parece que não vale nada...`
      )
      .setColor(itemPescado.tipo === "peixe" ? "Blue" : "Red");

    return message.reply({ embeds: [embed] });
  },
};
