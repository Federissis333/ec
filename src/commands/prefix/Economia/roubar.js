module.exports = {
  config: {
    name: "roubar",
    aliases: null,
    description: "Roube coins de outro usuário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const membro = message.author;
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      return message.reply({ content: "Você precisa mencionar um usuário para roubar." });
    }

    if (user.id === membro.id) {
      return message.reply({ content: "Você não pode roubar de si mesmo." });
    }

    const memberdb = await client.userdb.findOne({ userID: membro.id });
    const userdb = await client.userdb.findOne({ userID: user.id });

    if (!memberdb.economia.licenca) {
      return message.reply({ content: "Você precisa de uma licença de armas para roubar." });
    }

    const armasDisponiveis = ["arma", "faca", "arma de alto calibre"];
    const inventario = memberdb.economia.inventario || [];
    const possuiArma = inventario.some((item) => armasDisponiveis.includes(item));

    if (!possuiArma) {
      return message.reply({ content: "Você precisa de uma arma ou faca no seu inventário para roubar." });
    }

    // Verificar se o usuário tem dinheiro disponível para ser roubado
    if (userdb.economia.money <= 0) {
      return message.reply({ content: `${user.tag} não possui dinheiro disponível para ser roubado.` });
    }

    const chance = Math.random() < 0.5;
    const valorRoubado = Math.floor(Math.random() * (5000 - 1000) + 1000);

    if (chance) {
      await client.userdb.updateOne({ userID: membro.id }, { $inc: { "economia.money": valorRoubado } });
      await client.userdb.updateOne({ userID: user.id }, { $inc: { "economia.money": -valorRoubado } });

      message.reply({ content: `Você roubou **${valorRoubado.toLocaleString()} coins** de ${user.tag}!` });
    } else {
      message.reply({ content: `Você foi pego tentando roubar de ${user.tag} e perdeu a chance!` });
    }
  },
};