const client = require(`${process.cwd()}/index.js`);
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, WebhookClient, ButtonStyle, TextInputBuilder, ModalBuilder, ChannelType, TextInputStyle } = require('discord.js');

module.exports = {
  name: "Instagram.js"
};

client.on('interactionCreate', async (interaction) => {

  try {

    const dbGuild = await client.guilddb.findOne({ IDs: interaction.guild.id, });
    if (!dbGuild) {
      const newguild = new client.guilddb({ IDs: interaction.guild.id });
      await newguild.save();
      dbGuild = await client.guilddb.findOne({ IDs: interaction.guild.id });
    } else { }


    // Ver Comentarios
    if (interaction.customId === 'verComents') {
      const fotoDb = await client.instadb.findOne({ _id: interaction.message.id });
      if (!fotoDb) return;

      const embedComent = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR1)
        .setDescription(fotoDb.comentariosFoto.join('\n') || `Sem comentários.`)
        .setTitle(`Comentários da postagem [${fotoDb.comentariosFoto.length}]`)

      interaction.reply({ embeds: [embedComent], ephemeral: true })
    }

    // Ver Likes
    if (interaction.customId === 'verLikes') {
      const fotoDb = await client.instadb.findOne({ _id: interaction.message.id });
      if (!fotoDb) return;

      const embedComent = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setColor(process.env.COLOR1)
        .setDescription(fotoDb.curtidoresFoto.join('\n') || `Sem likes.`)
        .setTitle(`Likes da postagem [${fotoDb.curtidoresFoto.length}]`)

      interaction.reply({ embeds: [embedComent], ephemeral: true })
    }

    // Realizar um Comentario
    if (interaction.customId === 'comentInsta') {
      const modalComent = new ModalBuilder()
        .setCustomId('modalComent')
        .setTitle(`Comentando na Foto`)
      const modalPergunta = new TextInputBuilder()
        .setCustomId('comentInsta')
        .setLabel('Coloque abaixo seu comentário para a foto.')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(80)

      const rowComent = new ActionRowBuilder().addComponents(modalPergunta)
      modalComent.addComponents(rowComent)
      interaction.showModal(modalComent);
    }

    // Apagar Foto
    if (interaction.customId === 'deletarFoto') {
      let fotoDb = await client.instadb.findOne({ _id: interaction.message.id });
      if (!fotoDb) return;

      if (interaction.user.id !== fotoDb.autorFoto) {
        interaction.reply({ content: `Você não é o autor dessa foto para remover ela.`, ephemeral: true })
      } else {
        await interaction.message.delete()
      }
    };

    // Dar Likes Fotos
    if (interaction.customId === 'likeInsta') {
      let fotoDb = await client.instadb.findOne({ _id: interaction.message.id });
      if (!fotoDb) return;

      const guildDb = await client.guilddb.findOne({ IDs: interaction.guild.id });
      const whInsta = new WebhookClient({ url: guildDb.insta.webhook });

      if (fotoDb.curtidoresFoto.includes(`<@!${interaction.user.id}>`)) {

        const rowLikeR = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('likeInsta')
            .setEmoji(process.env.InstaEmoji_Like)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`${fotoDb.likesFoto - 1}`),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('comentInsta')
            .setLabel(`${fotoDb.comentsFoto}`)
            .setEmoji(process.env.InstaEmoji_Coment),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verLikes')
            .setEmoji(process.env.InstaEmoji_VerLikes),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verComents')
            .setEmoji(process.env.InstaEmoji_VerComents),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('deletarFoto')
            .setEmoji(process.env.InstaEmoji_Delete)
        )

        await whInsta.editMessage(interaction.message.id, { components: [rowLikeR] })

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $set: { "likesFoto": fotoDb.likesFoto - 1 } });

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $pull: { "curtidoresFoto": `<@!${interaction.user.id}>` } })

        interaction.reply({ content: `Sua curtida foi removida desta postagem.`, ephemeral: true })
      } else {
        let likesFoto = fotoDb.likesFoto;
        likesFoto += 1;

        const rowLikeA = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('likeInsta')
            .setEmoji(process.env.InstaEmoji_Like)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`${likesFoto}`),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('comentInsta')
            .setLabel(`${fotoDb.comentsFoto}`)
            .setEmoji(process.env.InstaEmoji_Coment),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verLikes')
            .setEmoji(process.env.InstaEmoji_VerLikes),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verComents')
            .setEmoji(process.env.InstaEmoji_VerComents),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('deletarFoto')
            .setEmoji(process.env.InstaEmoji_Delete)
        )

        await whInsta.editMessage(interaction.message.id, { components: [rowLikeA] })

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $set: { "likesFoto": fotoDb.likesFoto + 1 } })

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $push: { "curtidoresFoto": `<@!${interaction.user.id}>` } })

        interaction.reply({ content: `Postagem curtida com sucesso.`, ephemeral: true })
      }
    }

    // Pegar conteúdo do Modal de comentar numa foto.
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'modalComent') {
        const comentFoto = interaction.fields.getTextInputValue('comentInsta')

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $push: { "comentariosFoto": `<@${interaction.user.id}>: ${comentFoto}` } });

        let fotoDb = await client.instadb.findOne({ _id: interaction.message.id });

        await client.instadb.findOneAndUpdate(
          { _id: interaction.message.id },
          { $set: { "comentsFoto": fotoDb.comentsFoto + 1 } });

        const guildDb = await client.guilddb.findOne({ IDs: interaction.guild.id });
        const whInsta = new WebhookClient({ url: guildDb.insta.webhook });
        fotoDb = await client.instadb.findOne({ _id: interaction.message.id });

        const rowLikeR = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('likeInsta')
            .setEmoji(process.env.InstaEmoji_Like)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`${fotoDb.likesFoto}`),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('comentInsta')
            .setLabel(`${fotoDb.comentsFoto}`)
            .setEmoji(process.env.InstaEmoji_Coment),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verLikes')
            .setEmoji(process.env.InstaEmoji_VerLikes),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verComents')
            .setEmoji(process.env.InstaEmoji_VerComents),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('deletarFoto')
            .setEmoji(process.env.InstaEmoji_Delete)
        )

        await whInsta.editMessage(interaction.message.id, { components: [rowLikeR] })

        interaction.reply({ content: `Seu comentário foi publicado.`, ephemeral: true })
      }
    }

  } catch (err) { }

})

