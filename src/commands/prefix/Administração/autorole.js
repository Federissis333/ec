const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ComponentType, ChannelType } = require('discord.js');

module.exports = {
  config: {
    name: "autorole",
    aliases: ["autoroles", "auto-role", "auto-roles"],
    description: "Configure o sistema de auto-roles.",
    category: "ADM",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${message.author}, eu preciso da permissão de **ADMINISTRADOR** para executar esta função.`, ephemeral: true });

    let guilddb = await client.guilddb.findOne({ IDs: message.guild.id })
    if (!guilddb) guilddb = await new client.guilddb({ IDs: message.guild.id }).save();

    const row = new ActionRowBuilder()
    const row2 = new ActionRowBuilder()

    const estado = new ButtonBuilder()
    const cargo = new ButtonBuilder()
    const resetcargo = new ButtonBuilder()

    if (guilddb.contador.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); row.addComponents(estado) } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); row.addComponents(estado) }

    if (!guilddb.autorole.roles.length) { cargo.setStyle(1).setLabel('Adicionar Cargo').setCustomId('cargo-add'); row.addComponents(cargo) } else { cargo.setStyle(2).setLabel('Adicionar Cargo').setCustomId('cargo-add'); row.addComponents(cargo) }

    if (!guilddb.autorole.roles.length) { resetcargo.setStyle(4).setLabel('Resetar Cargos').setCustomId('cargo-resetar').setDisabled(true); row.addComponents(resetcargo) } else { resetcargo.setStyle(4).setLabel('Resetar Cargos').setCustomId('cargo-resetar').setDisabled(false); row.addComponents(resetcargo) }

    async function VerifyButtons() {

      guilddb = await client.guilddb.findOne({ IDs: message.guild.id });

      if (guilddb.autorole.status === false) { estado.setStyle(3).setLabel('Ativar').setCustomId('ativar'); } else { estado.setStyle(4).setLabel('Desativar').setCustomId('desativar'); }

      if (!guilddb.autorole.roles.length) { cargo.setStyle(1).setLabel('Adicionar Cargo').setCustomId('cargo-add'); } else { cargo.setStyle(2).setLabel('Adicionar Cargo').setCustomId('cargo-add'); }

      if (!guilddb.autorole.roles.length) { resetcargo.setStyle(4).setLabel('Resetar Cargos').setCustomId('cargo-resetar').setDisabled(true); } else { resetcargo.setStyle(4).setLabel('Resetar Cargos').setCustomId('cargo-resetar').setDisabled(false); }

    }
    const embed = {
      color: 3092790,
      author: {
        name: `${client.user.username}`,
        icon_url: `${client.user.displayAvatarURL({ display: true, size: 4096 })}`,
      },
      description: `Seja bem-vindo ao sistema de auto-roles.\nDúvidas? [Entre no nosso suporte!](${process.env.SUPORTE})`,
      thumbnail: {
        url: process.env.LOGO2,
      },
      fields: [{
        name: `Cargos no sistema:`,
        value: !guilddb.autorole.roles.length
          ? "`Nenhum Cargo`"
          : `${guilddb.autorole.roles.map((x) => `<@&${x}>`).join(", ")} - **[${guilddb.autorole.roles.length
          }]**`,
      },
      {
        name: `Status:`,
        value: `\`${guilddb.autorole.status ? "Ativado" : "Desativado"
          }\``,
      }],
      image: {
        url: process.env.IMG_AUTOROLE,
      },
      timestamp: new Date().toISOString(),
      footer: {
        text: `${message.author.tag}`,
        icon_url: `${message.author.displayAvatarURL({ format: "png" })}`,
      },
    };

    async function VerifyFields() {
      guilddb = await client.guilddb.findOne({ IDs: message.guild.id })

      embed.fields = [{
        name: `Cargos no sistema:`,
        value: !guilddb.autorole.roles.length
          ? "`Nenhum Cargo`"
          : `${guilddb.autorole.roles.map((x) => `<@&${x}>`).join(", ")} - **[${guilddb.autorole.roles.length
          }]**`,
      },
      {
        name: `Status:`,
        value: `\`${guilddb.autorole.status ? "Ativado" : "Desativado"
          }\``,
      }]
    }

    const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));

    message.reply({ embeds: [embed], components: [row] }).then(async (msg) => {
      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (i) => {

        if (i.user.id === message.author.id) {
          if (i.customId === "ativar") {

            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "autorole.status": true } })

            await VerifyButtons();
            await VerifyFields();

            msg.edit({ embeds: [embed], components: [row] })
            i.reply({ content: `${i.user}, sistema **ativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

          } else if (i.customId === "desativar") {

            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "autorole.status": false } })

            await VerifyButtons();
            await VerifyFields();

            msg.edit({ embeds: [embed], components: [row] })

            i.reply({ content: `${i.user}, sistema **desativado** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

          } else if (i.customId === "cargo-add") {

            const filter = m => m.author.id === message.author.id && m.mentions.roles.first() || m.guild.roles.cache.find((x) => x.id == m.content);
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
            i.reply({ content: `${i.user}, mencione um cargo que você deseja adicionar no sistema de **auto-roles**.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });


            collector.on('collect', async (m) => {

              let role = m.mentions.roles.first() || await m.guild.roles.cache.find((x) => x.id == m.content);

              if (guilddb.autorole.roles.length > 5) {
                return m.channel.send({ content: `${i.user}, o limite de cargos de **5** cargos no sistema foi atingido.` }).then(async (m) => { await sleep(10000); m.delete(); });
              } else if (guilddb.autorole.roles.find((x) => x === role.id)) {
                return m.channel.send({ content: `${i.user}, o cargo inserido já está no sistema.` }).then(async (m) => { await sleep(10000); m.delete(); });
              } else {

                await client.guilddb.updateOne({ IDs: message.guild.id }, { $push: { "autorole.roles": role.id } })

                await VerifyButtons();
                await VerifyFields();

                msg.edit({ embeds: [embed], components: [row] })
                m.channel.send({ content: `${i.user}, o cargo foi adicionado no sistema de **auto-roles** com sucesso.` }).then(async (m) => { await sleep(10000); m.delete(); });
              }

            });
          } else if (i.customId === "cargo-resetar") {

            await client.guilddb.updateOne({ IDs: message.guild.id }, { $set: { "autorole.roles": [] } })

            await VerifyButtons();
            await VerifyFields();

            msg.edit({ embeds: [embed], components: [row] })

            i.reply({ content: `${i.user}, os cargos do sistema foram **resetados** com sucesso.` }).then(async (m) => { await sleep(10000); i.deleteReply(); });

          }

        } else { i.deferUpdate(); }
      });

      collector.on('end', async (collected) => {

        await VerifyButtons();

        estado.setDisabled(true)
        cargo.setDisabled(true)
        resetcargo.setDisabled(true)

        msg.edit({ components: [row] })
      });

    })

  }
}