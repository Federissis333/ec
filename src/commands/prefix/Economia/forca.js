const { Message, EmbedBuilder } = require("discord.js");
const { words } = require(`${process.cwd()}/src/structures/palavras.js`);
const maxAttempts  = 6; // Número máximo de erros permitidos
let wordToGuess, maskedWord, attemptsLeft, guessedLetters, incorrectLetters;

module.exports = {
  config: {
    name: "forca",
    aliases: ["forca"],
    description: "Jogue um jogo de Forca com perdas de tentativas.",
    category: "diversao",
    usage: "forca",
  },
  permissions: null,
  owner: false,
  run: async (client, message) => {
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase(); // Escolhe uma palavra aleatória
    maskedWord = "_".repeat(wordToGuess.length); // Mascara a palavra
    attemptsLeft = maxAttempts; // Define o número máximo de tentativas
    guessedLetters = []; // Letras já adivinhadas
    incorrectLetters = []; // Letras erradas

    const startEmbed = new EmbedBuilder()
      .setTitle("Jogo da Forca")
      .setColor("#FFD700")
      .setDescription(this.getDisplayWord())
      .addFields([
        { name: "Letras Erradas", value: incorrectLetters.join(", ") || "Nenhuma" },
        { name: "Tentativas restantes", value: `${attemptsLeft}/${maxAttempts}` },
      ])
      .setFooter("Digite uma letra para tentar adivinhar.");

    const msg = await message.channel.send({ embeds: [startEmbed] });

    const filter = response => {
      return response.author.id === message.author.id && /^[a-z]$/i.test(response.content) && !guessedLetters.includes(response.content.toLowerCase());
    };

    const collector = message.channel.createMessageCollector({ filter, time: 60000 }); // Coletor com tempo limite de 1 minuto

    collector.on("collect", async (response) => {
      const guess = response.content.toLowerCase();
      guessedLetters.push(guess);

      if (wordToGuess.includes(guess)) {
        // Se a letra estiver na palavra
        maskedWord = this.updateMaskedWord(guess);
      } else {
        // Se a letra não estiver na palavra
        attemptsLeft--;
        incorrectLetters.push(guess);
      }

      const guessedRight = maskedWord.split("").join(" ");
      if (!maskedWord.includes("_")) {
        // Se a palavra for completamente adivinhada
        collector.stop("won");
      } else if (attemptsLeft <= 0) {
        collector.stop("lost");
      }

      const updateEmbed = new EmbedBuilder()
        .setTitle("Jogo da Forca")
        .setColor(attemptsLeft <= 0 ? "#FF0000" : "#FFD700")
        .setDescription(this.getDisplayWord())
        .addFields([
          { name: "Letras Erradas", value: incorrectLetters.join(", ") || "Nenhuma" },
          { name: "Tentativas restantes", value: `${attemptsLeft}/${maxAttempts}` },
        ])
        .setFooter("Digite uma letra para tentar adivinhar.");

      msg.edit({ embeds: [updateEmbed] });
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "won") {
        const winEmbed = new EmbedBuilder()
          .setTitle("Parabéns! Você venceu!")
          .setColor("#00FF00")
          .setDescription(`A palavra era **${wordToGuess}**.`);

        msg.edit({ embeds: [winEmbed] });
      } else if (reason === "lost") {
        const loseEmbed = new EmbedBuilder()
          .setTitle("Que pena! Você perdeu.")
          .setColor("#FF0000")
          .setDescription(`A palavra era **${wordToGuess}**.`);

        msg.edit({ embeds: [loseEmbed] });
      }
    });
  },

  // Função para exibir a palavra mascarada e o personagem com emojis
  getDisplayWord() {
    let displayWord = maskedWord.split("").map((char, idx) => (char !== "_" ? char : "_")).join(" ");
    displayWord += "\n" + this.getEmojiHangman(attemptsLeft); // Adiciona o personagem da forca com emojis
    return displayWord;
  },

  // Função para atualizar a palavra mascarada
  updateMaskedWord(guess) {
    let updatedWord = maskedWord.split(""); // Converte a palavra mascarada em array
    for (let i = 0; i < wordToGuess.length; i++) {
      if (wordToGuess[i] === guess) {
        updatedWord[i] = guess; // Substitui o "_" pela letra adivinhada
      }
    }
    return updatedWord.join(""); // Retorna a palavra mascarada atualizada
  },

  // Função para exibir o personagem da forca com emojis
  getEmojiHangman(fails) {
    const stages = [
      "```⬜⬜⬜⬜⬜```", // Personagem inicial
      "```⬜⬜⬜⬜❌```", // 1 erro
      "```⬜⬜⬜🧠❌```", // 2 erros
      "```⬜⬜⬜🤖❌```", // 3 erros
      "```⬜⬜🧙❌```", // 4 erros
      "```⬜🧑‍🎨❌```", // 5 erros
      "```🧍❌```" // 6 erros (derrota)
    ];
    return stages[fails] || stages[0];
  },
};
