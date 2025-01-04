const { Snake } = require('discord-gamecord');

module.exports = {
  config: {
    name: "snake",
    aliases: ["cobra"],
    description: "Jogue o jogo da cobra.",
    category: "interação",
    usage: null,
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    try {

      const Game = new Snake({
        message: message,
        isSlashGame: false,
        embed: {
          title: '**Jogo da cobra**',
          overTitle: 'Você perdeu',
          color: process.env.COLOR1
        },
        emojis: {
          board: '⬛',
          food: '🍎',
          up: `${process.env.EmojiCima}`,
          down: `${process.env.EmojiBaixo}`,
          left: `${process.env.EmojiEsquerda}`,
          right: `${process.env.EmojiDireita}`,
        },
        stopButton: 'Parar',
        timeoutTime: 60000,
        snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
        foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
        playerOnlyMessage: 'Você não pode usar os botões de outra pessoa!'
      });

      Game.startGame();

    } catch (err) {

      console.log()

    }
  }
}