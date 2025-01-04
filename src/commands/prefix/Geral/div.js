const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  config: {
    name: "div",
    aliases: null,
    description: "Veja a divulgação de um usuário.",
    category: "geral",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, eu preciso da permissão de **Gerenciar Servidor** para executar esta função.`, ephemeral: true });

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    var codes = [""];

    message.guild.invites.fetch().then(invites => {

      let personalInvites = invites.filter(i => i.inviter.id === user.id);
      let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
      invites.forEach(invite => {
        if (invite.inviter === user) {
          codes.push(`${invite.code} \`${invite.uses}\``);
        }
      });

      const embed = new EmbedBuilder()
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setColor(process.env.COLOR1)
        .setAuthor({ name: `${message.author.tag}`, iconURL: user.displayAvatarURL({ dynamic: true, size: 512 }) })
        .setDescription(`Convidados: \`${Number(inviteCount)}\`\nTotal no Servidor: \`${message.guild.memberCount}\``)
        .setFooter({ text: `Requisitado por: ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })


      if (codes == '') { } else {
        embed.addFields({ name: `Lista de Convites:`, value: `${codes.join("\nhttps://discord.gg/")}`, inline: false })


        return message.reply({ embeds: [embed] });

      }
    })



  },
};