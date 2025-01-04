const { EmbedBuilder } = require("discord.js");
const { User, checkLevelUp } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelos do MongoDB

module.exports = {
  config: {
    name: "level",
    aliases: ["lvl"],
    description: "Veja seu nível e XP atual.",
    category: "economia",
    usage: "level [@usuario]",
  },
  permissions: null,
  owner: false,
  run: async (client, message, args) => {
    const userId = args[0] ? args[0].replace(/[<@!>]/g, "") : message.author.id;

    // Buscar informações do usuário na DB
    const user = await User.findOne({ userID: userId });
    if (!user) return message.reply("Usuário não encontrado no sistema!");

    const currentXp = user.infos.xp || 0;
    const currentLevel = user.infos.level || 1;

    // Verificar se o usuário precisa subir de nível
    const levelUpdated = await checkLevelUp(user);

    // Obter dados do próximo nível
    const levelData = {
    1: 0,
2: 100,
3: 300,
4: 600,
5: 1000,
6: 1500,
7: 2100,
8: 2800,
9: 3600,
10: 4500,
11: 5500,
12: 6600,
13: 7800,
14: 9100,
15: 10500,
16: 12000,
17: 13600,
18: 15300,
19: 17100,
20: 19000,
21: 21000,
22: 23000,
23: 25000,
24: 27300,
25: 29500,
26: 31700,
27: 34000,
28: 36400,
29: 39000,
30: 41700,
31: 44500,
32: 47400,
33: 50400,
34: 53500,
35: 56700,
36: 60000,
37: 63400,
38: 66900,
39: 70500,
40: 74200,
41: 78000,
42: 81900,
43: 85900,
44: 90000,
45: 94200,
46: 98500,
47: 102900,
48: 107400,
49: 112000,
50: 116700,
51: 121500,
52: 126400,
53: 131400,
54: 136500,
55: 141700,
56: 147000,
57: 152400,
58: 157900,
59: 163500,
60: 169200,
61: 175000,
62: 180900,
63: 186900,
64: 193000,
65: 199200,
66: 205500,
67: 211900,
68: 218400,
69: 225000,
70: 231700,
71: 238500,
72: 245400,
73: 252400,
74: 259500,
75: 266700,
76: 274000,
77: 281400,
78: 288900,
79: 296500,
80: 304200,
81: 312000,
82: 319900,
83: 327900,
84: 336000,
85: 344200,
86: 352500,
87: 360900,
88: 369400,
89: 378000,
90: 386700,
91: 395500,
92: 404400,
93: 413400,
94: 422500,
95: 431700,
96: 441000,
97: 450400,
98: 459900,
99: 469500,
100: 479200
    };

    const maxLevel = Math.max(...Object.keys(levelData));
    const nextLevelXp = levelData[currentLevel + 1] || 0; // XP necessário para o próximo nível
    const xpToNextLevel = nextLevelXp - currentXp; // XP restante

    // Verificar se o usuário já está no nível máximo
    if (currentLevel >= maxLevel) {
      const embedMaxLevel = new EmbedBuilder()
        .setTitle("Informações de Nível")
        .setColor("#FFD700")
        .setDescription(
          `**Usuário:** <@${userId}>\n**Nível:** ${currentLevel} (Máximo)\n**XP Atual:** ${currentXp}\nVocê já atingiu o nível máximo!

-# utilize \`!rank xp\` para ver o ranking de XP.`
        );
      

      return message.reply({ embeds: [embedMaxLevel] });
    }

    // Mensagem de progresso
    const embed = new EmbedBuilder()
      .setTitle("Informações de Nível")
      .setColor("#7289DA")
      .setDescription(
        `**Usuário:** <@${userId}>\n**Nível:** ${currentLevel}\n**XP Atual:** ${currentXp}\n**Faltam:** ${xpToNextLevel} XP para o próximo nível.`
      );

    // Enviar mensagem se o nível foi atualizado
    if (levelUpdated) {
      message.channel.send(
        `🎉 <@${userId}> subiu para o nível ${user.infos.level}! Continue progredindo!`
      );
    }

    return message.reply({ embeds: [embed] });
  },
};
