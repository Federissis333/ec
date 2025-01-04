const { PermissionsBitField, parseEmoji } = require('discord.js');
const { parse } = require('twemoji-parser');

module.exports = {
  config: {
    name: "addemoji",
    aliases: null,
    description: "Adicione um emoji no servidor.",
    category: "moderação",
    usage: "addemoji [emoji]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let guilddb = await client.guilddb.findOne({ IDs: message.guild.id }) || { prefix: process.env.PREFIX }
    let prefix = guilddb.prefix

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
      return await message.reply({ content: `${message.author}, você precisa da permissão de **Gerenciar Emojis e Stickers** para executar esta função.`, ephemeral: true });
    } else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Gerenciar Emojis e Stickers** para executar esta função.`, ephemeral: true });

    const emojii = args[0];
    const name = args.slice(1).join(" ");

    if (!emojii) return message.reply(`${message.author}, comando inválido utilize: \`${prefix}addemoji <emoji>\``);

    const z = parseEmoji(emojii)
    var emoji;
    if (z.id == null) return message.reply({ content: `${message.author}, emoji inválido.`, emphemeral: true })
    if (z.id !== null) emoji = emojii
    if (emoji) {

      let customemoji = parseEmoji(emoji);
      var nomeemoji;
      if (!name) { nomeemoji = parseEmoji(emoji).name } else {
        if (name) nomeemoji = name.replace(/[^a-z0-9]/gi, "")
        if (name.length > 32) return message.reply({ content: `${message.author}, o nome inserido é muito grande, o limite de caracteres é de **32**.` });
      }

      if (customemoji.id) {
        if (customemoji.animated) {
          const config = { NONE: 50, TIER_1: 100, TIER_2: 150, TIER_3: 250 }
          const tcount = config[message.guild.premiumTier];
          let emojis = message.guild.emojis.cache.filter(emoji => emoji.animated).size


          if (emojis >= tcount) return message.reply({ content: `${message.author}, eu não consigo adicionar mais emojis ao seu servidor pois ele atingiu o limite de \`${tcount}\` emojis.` });

          const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${customemoji.animated ? 'gif' : 'png'}`;

          message.guild.emojis.create({ attachment: `${Link}`, name: `${nomeemoji}` }).then((emoji) => {
            return message.reply({ content: `${message.author}, ${emoji} foi adicionado ao servidor.` });

          })

        } else {
          const config = { NONE: 50, TIER_1: 100, TIER_2: 150, TIER_3: 250 }
          const tcount = config[message.guild.premiumTier];
          let emojis = message.guild.emojis.cache.filter(emoji => !emoji.animated).size

          if (emojis >= tcount) return message.reply({ content: `${message.author}, eu não consigo adicionar mais emojis ao seu servidor pois ele atingiu o limite de \`${tcount}\` emojis.` });

          const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${customemoji.animated ? 'gif' : 'png'}`;

          message.guild.emojis.create({ attachment: `${Link}`, name: `${nomeemoji}` }).then((emoji) => {

            return message.reply({ content: `${message.author}, ${emoji} foi adicionado ao servidor.` });

          })

        }

      } else {
        let CheckEmoji = parse(emoji, { assetType: 'png' });
        if (!CheckEmoji[0]) return message.reply({ content: `${message.author}, ${emoji} foi adicionado ao servidor.` });

        message.reply({ content: `${message.author}, este emoji já esta no servidor.` });

      }

    } else if (!emoji && !img) {

      return message.reply({ content: `${message.author}, não encontrei nenhum link ou iamge para adicionar o emoji.` });

    } else {

      if (!emoji) return message.reply({ content: `${message.author}, você precisa inserir um nome para o emoji.` });

      if (img.size > 256000) {

        return message.reply({ content: `${message.author}, o arquivo é muito grande, adicione emojis de até \`256kb\`.` });

      }


      if (img.name.split('.')[1] == 'gif') {
        const config = { NONE: 50, TIER_1: 100, TIER_2: 150, TIER_3: 250 }
        const tcount = config[message.guild.premiumTier];
        let emojis = message.guild.emojis.cache.filter(emoji => emoji.animated).size

        if (emojis >= tcount) return message.reply({ content: `${message.author}, eu não consigo adicionar mais emojis ao seu servidor pois ele atingiu o limite de \`${tcount}\` emojis.` });


        message.guild.emojis.create({ attachment: `${img.url}`, name: `${emoji}` }).then((emoji) => {

          return message.reply({ content: `${message.author}, ${emoji} foi adicionado ao servidor.` });

        })

      } else if (img.name.split('.')[1] == 'png' || img.name.split('.')[1] == 'jpg' || img.name.split('.')[1] == 'jpeg') {

        const config = { NONE: 50, TIER_1: 100, TIER_2: 150, TIER_3: 250 }

        const tcount = config[message.guild.premiumTier];
        let emojis = message.guild.emojis.cache.filter(emoji => !emoji.animated).size

        if (emojis >= tcount) return message.reply({ content: `${message.author}, eu não consigo adicionar mais emojis ao seu servidor pois ele atingiu o limite de \`${tcount}\` emojis.` });

        message.guild.emojis.create({ attachment: `${img.url}`, name: `${emoji}` }).then((emoji) => {

          return message.reply({ content: `${message.author}, ${emoji} foi adicionado ao servidor.` });
        })
      } else {

        return message.reply({ content: `${message.author}, formato inválido.` });
      }

    }

  }
}