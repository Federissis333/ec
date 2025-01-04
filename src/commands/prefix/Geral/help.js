const { ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "help",
    aliases: ['ajuda'],
    description: "Acesse minha lista completa de comandos",
    category: "geral",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    const cmdgeral = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "geral").map((x) => x.config.name)
    const cmdeco = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "economia").map((x) => x.config.name)
    const cmdint = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "interação").map((x) => x.config.name)
    const cmdmod = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "moderação").map((x) => x.config.name)
    const cmdadm = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "ADM").map((x) => x.config.name)
    const cmdnsfw = await client.prefix_commands.filter((x) => x.config.category && x.config.category === "NSFW").map((x) => x.config.name)

    let cmds = cmdgeral.length + cmdeco.length + cmdint.length + cmdmod.length + cmdadm.length + cmdnsfw.length;

    let guilddb = await client.guilddb.findOne({ IDs: message.guild.id }) || { prefix: process.env.PREFIX }
    let prefix = guilddb.prefix

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`**Olá, meu nome é ${client.user.username}.**\nPara acessar minha lista de comandos selecione no menu abaixo.\nTodos os meus comandos estão disponíveis em slash.\n*Tenho um total de **${cmds}** comandos*`)
      .addFields({ name: 'Convite', value: '[Convidar](https://discord.com/oauth2/authorize?client_id=1319706848097603654&permissions=8&scope=bot%20applications.commands)', inline: true })
      .addFields({ name: 'Suporte', value: `[Entrar](${process.env.SUPORTE})`, inline: true })
      .addFields({ name: 'Vote em mim', value: '[Votar](https://top.gg/bot/1319706848097603654)', inline: true })
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp();

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos Gerais [${cmdgeral.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdgeral.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const embed3 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos de Economia [${cmdeco.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdeco.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()


    const embed4 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos de Interação [${cmdint.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdint.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const embed5 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos de Moderação [${cmdmod.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdmod.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const embed6 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos de Administração [${cmdadm.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdadm.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const embed7 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}: Comandos de NSFW [${cmdnsfw.length}]`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setThumbnail(process.env.LOGO2)
      .setDescription(`Seja bem-vindo ao menu de ajuda.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})\n\`\`\`${prefix}${cmdnsfw.join(`\n${prefix}`)}\`\`\``)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })
      .setTimestamp()

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('1')
          .setPlaceholder('Lista de comandos')
          .addOptions([
            {
              label: 'Menu Inicial',
              emoji: `🏡`,
              description: 'Volte ao menu inicial',
              value: '1',

            },
            {
              label: 'Comandos Gerais',
              emoji: `⭐`,
              description: 'Lista de comandos gerais',
              value: '2',
            },
            {
              label: 'Comandos Econômicos',
              emoji: `💰`,
              description: 'Lista de comandos de economia',
              value: '3',
            },
            {
              label: 'Comandos Interativos',
              emoji: `🎉`,
              description: 'Lista de comandos de interação',
              value: '4',

            },
            {
              label: 'Comandos Moderativos',
              emoji: `🛠️`,
              description: 'Lista de comandos de moderação',
              value: '5',
            },
            {
              label: 'Comandos Administrativos',
              emoji: `⚙️`,
              description: 'Lista de comandos de administração',
              value: '6',
            },
            {
              label: 'Comandos NSFW',
              emoji: `🔞`,
              description: 'Lista de comandos de NSFW',
              value: '7',
            }



          ])
      )


    message.reply({ embeds: [embed], fetchReply: true, components: [row] }).then(msg => {

      const filtro = (interaction) => interaction.isSelectMenu()
      const coletor = msg.createMessageComponentCollector({ filtro });

      coletor.on('collect', async (collected) => {
        if (collected.user.id !== message.author.id) return collected.reply({ content: `Caso queira usar o menu utilize o comando \`${prefix}ajuda\`.`, ephemeral: true })
        let ticket = collected.values[0]
        collected.deferUpdate()

        if (ticket === '1' /* id que vc colocou)*/) {
          msg.edit({ embeds: [embed] })
        }
        if (ticket === '2' /*id que vc colocou)*/) {
          msg.edit({ embeds: [embed2] })
        }
        if (ticket === '3') {
          msg.edit({ embeds: [embed3] })
        }
        if (ticket === '4') {
          msg.edit({ embeds: [embed4] })
        }
        if (ticket === '5') {
          msg.edit({ embeds: [embed5] })
        }
        if (ticket === '6') {
          msg.edit({ embeds: [embed6] })
        }
        if (ticket === '7') {
          msg.edit({ embeds: [embed7] })
        }

      })
    })

  },
};
