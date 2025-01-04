const { User } = require(`${process.cwd()}/src/structures/MongoModels`);

module.exports = {
    config: {
        name: "slots",
        aliases: ["caça-niquel"],
        description: "Jogue no caça-níquel e tente ganhar dinheiro!",
        category: "economia",
        usage: "<aposta>",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        const aposta = parseInt(args[0]);
        if (!aposta || aposta <= 0) return message.reply("Insira um valor válido para apostar!");

        // Busca o usuário no banco de dados
        let usuario = await User.findOne({ userID: message.author.id });
        if (!usuario) {
            usuario = new User({ userID: message.author.id, economia: { money: 0 } });
            await usuario.save();
        }

        if (usuario.economia.money < aposta) {
            return message.reply("Você não tem dinheiro suficiente para apostar!");
        }

        const rolos = ["🍒", "🍋", "🍊", "⭐", "💎"];
        const resultado = [
            rolos[Math.floor(Math.random() * rolos.length)],
            rolos[Math.floor(Math.random() * rolos.length)],
            rolos[Math.floor(Math.random() * rolos.length)],
        ];

        let ganho = 0;
        if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
            ganho = aposta * 5;
        } else if (resultado[0] === resultado[1] || resultado[1] === resultado[2]) {
            ganho = aposta * 2;
        }

        if (ganho > 0) {
            usuario.economia.money += ganho;
            await usuario.save();
            return message.reply(`🎰 | ${resultado.join(" ")} - Você ganhou ${ganho} moedas!`);
        } else {
            usuario.economia.money -= aposta;
            await usuario.save();
            return message.reply(`🎰 | ${resultado.join(" ")} - Você perdeu ${aposta} moedas.`);
        }
    },
};
