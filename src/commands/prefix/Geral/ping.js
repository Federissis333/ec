const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "ping",
    aliases: ["latencia", "latency", "latência"],
    category: "geral",
    description: 'Veja minha latência atual.',
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {


    const pingStart = process.hrtime();
    await client.guilddb.findOne({ IDs: client.user.id });
    const pingStop = process.hrtime(pingStart);

    const dbping = Math.round(((pingStop[0] * 1e9) + pingStop[1]) / 1e6);

    const bahzin = await message.reply({ content: `Carregando...`, fetchReply: true });
    const wsPing = Math.round(client.ws.ping);

    let pingContent = `📡 Gateaway \`${wsPing}ms\`\n⚡ API \`${bahzin.createdTimestamp - message.createdTimestamp}ms\`\n🌱 Database \`${dbping}ms\``;

    setTimeout(() => { bahzin.edit({ content: `${pingContent}` }); }, 1000);

  },
};
