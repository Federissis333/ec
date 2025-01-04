const { ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");

module.exports = {
    config: {
        name: "caça-tesouro",
        aliases: ["tesouro", "caçar"],
        description: "Participe da caça ao tesouro e descubra prêmios!",
        category: "economia",
        usage: "!caça-tesouro",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        // Definindo os prêmios possíveis
        const premios = [
            { nome: "100 moedas", valor: 100 },
            { nome: "500 moedas", valor: 500 },
            { nome: "Aumentar sua sorte (10%)", valor: "sorte" },
            { nome: "Nada... A caça falhou!", valor: 0 }
        ];

        // Sorteando um prêmio
        const premioSorteado = premios[Math.floor(Math.random() * premios.length)];

        if (premioSorteado.valor === 0) {
            message.reply("A caça ao tesouro não deu em nada! Tente novamente.");
        } else {
            message.reply(`🎉 Parabéns! Você encontrou **${premioSorteado.nome}**!`);
            // Aqui você pode adicionar o prêmio ao saldo do usuário ou algum outro efeito
        }
    },
};
