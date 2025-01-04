const client = require(`${process.cwd()}/index.js`);
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  name: "Random.js"
};

client.once('ready', async () => {
  setInterval(async () => {
     await VerifyRandom(); 
  }, 15000);
});

async function VerifyRandom() {
  const list_mutes = await require("mongoose")
    .connection.collection("guilds")
    .find({ "random.status2": { $gt: 1 } })
    .toArray(); // Pega todos os servidores que tem alguém mutado;

  if (!list_mutes.length) return;

  const filter = Object.entries(list_mutes).map(([, x]) => x.IDs);

  if (!filter.length) return;

  const LIST = filter // Faz o mapeamento dos servidores que tem alguém com o mute menor que o tempo de agora;

  await Random(LIST);
}

async function Random(LIST) {

  try {

    let randomUser = client.users.cache.filter(a => !a.bot).filter(a => a.avatarURL({ dynamic: true })).random();

    const { body } = await request(`https://japi.rest/discord/v1/user/${randomUser.id}`);
    const user = await body.json();
    const banner = user.data.bannerURL + '?size=4096'

    LIST.map(async (x) => {

      const guilddb = await client.guilddb.findOne({ IDs: x })
      const randomgif = await guilddb.random.gif;
      const randomicon = await guilddb.random.icon;
      const randombanner = await guilddb.random.banner;

      if (banner === 'null?size=4096') { } else if (banner === 'undefined?size=4096') { } else {
        client.channels?.cache?.get(randombanner)?.send({ embeds: [new EmbedBuilder().setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) }).setColor(process.env.COLOR).setFooter({ text: `Usuário: ${randomUser.id}` }).setImage(banner)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`Baixar Banner`).setStyle(5).setURL(banner))] })

      };

      if (randomUser.avatarURL({ dynamic: true, size: 1024 }).split("?")[0].endsWith(".gif")) {
        if (!client.channels.cache.get(randomgif)) return;
        client.channels?.cache?.get(randomgif)?.send({ embeds: [new EmbedBuilder().setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) }).setColor(process.env.COLOR).setFooter({ text: `Usuário: ${randomUser.id}` }).setImage(randomUser.avatarURL({ dynamic: true, size: 1024 }))], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`Baixar Gif`).setStyle(5).setURL(randomUser.avatarURL({ dynamic: true, size: 4096 })))] })
      } else {
        if (!client.channels.cache.get(randomicon)) return;
        client.channels?.cache?.get(randomicon)?.send({ embeds: [new EmbedBuilder().setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) }).setColor(process.env.COLOR).setFooter({ text: `Usuário: ${randomUser.id}` }).setImage(randomUser.avatarURL({ dynamic: true, size: 1024 }))], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`Baixar Ícone`).setStyle(5).setURL(randomUser.avatarURL({ dynamic: true, size: 4096 })))] })
      }

    })


  } catch (err) {
  }

}