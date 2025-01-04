const { ActionRowBuilder, ButtonBuilder, ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "apostar",
    aliases: null,
    description: "Aposte coins com algum usuário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const logChannelId = "1319693458117623839"; // Substitua pelo ID do canal de logs
    const membro = message.author;
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    const quantidade = parseInt(args[1], 10);

    if (!user) {
      return message.reply({ content: `${membro}, você precisa mencionar um usuário para realizar uma aposta.` });
    }

    if (user.id === membro.id) {
      return message.reply({ content: `${membro}, você não pode realizar uma aposta consigo mesmo.` });
    }

    if (user.bot) {
      return message.reply({ content: `${membro}, você não pode realizar uma aposta com um bot.` });
    }

    if (!quantidade || isNaN(quantidade) || quantidade < 100) {
      return message.reply(`${membro}, você só pode realizar apostas acima de **100 coins**.`);
    }

    const memberdb = await client.userdb.findOne({ userID: membro.id });
    const userdb = await client.userdb.findOne({ userID: user.id });

    if (!memberdb || memberdb.economia.banco < quantidade) {
      return message.reply({ content: `${membro}, você não possui **${quantidade} coins** no banco para apostar.` });
    }

    if (!userdb || userdb.economia.banco < quantidade) {
      return message.reply({ content: `${membro}, o usuário \`${user.tag}\` não possui **${quantidade} coins** no banco para apostar.` });
    }

    const competidores = [membro, user];
    const vencedor = competidores[Math.floor(Math.random() * competidores.length)];
    const perdedor = competidores.find((c) => c !== vencedor);

    message.reply({
      content: `${user}, o usuário ${membro} deseja apostar **${quantidade} coins** com você!`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setStyle(3).setLabel("Aceitar").setCustomId(`aceitar`),
          new ButtonBuilder().setStyle(4).setLabel("Recusar").setCustomId(`recusar`)
        ),
      ],
    }).then(async (msg) => {
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id === user.id) {
          if (i.customId === `aceitar`) {
            const vencedordb = await client.userdb.findOne({ userID: vencedor.id });
            const perdedordb = await client.userdb.findOne({ userID: perdedor.id });

            const novosaldoVencedor = Number(vencedordb.economia.banco) + quantidade;
            const novosaldoPerdedor = Number(perdedordb.economia.banco) - quantidade;

            await client.userdb.updateOne({ userID: vencedor.id }, { $set: { "economia.banco": novosaldoVencedor } });
            await client.userdb.updateOne({ userID: perdedor.id }, { $set: { "economia.banco": novosaldoPerdedor } });

            msg.edit({
              content: `🏆 ${vencedor}, você ganhou **${quantidade.toLocaleString()} coins** de ${perdedor} na aposta.`,
              components: [],
            });

            // Envia log da aposta no canal de logs
            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
              const logEmbed = new EmbedBuilder()
                .setColor("#FFD700")
                .setTitle("Log de Aposta")
                .setDescription(`Detalhes da aposta realizada no servidor.`)
                .addFields(
                  { name: "🏅 Vencedor", value: `${vencedor.tag} (ID: ${vencedor.id})`, inline: true },
                  { name: "😞 Perdedor", value: `${perdedor.tag} (ID: ${perdedor.id})`, inline: true },
                  { name: "💰 Quantidade Apostada", value: `${quantidade} coins`, inline: true },
                  { name: "🕒 Data", value: new Date().toLocaleString(), inline: true }
                )
                .setTimestamp();
              logChannel.send({ embeds: [logEmbed] });
            }
          } else if (i.customId === `recusar`) {
            msg.edit({ content: `${user} recusou a aposta de **${quantidade.toLocaleString()} coins** de ${membro}.`, components: [] });
          }
        } else {
          i.deferUpdate();
        }
      });
    });
  },
};
