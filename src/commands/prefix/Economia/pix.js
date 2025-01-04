const { EmbedBuilder } = require("discord.js");
const { User, Guild } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "pix",
    aliases: ["pay", "doar", "caridade"],
    description: "Transfira dinheiro para outro usuário.",
    category: "economia",
    usage: "!pix <@user> <quantidade>",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);
    const logChannelId = "1319693456226123927"; // Substitua pelo ID do canal de logs

    if (!mentionedUser || isNaN(amount) || amount <= 0) {
      return message.reply("Por favor, use o formato correto: `!pix @usuario quantidade`.");
    }

    if (mentionedUser.id === message.author.id) {
      return message.reply("Você não pode transferir dinheiro para si mesmo!");
    }

    const sender = await User.findOne({ userID: message.author.id });
    const receiver = await User.findOne({ userID: mentionedUser.id });

    if (!sender) {
      return message.reply("Você não possui uma conta registrada! Use o comando de registro primeiro.");
    }

    if (!receiver) {
      return message.reply("O destinatário não possui uma conta registrada!");
    }

    if (sender.economia.money < amount) {
      return message.reply("Você não possui saldo suficiente para realizar esta transação!");
    }

    // Realiza a transferência
    sender.economia.money -= amount;
    sender.economia.pixFeitos = (sender.economia.pixFeitos || 0) + 1;

    receiver.economia.money += amount;
    receiver.economia.pixRecebidos = (receiver.economia.pixRecebidos || 0) + 1;

    await sender.save();
    await receiver.save();

    const successEmbed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Transferência Realizada!")
      .setDescription(
        `Você transferiu **${amount}** moedas para ${mentionedUser.username}.`
      )
      .addFields(
        { name: "💵 Seu Saldo Atual", value: `${sender.economia.money} moedas` },
        { name: "📈 Pix Realizados", value: `${sender.economia.pixFeitos}` }
      )
      .setTimestamp();

    await message.reply({ embeds: [successEmbed] });

    // Envia logs para o canal definido no código
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("Log de Transferência")
        .addFields(
          { name: "🔸 Remetente", value: `${message.author.tag} (ID: ${message.author.id})` },
          { name: "🔹 Destinatário", value: `${mentionedUser.tag} (ID: ${mentionedUser.id})` },
          { name: "💰 Valor Transferido", value: `${amount} moedas` },
          { name: "🕒 Data", value: new Date().toLocaleString() }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });
    } else {
      console.warn("O canal de logs definido não foi encontrado.");
    }
  },
};
