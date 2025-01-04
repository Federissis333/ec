const User = require("../../../structures/MongoModels");

module.exports = {
    config: {
        name: "loteria",
        aliases: ["lottery"],
        description: "Compre um bilhete de loteria e tente a sorte!",
        category: "economia",
        usage: "!loteria <quantidade>",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        const valor = parseInt(args[0]);

        if (isNaN(valor) || valor <= 0) {
            return message.reply("⚠️ Insira um valor válido para comprar bilhetes.");
        }

        try {
            // Obtém ou cria o documento do usuário no banco
            const userdb = await client.userdb.findOne({ userID: message.author.id }) || {
                economia: { ruby: 0, banco: 0, money: 0, sujo: 0, sobremim: `null`, marry: { casado: false, user: null, time: 0 } },
                icon: null, color: null, emblemas: {}, infos: { xp: 0, level: 0, rep: 0 }
            };

            // Verifica se o usuário tem moedas suficientes
            if (userdb.economia.money < valor) {
                return message.reply("❌ Você não tem moedas suficientes para comprar bilhetes.");
            }

            // Deduz o valor do bilhete do saldo do usuário
            userdb.economia.money -= valor;

            // 10% de chance de ganhar
            const chanceDeGanhar = Math.random() < 0.1;
            const premio = valor * 10;

            if (chanceDeGanhar) {
                userdb.economia.money += premio;
                await userdb.save();
                message.reply(`🎉 Parabéns! Você ganhou **${premio} moedas**!`);
            } else {
                await userdb.save();
                message.reply(`😢 Você não ganhou desta vez. Perdeu **${valor} moedas**.`);
            }
        } catch (error) {
            console.error("❌ Erro ao processar a loteria:", error.message);
            message.reply("❌ Ocorreu um erro ao realizar a compra do bilhete. Tente novamente mais tarde.");
        }
    },
};
