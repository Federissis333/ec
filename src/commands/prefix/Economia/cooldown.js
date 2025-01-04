const { EmbedBuilder } = require('discord.js');
const { toMoney, toTime, VerifyUserLevel } = require(`${process.cwd()}/src/structures/Functions.js`);

module.exports = {
  config: {
    name: "cooldown",
    aliases: ["cd"],
    description: "Veja o cooldown dos comandos.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let userdb = await client.userdb.findOne({
      userID: message.author.id
    })

    if (!userdb) userdb = await new client.userdb({ userID: message.author.id }).save();

    let daily = userdb.cooldowns.daily - Date.now();
    let semanal = userdb.cooldowns.semanal - Date.now();
    let mensal = userdb.cooldowns.mensal - Date.now();
    let trabalhar = userdb.cooldowns.work - Date.now();
    let fofocar = userdb.cooldowns.fofocar - Date.now();
    let gf = userdb.cooldowns.gf - Date.now();

    if (Date.now() < userdb.cooldowns.daily) { daily = `${toTime(daily)}`; } else { daily = "Liberado." }

    if (Date.now() < userdb.cooldowns.semanal) { semanal = `${toTime(semanal)}`; } else { semanal = "Liberado." }

    if (Date.now() < userdb.cooldowns.mensal) { mensal = `${toTime(mensal)}`; } else { mensal = "Liberado." }

    if (Date.now() < userdb.cooldowns.work) { trabalhar = `${toTime(trabalhar)}`; } else { trabalhar = "Liberado." }

    if (Date.now() < userdb.cooldowns.fofocar) { fofocar = `${toTime(fofocar)}`; } else { fofocar = "Liberado." }

    if (Date.now() < userdb.cooldowns.gf) { gf = `${toTime(gf).hours}`; } else { gf = "Liberado." }

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
      .setColor(process.env.COLOR1)
      .setDescription(`\`Cooldowns de ${message.author.tag}\``)
      .addFields({ name: 'Daily', value: `${daily}` })
      .addFields({ name: 'Semanal', value: `${semanal}` })
      .addFields({ name: 'Mensal', value: `${mensal}` })
      .addFields({ name: 'Trabalhar', value: `${trabalhar}` })
      .addFields({ name: 'Fofocar', value: `${fofocar}` })
      .addFields({ name: 'GF', value: `${gf}` })
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: "png" })}` })

    message.reply({ embeds: [embed] })

  },
};

