const client = require(`${process.cwd()}/index.js`);
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
  name: "Contador-call.js"
};

client.on('ready', async () => {
  setInterval(async () => {
    await VerifyContadorCall(); 
  }, 60000);
});

async function VerifyContadorCall() {

  const list_mutes = await require("mongoose").connection.collection("guilds").find({ "contador.status2": { $gt: 1 } }).toArray(); // Pega todos os servidores que tem alguém mutado;

  if (!list_mutes.length) return;

  const filter = Object.entries(list_mutes).map(([, x]) => x.IDs);


  if (!filter.length) return;

  const LIST = filter // Faz o mapeamento dos servidores que tem alguém com o mute menor que o tempo de agora;

  await Random(LIST);
}

async function Random(LIST) {

  try {

    LIST.map(async (x) => {
      try {
        const guilddb = await client.guilddb.findOne({ IDs: x })
        const canal = await guilddb.contador.channel;
        const msg = await guilddb.contador.msg;
        const server = client.guilds.cache.get(guilddb.IDs)
        const voiceChannels = server.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        let membroscall = 0;
        await voiceChannels.forEach(c => membroscall += c.members.size);

        if (canal) {
          let call = client.channels.cache.get(canal);
          call.setName(msg.replace(/{contador}/g, `${membroscall}`))

        }
      } catch (err) {

      }
    });
  } catch (err) {

  }

}