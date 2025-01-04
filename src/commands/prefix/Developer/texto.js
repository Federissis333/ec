const { BoasVindas, Termos, Notificar } = require(`${process.cwd()}/src/functions/additional/texts.js`);

module.exports = {
  config: {
    name: "texto",
    aliases: null,
    category: "dev",
    description: 'Textos do serivor de suporte (parabéns por descobrir este comando).',
  },
  permissions: null,
  owner: true,
  run: async (client, message, args) => {

    const canal = message.mentions.channels.first() || message.guild.channels.cache.find((x) => x.id == args[1]) || message.channel;

    if (args[0] === null) return;

    if (["boasvindas"].includes(args[0]?.toLowerCase())) {
      BoasVindas(canal)
    }

    if (["termos"].includes(args[0]?.toLowerCase())) {
      Termos(canal)
    }

    if (["notificar"].includes(args[0]?.toLowerCase())) {
      Notificar(canal)
    }

  },
};