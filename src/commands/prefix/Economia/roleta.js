const { User } = require(`${process.cwd()}/src/structures/MongoModels`);

module.exports = {
    config: {
        name: "roleta",
        aliases: ["roulette"],
        description: "Aposte na roleta!",
        category: "economia",
        usage: "<cor> <aposta> (cores: vermelho, preto, verde)",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        const corEscolhida = args[0]?.toLowerCase();
        const aposta = parseInt(args[1]);

        if (!["vermelho", "preto", "verde"].includes(corEscolhida)) {
            return message.reply("Escolha uma cor válida: `vermelho`, `preto` ou `verde`.");
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

        const roleta = Math.random();
        let corResultado;
        let multiplicador;

        if (roleta < 0.47) {
            corResultado = "vermelho";
            multiplicador = 2;
        } else if (roleta < 0.94) {
            corResultado = "preto";
            multiplicador = 2;
        } else {
            corResultado = "verde";
            multiplicador = 14;
        }

        if (corEscolhida === corResultado) {
            const ganho = aposta * multiplicador;
            usuario.economia.money += ganho;
            await usuario.save();
            return message.reply(`🎡 A roleta parou em **${corResultado}**! Você ganhou ${ganho} moedas.`);
        } else {
            usuario.economia.money -= aposta;
            await usuario.save();
            return message.reply(`🎡 A roleta parou em **${corResultado}**! Você perdeu ${aposta} moedas.`);
        }
    },
};
