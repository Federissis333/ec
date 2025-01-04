const client = require(`${process.cwd()}/index.js`);
const { EmbedBuilder, ActionRowBuilder, MessageSelectMenu, ButtonBuilder, ComponentType, StringSelectMenuBuilder } = require("discord.js");
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "empregos",
    aliases: null,
    description: "Ingresse em um emprego.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let membro = message.author;

    const userdb = await client.userdb.findOne({ userID: membro.id }) || { economia: { banco: 0, money: 0, trabalho: { trampo: 'null' } }, infos: { level: 0 }, cooldowns: { empregos: 0 } }

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setDescription(`Selecione um emprego para ver suas informações.\nCada emprego requer um level, para ganhar xp e upar seu level, compre bebidas na loja.`)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('lixeiro')
          .setPlaceholder('Selecione um emprego')
          .addOptions([
            {
              label: 'Lixeiro',
              emoji: '🗑',
              value: 'lixeiro',
            },
            {
              label: 'Caminhoneiro',
              emoji: '🚛',
              value: 'caminhoneiro',
            },
            {
              label: 'Pescador',
              emoji: '🎣',
              value: 'pescador',
            }
          ]),
      );

    await message.reply({ embeds: [embed], components: [row], fetchReply: true }).then(msg => {

      const collector = msg.createMessageComponentCollector({ time: 60000 });

      collector.on('collect', async (i) => {

        if (i.user.id != membro.id) return i.deferUpdate();

        if (i.componentType === 2) {
          if (Date.now() < userdb.cooldowns.trabalho) {
            return msg.edit({ content: `${membro}, você só pode trocar de emprego 1 vez por semana.\nVocê precisa esperar \`${toTime(userdb.cooldowns.trabalho - Date.now())}\` para poder trocar de emprego novamente.`, embeds: [], components: [] })
          }
          const button = i.customId.split("_")[1];

          if (button === userdb.economia.trabalho.trampo) return msg.edit({ content: `${membro}, você já esta neste emprego.`, embeds: [], components: [row] })

          let trabalho;
          let cooldown;
          let maxmoney;
          let requiredlevel;
          switch (button) {

            case "lixeiro":
              trabalho = "lixeiro"
              cooldown = 1000 * 60 * 90
              maxmoney = 1000
              requiredlevel = 0
              break;

            case "caminhoneiro":
              trabalho = "caminhoneiro"
              cooldown = 1000 * 60 * 90
              maxmoney = 3500
              requiredlevel = 5
              break;

            case "pescador":
              trabalho = "pescador"
              cooldown = 1000 * 60 * 90
              maxmoney = 8500
              requiredlevel = 10
              break;
          }

          if (requiredlevel <= userdb.infos.level) {

            msg.edit({ content: `Parabéns ${membro}, agora você está trabalhando de \`${trabalho}\`!`, embeds: [], components: [] })

            let userdb = await client.userdb.findOne({ userID: membro.id })

            if (!userdb) userdb = await new client.userdb({ userID: membro.id }).save();

            await client.userdb.updateOne({ userID: membro.id }, { $set: { "economia.trabalho": { maxmoney: maxmoney, trampo: trabalho, cooldown: cooldown } } })

          } else {
            msg.edit({ content: `${membro}, você não tem level suficiente para se ingressar neste emprego.`, embeds: [], components: [row] })
          }

        } else if (i.componentType === 3) {

          const select = i.values[0]

          if (select == 'lixeiro') {

            i.deferUpdate()
            msg.edit({ content: ``, embeds: [msgembed("🗑", "Lixeiro", "1h", 1302, 0, membro)], components: [row, button("lixeiro")] })

          }

          if (select == 'caminhoneiro') {

            i.deferUpdate()
            msg.edit({ content: ``, embeds: [msgembed("🚛", "Caminhoneiro", "1h", 2604, 5, membro)], components: [row, button("caminhoneiro")] })

          }

          if (select == 'pescador') {

            i.deferUpdate()
            msg.edit({ content: ``, embeds: [msgembed("🎣", "Pescador", "1h", 3906, 10, membro)], components: [row, button("pescador")] })

          }

        }

      })

    })

  }
}

function msgembed(emoji, emprego, cooldown, ganhos, requiredlevel, membro) {
  return new EmbedBuilder()
    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
    .setTitle(`${emoji} ${emprego}`)
    .setColor(process.env.COLOR1)
    .setDescription(`Cooldown: \`${cooldown}\`\nSalário máximo: \`${toMoney(ganhos)}\`\nLevel necessário: \`${requiredlevel}\``)
    .setFooter({ text: `${membro.tag}`, iconURL: `${membro.displayAvatarURL({ format: "png" })}` })
    .setTimestamp()

}

function button(String) {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`aceitar_${String}`)
        .setLabel('Pegar emprego')
        .setStyle(2),
    );

}