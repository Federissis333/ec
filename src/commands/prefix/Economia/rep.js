const { EmbedBuilder } = require("discord.js");
const { User } = require(`${process.cwd()}/src/structures/MongoModels.js`);

module.exports = {
  config: {
    name: "rep",
    aliases: [],
    description: "Envie reputação para outro usuário ou veja a sua.",
    category: "social",
    usage: "rep [@usuário]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    try {
      const target = message.mentions.users.first();
      const authorData = await User.findOne({ userID: message.author.id });

      if (!authorData) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Erro!")
              .setDescription("Você ainda não tem um perfil registrado."),
          ],
        });
      }

      // Exibir quantidade de reputação do próprio usuário
      if (!target) {
        const userReps = authorData.infos.rep || 0;

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00FF00")
              .setTitle("Sua Reputação")
              .setDescription(`Você possui **${userReps}** reps.`),
          ],
        });
      }

      if (target.id === message.author.id) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Erro!")
              .setDescription("Você não pode enviar reputação para si mesmo."),
          ],
        });
      }

      const targetData = await User.findOne({ userID: target.id });

      if (!targetData) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Erro!")
              .setDescription(`${target.username} ainda não tem um perfil registrado.`),
          ],
        });
      }

      const cooldown = 2 * 60 * 60 * 1000; // 2 horas
      const lastRep = authorData.social?.lastRep || 0;

      if (Date.now() - lastRep < cooldown) {
        const timeLeft = cooldown - (Date.now() - lastRep);
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FFFF00")
              .setTitle("Cooldown")
              .setDescription(
                `Você já enviou reputação recentemente. Tente novamente em ${hours}h ${minutes}m.`
              ),
          ],
        });
      }

      // Incrementa a reputação do alvo
      await User.updateOne(
        { userID: target.id },
        { $inc: { "infos.rep": 1 } }
      );

      // Atualiza o timestamp do último envio de reputação
      await User.updateOne(
        { userID: message.author.id },
        { $set: { "social.lastRep": Date.now() } }
      );

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Reputação Enviada!")
            .setDescription(
              `Você enviou reputação para **${target.username}**.`
            ),
        ],
      });
    } catch (error) {
      console.error("Erro ao executar o comando de rep:", error);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro")
            .setDescription(
              "Ocorreu um erro ao tentar enviar reputação. Tente novamente mais tarde."
            ),
        ],
      });
    }
  },
};
