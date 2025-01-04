const { User } = require(`${process.cwd()}/src/structures/MongoModels`);

module.exports = {
    config: {
        name: "coinflip",
        aliases: ["flip", "caraoucoroa"],
        description: "Aposte cara ou coroa!",
        category: "economia",
        usage: "<cara/coroa> <aposta>",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        const escolha = args[0]?.toLowerCase();
        const aposta = parseInt(args[1]);

        if (!["cara", "coroa"].includes(escolha)) {
            return message.reply("Escolha entre `cara` ou `coroa`.");
        }
        if (!aposta || aposta <= 0) {
            return message.reply("Insira um valor válido para apostar.");
        }

        // Busca ou cria o usuário no banco de dados
        let usuario = await User.findOne({ userID: message.author.id });
        if (!usuario) {
            usuario = new User({ userID: message.author.id, economia: { money: 0 } });
            await usuario.save();
        }

        if (usuario.economia.money < aposta) {
            return message.reply("Você não tem dinheiro suficiente para apostar!");
        }

        const resultado = Math.random() < 0.5 ? "cara" : "coroa";
        if (resultado === escolha) {
            usuario.economia.money += aposta;
            await usuario.save();
            return message.reply(`🪙 Deu **${resultado}**! Você ganhou ${aposta} moedas.`);
        } else {
            usuario.economia.money -= aposta;
            await usuario.save();
            return message.reply(`🪙 Deu **${resultado}**! Você perdeu ${aposta} moedas.`);
        }
    },
};
