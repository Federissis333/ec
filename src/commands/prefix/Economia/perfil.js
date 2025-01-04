const { EmbedBuilder } = require('discord.js');
const { toMoney, toTime } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "perfil",
    aliases: ["p", "pf"],
    description: "Veja o perfil de um usuário.",
    category: "economia",
    usage: "perfil [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    try {
      const membro = 
        client.users.cache.get(args[0]) || 
        message.mentions.users.first() || 
        message.author;

      const user = await client.userdb.findOne({ userID: membro.id }) || {
        economia: {
          ruby: 0,
          banco: 0,
          money: 0,
          sujo: 0,
          sobremim: "null",
          marry: { casado: false, user: null, time: 0 },
          vip: { enabled: false, level: 0, expiresAt: null }, // VIP data
        },
        icon: null,
        color: null,
        emblemas: [],
        infos: { xp: 0, level: 0, rep: 0 },
      };

      const sobreMim =
        user.economia.sobremim && user.economia.sobremim !== "null"
          ? user.economia.sobremim
          : `Prazer, **${membro.username}**!`;

      const embed = new EmbedBuilder()
        .setDescription(sobreMim)
        .setThumbnail(
          membro.displayAvatarURL({ dynamic: true, size: 4096 }) ||
          process.env.ICON_PRIMARY ||
          null
        )
        .setFooter({
          text: `${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true, size: 4096 }),
        })
        .setColor(user.color || process.env.COLOR1 || "#FFFFFF")
        .setTimestamp();

      if (user.emblemas && user.emblemas.length > 0) {
        embed.addFields({
          name: "Emblemas:",
          value: user.emblemas.map((x) => `${x}`).join(" "),
        });
      }

      embed.addFields(
        {
          name: "Saldo:",
          value: `🪙 \`${toMoney(user.economia.money || 0)}\`\n🏦 \`${toMoney(user.economia.banco || 0)}\``,
          inline: true,
        },
        {
          name: "Experiência:",
          value: `Level: \`${user?.infos?.level || 0}\`\nXP: \`${toMoney(user?.infos?.xp || 0)}\``,
          inline: true,
        },
        {
          name: "Reps:",
          value: `\`${user?.infos?.rep || 0}\``,
          inline: true,
        }
      );

      const relacionamento =
        user.economia.marry && user.economia.marry.casado
          ? `Casado com: \`${
              client.users.cache.get(user.economia.marry.user)?.tag || "unknown#0000"
            }\`\nCasado há: \`${toTime(
              Date.now() - (user.economia.marry.time || 0)
            )}\``
          : "Solteiro!";
      embed.addFields({ name: "Relacionamento:", value: relacionamento, inline: true });

      // Verificar se o usuário é VIP e adicionar no Embed
      const vipStatus = user.vip.enabled
        ? `:crown: VIP ativo! (Nível: ${user.vip.level || 0})\nExpira em: <t:${Math.floor(user.vip.expiresAt / 1000)}:R>`
        : `:no_entry_sign: Não é VIP`;

      embed.addFields({ name: "VIP Status:", value: vipStatus, inline: true });

      embed.setAuthor({
        name: `Perfil de ${membro.tag}`,
        iconURL: user.icon || process.env.ICON_PRIMARY || membro.displayAvatarURL(),
      });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao executar o comando de perfil:", error);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Erro")
            .setDescription(
              "Ocorreu um erro ao tentar acessar o perfil. Tente novamente mais tarde."
            ),
        ],
      });
    }
  },
};