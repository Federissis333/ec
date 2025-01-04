
module.exports = {
  config: {
    name: "depositar",
    aliases: null,
    description: "Deposite seus coins no banco.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    let quantia = args[0];

    if (!quantia) return message.reply({ content: `${message.author}, você precisa especificar a quantidade que deseja depositar.` })

    if (quantia < 1 || isNaN(quantia) && quantia.toLowerCase() != "all") return message.reply(`${message.author}, você precisa especificar a quantidade que deseja depositar.`)

    let userdb = await client.userdb.findOne({ userID: message.author.id })

    if (!userdb || userdb.economia.money === 0) return message.reply({ content: `${message.author}, você não possui nenhum coin na conta.` })

    const usermoney = userdb.economia.money
    let dinheiro;

    if (quantia.toLowerCase() == "all") { dinheiro = usermoney } else {

      quantia = ~~quantia

      if (usermoney < quantia) return message.reply({ content: `${message.author}, você não possui toda essa quantia para depositar no momento, atualmente você só tem **${usermoney.toLocaleString()} coins**.` })

      dinheiro = quantia

    }

    const novosaldo = Number(userdb.economia.money) - Number(dinheiro);
    const novobanco = Number(userdb.economia.banco) + Number(dinheiro);

    await client.userdb.updateOne({ userID: message.author.id }, { $set: { "economia.money": novosaldo, "economia.banco": novobanco } })

    message.reply({ content: `${message.author}, você acaba de depositar **${dinheiro.toLocaleString()} coins** em seu banco.` })

  }
};
