const { TicTacToe } = require('discord-gamecord');

module.exports = {
  config: {
    name: "velha",
    aliases: null,
    description: "Jogue o jogo da velha.",
    category: "interação",
    usage: "velha [user]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {

    try {

      let member = message.mentions.users.first();

      if (!member) return message.reply({ content: `${message.author}, você precisa mencionar alguem para jogar com você.` })

      if (member.bot) return message.reply({ content: `${message.author}, você não pode jogar com um bot!` })

      if (member.id == message.author.id) return message.reply({ content: `${message.author}, você não pode jogar com você mesmo!` })


      new TicTacToe({
        message: message,
        isSlashGame: false,
        opponent: member,
        embed: {
          title: ' Jogo da velha',
          overTitle: 'Você perdeu',
          color: process.env.COLOR1
        },
        emojis: {
          xButton: process.env.EmojiX,
          oButton: process.env.EmojiO,
          blankButton: '➖'
        },
        timeoutTime: 60000,
        xButtonStyle: 'SECONDARY',
        oButtonStyle: 'SECONDARY',
        turnMessage: '{emoji} Vez de: **{player}**.',
        winMessage: '{emoji} **{player}** Venceu o jogo.',
        tieMessage: 'Empate!',
        timeoutMessage: 'O jogo ficou inacabado! Ninguém ganhou o Jogo!',
        playerOnlyMessage: 'Somente {player} e {opponent} podem utilizar os botões.',
        requestMessage: `${member}, {player} te convidou para uma rodada de Jogo da Velha.`,
        rejectMessage: 'O jogador negou seu pedido.'
      }).startGame();

    } catch (err) {
      console.log(err)
    }
  }
}