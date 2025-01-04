const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ComponentType } = require('discord.js');
const load = require('lodash');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "rank",
    aliases: ["top", "leaderboard"],
    description: "Veja o rank da economia.",
    category: "dev",
    usage: "rank lcoal/global",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (["global"].includes(args[0]?.toLowerCase())) {

      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.economia.money + b.economia.banco + b.economia.sujo) - (a.economia.money + a.economia.banco + a.economia.sujo));
      let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
      userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} 🪙 **${toMoney(user.economia.money + user.economia.banco + user.economia.sujo)}**`);

      const mapping = load.chunk(userdb, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de coins global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de coins  global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de coins global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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
      return;
    }


    if (["local"].includes(args[0]?.toLowerCase())) {

      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.economia.money + b.economia.banco + b.economia.sujo) - (a.economia.money + a.economia.banco + a.economia.sujo));
      let userinserver = userdb.map((user, i) => {
        let lixo = message.guild.members.cache.get(user.userID) == null ? false : true;
        if (lixo === false) { } else { return `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} 🪙 **${toMoney(user.economia.money + user.economia.banco + user.economia.sujo)}**` }
      });

      let userinserverrank = userdb.map((user, i) => {
        let lixo = message.guild.members.cache.get(user.userID) == null ? false : true;
        if (lixo === false) { } else { return user }
      });

      let rank = userinserverrank.map(user => user?.userID).indexOf(`${message.author.id}`) + 1 || "N/A";

      const mapping = load.chunk(userinserver, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de coins local`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de coins local`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de coins local`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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
      return;
    }

    if (["rep"].includes(args[0]?.toLowerCase())) {
      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.infos.rep) - (a.infos.rep));
      let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
      userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} 👍 **${user.infos.rep == null ? `0` : `\`${user.infos.rep.toLocaleString()}\``}**`);

      const mapping = load.chunk(userdb, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de rep`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de rep`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de rep`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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

      return;
    }

    if (["level"].includes(args[0]?.toLowerCase())) {

      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.infos.level) - (a.infos.level));
      let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
      userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} ⭐ **${user.infos.level == null ? `0` : `${user.infos.level.toLocaleString()}`}**`);

      const mapping = load.chunk(userdb, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de level`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de level`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de level`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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

      return;
    }

    if (["xp"].includes(args[0]?.toLowerCase())) {
      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.infos.xp) - (a.infos.xp));
      let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
      userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} ✨ **${user.infos.xp == null ? `0` : `${user.infos.xp.toLocaleString()}`}**`);

      const mapping = load.chunk(userdb, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de xp`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de xp`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de xp`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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

      return;
    }

    if (["ban"].includes(args[0]?.toLowerCase())) {
      let count = 0;
      let userdb = await client.userdb.find({});
      userdb = userdb.sort((a, b) => (b.infos.bans) - (a.infos.bans));
      let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
      userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} 🪙 **${user.infos.bans == null ? `0` : `\`${user.infos.bans.toLocaleString()}\``}**`);

      const mapping = load.chunk(userdb, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de bans`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR)
        .setDescription(pages[page])
        .setFooter({
          text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de bans`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de bans`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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

      return;
    }

    if (["div"].includes(args[0]?.toLowerCase())) {
      if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Gerenciar Servidor** para executar esta função.` });

      let count = 0;
      let invites = await message.guild.invites.fetch()
      invites = invites.sort((a, b) => b.uses - a.uses)
      invites = invites.map((invite, i) => `${count = count += 1}º \`${invite.inviter.tag}\`  \`disocrd.gg/${invite.code}\` - **${invite.uses.toLocaleString()}**`)

      const mapping = load.chunk(invites, 10);
      const pages = mapping.map((s) => s.join(`\n`));
      let page = 0;

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}: Rank de divulgações`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR1)
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

      message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
          if (i.customId === 'queue_cmd_but_1') {
            await i.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de divulgações`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR1)
              .setDescription(pages[page])
              .setFooter({ text: `Página ${page + 1}/${pages.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            await msg.edit({ embeds: [embed3], components: [row1] });
          } else if (i.customId === 'queue_cmd_but_2') {
            await i.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setAuthor({ name: `${client.user.username}: Rank de divulgações`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
              .setColor(process.env.COLOR1)
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

      return;
    }

    let count = 0;
    let userdb = await client.userdb.find({});
    userdb = userdb.sort((a, b) => (b.economia.money + b.economia.banco + b.economia.sujo) - (a.economia.money + a.economia.banco + a.economia.sujo));
    let rank = userdb.map(user => user.userID).indexOf(`${message.author.id}`) + 1 || "N/A";
    userdb = userdb.map((user, i) => `**${count = count += 1}º** - ${client.users.cache.get(user.userID)?.tag == null ? `\`unknown#0000\`` : `\`${client.users.cache.get(user.userID)?.tag}\``} 🪙 **${toMoney(user.economia.money + user.economia.banco + user.economia.sujo)}**`);

    const mapping = load.chunk(userdb, 10);
    const pages = mapping.map((s) => s.join(`\n`));
    let page = 0;

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Rank de coins global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR)
      .setDescription(pages[page])
      .setFooter({
        text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

    message.reply({ embeds: [embed2], components: [row1] }).then(async (msg) => {
      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (i) => {
        if (i.customId === 'queue_cmd_but_1') {
          await i.deferUpdate().catch(() => { });
          page = page + 1 < pages.length ? ++page : 0;

          const embed3 = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}: Rank de coins  global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setColor(process.env.COLOR)
            .setDescription(pages[page])
            .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

          await msg.edit({ embeds: [embed3], components: [row1] });
        } else if (i.customId === 'queue_cmd_but_2') {
          await i.deferUpdate().catch(() => { });
          page = page > 0 ? --page : pages.length - 1;

          const embed4 = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}: Rank de coins global`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
            .setColor(process.env.COLOR)
            .setDescription(pages[page])
            .setFooter({ text: `Página ${page + 1}/${pages.length} - Sua posição: ${rank}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

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

  },
};