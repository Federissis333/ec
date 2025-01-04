module.exports = {
  config: {
    name: "inventario",
    aliases: ["inventário"],
    description: "Veja os itens no seu inventário.",
    category: "economia",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message) => {
    const membro = message.author;
    const userdb = await client.userdb.findOne({ userID: membro.id });

    const inventario = userdb.economia.inventario || [];
    if (inventario.length === 0) {
      return message.reply({ content: "Seu inventário está vazio." });
    }

    message.reply({
      content: `Seus itens no inventário:\n- ${inventario.join("\n- ")}`,
    });
  },
};
