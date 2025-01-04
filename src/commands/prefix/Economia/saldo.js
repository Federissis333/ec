const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Ajuste o caminho para o arquivo onde está o schema do User
const { dinheiroEmoji } = require(`${process.cwd()}/src/structures/Emoji`)

module.exports = {
  config: {
    name: "banca",
    aliases: ["saldo", "money", "banco"],
    description: "Exibe o saldo de dinheiro do usuário.",
    category: "economia",
    usage: "carteira [@usuário]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    let userID = message.author.id; // Usuário padrão (quem usou o comando)

    // Verifica se foi mencionado algum usuário
    const mention = message.mentions.users.first();
    if (mention) {
      userID = mention.id; // Usa o ID do usuário mencionado
    }

    const user = await User.findOne({ userID });

    if (!user) {
      return message.reply({ content: "Usuário não encontrado na base de dados.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("Carteira do Usuário")
      .setColor("#00FF00")
      .setDescription(`${dinheiroEmoji} **você possui: R$** ${user.economia.money.toLocaleString()} ** de banca** `);

    message.channel.send({ embeds: [embed] });
  },
};