client.on('messageCreate', async (message) => {

  try {

    if (message?.author?.bot) return;
    if (!message?.guild) return;

    const dbGuild = await client.guilddb.findOne({ IDs: message.guild.id, });
    if (!dbGuild) {
      const newguild = new client.guilddb({ IDs: message.guild.id });
      await newguild.save();
      dbGuild = await client.guilddb.findOne({ IDs: message.guild.id });
    } else { }

    if (dbGuild.insta.status === true) {
      if (message.channel.id === dbGuild.insta.canal) {

        if (message.attachments.size === 0) return await message.delete();

        await message.delete()

        const rowInsta = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('likeInsta')
            .setLabel('0')
            .setEmoji(process.env.InstaEmoji_Like),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('comentInsta')
            .setLabel('0')
            .setEmoji(process.env.InstaEmoji_Coment),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verLikes')
            .setEmoji(process.env.InstaEmoji_VerLikes),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('verComents')
            .setEmoji(process.env.InstaEmoji_VerComents),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('deletarFoto')
            .setEmoji(process.env.InstaEmoji_Delete)
        )

        const webhooks = await message.channel.fetchWebhooks();
        const webhook = webhooks.find(wh => wh.token === dbGuild.insta.whtoken);

        if (!webhook) {
          const whCreate = await message.channel.createWebhook({ name: client.user.username, avatar: client.user.avatarURL() })
          await client.guilddb.findOneAndUpdate(
            { IDs: message.guild.id },
            { $set: { "insta.webhook": whCreate.url, "insta.whtoken": whCreate.token } });

          const whInsta = new WebhookClient({ url: whCreate.url })

          await whInsta.send({
            username: message.author.username, avatarURL: message.author.displayAvatarURL({ dynamyc: true }),
            content: `> ${message.author}.`,
            components: [rowInsta],
            files: [{ attachment: message.attachments.first().url }]
          }).then(async (x) => { await client.instadb.create({ _id: x.id, autorFoto: message.author.id }) })
        } else {
          const whInsta = new WebhookClient({ url: webhook.url })

          await whInsta.send({
            username: message.author.username, avatarURL: message.author.displayAvatarURL({ dynamyc: true }),
            content: `> ${message.author}.`,
            components: [rowInsta],
            files: [{ attachment: message.attachments.first().url }]
          }).then(async (x) => { await client.instadb.create({ _id: x.id, autorFoto: message.author.id }) })
        }

      }
    }
  } catch (err) {

  }

})