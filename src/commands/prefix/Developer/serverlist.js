const { ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const load = require('lodash');

module.exports = {
  config: {
    name: "serverlist",
    aliases: null,
    description: "Veja a lista de servidores.",
    category: "dev",
    usage: null,
  },
  permissions: null,
  owner: true,
  run: async (client, message, args) => {

    const serverlist = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map(
      (guild, i) => `\`${guild.name}\` - \`${guild.id}\` | **${guild.memberCount.toLocaleString()}**`,
    );
    const mapping = load.chunk(serverlist, 10);
    const pages = mapping.map((s) => s.join('\n'));
    let page = 0;

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR)
      .setDescription(pages[page])
      .setFooter({
        text: `Página ${page + 1}/${pages.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })


    const but1 = new ButtonBuilder()
      .setCustomId('queue_cmd_but_1')
      .setEmoji(process.env.EmojiDireita)
      .setStyle(2);

    const but2 = new ButtonBuilder()
      .setCustomId('queue_cmd_but_2')
      .setEmoji(process.env.EmojiEsquerda)
      .setStyle(2);


    const row1 = new ActionRowBuilder().addComponents([but2, but1]);

    message.reply({ ephemeral: true, embeds: [embed2], components: [row1] }).then(async (msg) => {
      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (i) => {
        if (i.customId === 'queue_cmd_but_1') {
          await i.deferUpdate().catch(() => { });
          page = page + 1 < pages.length ? ++page : 0;

          const embed3 = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setColor(process.env.COLOR)
            .setDescription(pages[page])
            .setFooter({ text: `Página ${page + 1}/${pages.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

          await msg.edit({ ephemeral: true, embeds: [embed3], components: [row1] });
        } else if (i.customId === 'queue_cmd_but_2') {
          await i.deferUpdate().catch(() => { });
          page = page > 0 ? --page : pages.length - 1;

          const embed4 = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setColor(process.env.COLOR)
            .setDescription(pages[page])
            .setFooter({ text: `Página ${page + 1}/${pages.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

          await msg.edit({ embeds: [embed4], components: [row1] }).catch(() => { });

        } else if (i.customId === 'queue_cmd_but_3') {
          await i.deferUpdate().catch(() => { });
          collector.stop();
        } else return;

      });

      collector.on('end', async (collected) => {

        but1.setDisabled(true)
        but2.setDisabled(true)

        msg.edit({ components: [row1] })
      });

    })


  }
}