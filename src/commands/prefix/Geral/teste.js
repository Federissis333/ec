const { EmbedBuilder } = require("discord.js");


module.exports = {
  config: {
    name: "teste",
    aliases: null,
    category: "dev",
    description: 'Testes.',
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

  message.reply({ embed: [embed] })

  },
};