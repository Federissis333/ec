const { User, toMoney } = require(`${process.cwd()}/src/structures/MongoModels`);
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "blackjack",
        aliases: ["bj", "21"],
        description: "Jogue Blackjack e aposte seu dinheiro!",
        category: "economia",
        usage: "<aposta>",
    },
    permissions: null,
    owner: false,
    run: async (client, message, args) => {
        const bet = parseInt(args[0]);
        if (!bet || isNaN(bet) || bet <= 0) {
            return message.reply("Por favor, insira um valor válido para apostar.");
        }

        const userId = message.author.id;

        // Obter ou criar usuário no banco de dados
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ 
                userId, 
                economia: { money: 200 }, 
                gamesPlayed: 0, 
                gamesWon: 0 
            });
            await user.save();
        }

        if (user.economia.money < bet) {
            return message.reply("Você não tem saldo suficiente para essa aposta.");
        }

        // Função para criar o baralho
        const createDeck = () => {
            const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
            const suits = ["♠", "♥", "♦", "♣"];
            return values.flatMap(value => suits.map(suit => `${value}${suit}`));
        };

        // Função para calcular a pontuação
        const calculateScore = (hand) => {
            let score = 0;
            let aces = 0;

            hand.forEach(card => {
                const value = card.slice(0, -1);
                if (["J", "Q", "K"].includes(value)) {
                    score += 10;
                } else if (value === "A") {
                    aces += 1;
                    score += 11;
                } else {
                    score += parseInt(value);
                }
            });

            while (score > 21 && aces > 0) {
                score -= 10;
                aces -= 1;
            }
            return score;
        };

        // Início do jogo
        const deck = createDeck();
        const playerHand = [deck.splice(Math.random() * deck.length, 1)[0], deck.splice(Math.random() * deck.length, 1)[0]];
        const dealerHand = [deck.splice(Math.random() * deck.length, 1)[0], deck.splice(Math.random() * deck.length, 1)[0]];

        let playerScore = calculateScore(playerHand);
        let dealerScore = calculateScore(dealerHand);

        // Checar se o dealer já tem 21
        if (dealerScore === 21) {
            user.economia.money -= bet;
            user.gamesPlayed += 1;
            await user.save();
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Blackjack - Você perdeu!")
                        .setDescription(
                            `O dealer fez 21 imediatamente!\n\n` +
                            `**Sua mão:** ${playerHand.join(", ")} (Pontuação: ${playerScore})\n` +
                            `**Mão do dealer:** ${dealerHand.join(", ")} (Pontuação: ${dealerScore})\n\n` +
                            `Seu saldo atual: ${user.economia.money}`
                        ),
                ],
            });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Secondary)
            );

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Blackjack")
            .setDescription(
                `**Sua mão:** ${playerHand.join(", ")} (Pontuação: ${playerScore})\n` +
                `**Mão do dealer:** ${dealerHand.join(", ")} (Pontuação: ${dealerScore})`
            )
            .setFooter({ text: "Escolha uma ação: Hit (pegar carta) ou Stand (parar)." });

        const gameMessage = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = gameMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "hit") {
                playerHand.push(deck.splice(Math.random() * deck.length, 1)[0]);
                playerScore = calculateScore(playerHand);

                if (playerScore > 21) {
                    collector.stop("bust");
                } else {
                    await interaction.update({
                        embeds: [
                            embed.setDescription(
                                `**Sua mão:** ${playerHand.join(", ")} (Pontuação: ${playerScore})\n` +
                                `**Mão do dealer:** ${dealerHand.join(", ")} (Pontuação: ${dealerScore})`
                            ),
                        ],
                    });
                }
            } else if (interaction.customId === "stand") {
                collector.stop("stand");
            }
        });

        collector.on("end", async (_, reason) => {
            if (reason === "time") {
                return gameMessage.edit({
                    content: "Tempo esgotado! O jogo foi encerrado.",
                    components: [],
                });
            }

            while (dealerScore < 17) {
                dealerHand.push(deck.splice(Math.random() * deck.length, 1)[0]);
                dealerScore = calculateScore(dealerHand);
            }

            let result;
            if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
                result = "Você perdeu!";
                user.money -= bet;
            } else if (playerScore === dealerScore) {
                result = "Empate!";
            } else {
                result = "Você ganhou!";
                user.money += bet;
                user.gamesWon += 1;
            }

            user.gamesPlayed += 1;
            await user.save();

            await gameMessage.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("Resultado do Blackjack")
                        .setDescription(
                            `**Sua mão:** ${playerHand.join(", ")} (Pontuação: ${playerScore})\n` +
                            `**Mão do dealer:** ${dealerHand.join(", ")} (Pontuação: ${dealerScore})\n\n` +
                            `**${result}**\n` +
                            `Seu saldo atual: ${user.economia.money}`
                        ),
                ],
                components: [],
            });
        });
    },
};
