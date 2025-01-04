const { EmbedBuilder } = require('discord.js');

module.exports = {
  config: {
    name: "badge",
    aliases: null,
    description: "Adicione badge em um usuário.",
    category: "dev",
    usage: null,
  },
  permissions: null,
  owner: true,
  run: async (client, message, args) => {

    const emoji = args[2];
    const membro = client.users.cache.get(args[1]) || message.mentions.users.first();

    if (!args[0]) return message.reply({ content: `${message.author}, informe se deseja adcionar ou remover uma badge.` })
    if (!membro) return message.reply({ content: `${message.author}, é preciso marcar um usuário` });
    if (!emoji) return message.reply({ content: `${message.author}, você não informou nenhum badge para ser adicionada ao usuário.` });

    const user = await client.userdb.findOne({ userID: membro.id });
    if (!user) {
      const newuser = new client.userdb({ userID: membro.id })
      await newuser.save();

      user = await client.userdb.findOne({ userID: membro.id })
    }

    if (["add", "adicionar"].includes(args[0]?.toLowerCase())) {
      if (user.emblemas.find((x) => x === emoji)) {
        return message.reply({ content: `${message.author}, o usuário já possui esta badge.` });
      } else {
        message.reply({ content: `${message.author}, a badge foi adicionada no usuário com sucesso.` });
        await client.userdb.updateOne({ userID: membro.id }, { $push: { "emblemas": emoji } });
      }
      return;
    }

    if (["remove", "remover"].includes(args[0]?.toLowerCase())) {
      if (emoji == "all") {
        if (!user.emblemas.length) {
          return message.reply({ content: `${message.author}, o usuário não possui nenhuma badge.` });
        } else {
          message.reply({ content: `${message.author}, todas as badges foram removidas.` });
          await client.userdb.updateOne({ userID: membro.id }, { $set: { "emblemas": [] } });
        }
        return;
      }
      if (!user.emblemas.length) {
        return message.reply({ content: `${message.author}, o usuário não possui nenhuma badge.` });
      } else if (!user.emblemas.find((x) => x === emoji)) {
        return message.reply({ content: `${message.author}, o usuário não possui esta badge.` });
      } else {
        message.reply({ content: `${message.author}, esta badge foi removida do usuário com sucesso.` });
        await client.userdb.updateOne({ userID: membro.id }, { $pull: { "emblemas": emoji } })
      }

      return;
    }

  },
};