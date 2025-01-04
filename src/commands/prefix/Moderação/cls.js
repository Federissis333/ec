const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "cls",
    aliases: ["clear", "limpar"],
    description: "Apaga todas as mensagens enviadas pelo usuário no chat.",
    category: "utilidade",
    usage: "cls",
  },
  permissions: null,
  owner: false,
  run: async (client, message) => {
    if (message.author.bot) return;

    // Obtenha o canal onde o comando foi executado
    const channel = message.channel;

    // Delete messages do autor no canal
    const fetchedMessages = await channel.messages.fetch({
      limit: 100, // Limitar para 100 mensagens por busca
    });

    // Filtra apenas as mensagens do autor
    const userMessages = fetchedMessages.filter(
      msg => msg.author.id === message.author.id
    );

    if (userMessages.size === 0) {
      return message.reply("Não há mensagens suas para apagar!");
    }

    await channel.bulkDelete(userMessages, true); // Deleta as mensagens
    message.reply({ content: "Suas mensagens foram apagadas!", ephemeral: true });
  },
};
