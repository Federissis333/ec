const { Schema, model } = require("mongoose");

// Guild Schema
const Guild = model("guilds", new Schema({
  IDs: { type: String },
  prefix: { type: String, default: "a!" },
  welcome: {
    status: { type: Boolean, default: false },
    channel: { type: String, default: "null" },
    mode: { type: String, default: "1" },
    cor: { type: String, default: "#2f3136" },
    msg: { type: String, default: "null" },
    time: { type: String, default: "0" },
  },
  contador: {
    status: { type: Boolean, default: false },
    status2: { type: Number, default: 1 },
    channel: { type: String, default: "null" },
    msg: { type: String, default: "🔊 Membros em call: {contador}" },
  },
  contadormembro: {
    status: { type: Boolean, default: false },
    channel: { type: String, default: "null" },
    zero: { type: String, default: "0️⃣" },
    one: { type: String, default: "1️⃣" },
    two: { type: String, default: "2️⃣" },
    three: { type: String, default: "3️⃣" },
    four: { type: String, default: "4️⃣" },
    five: { type: String, default: "5️⃣" },
    six: { type: String, default: "6️⃣" },
    seven: { type: String, default: "7️⃣" },
    eight: { type: String, default: "8️⃣" },
    nine: { type: String, default: "9️⃣" },
  },
}));

// User Schema
const User = model("users", new Schema({
  userID: { type: String, required: true },
  economia: {
    money: { type: Number, default: 0 },       // Dinheiro principal
    banco: { type: Number, default: 0 },       // Dinheiro no banco
    sujo: { type: Number, default: 0 },        // Dinheiro ilícito
    ruby: { type: Number, default: 0 },        // Moeda especial
    inventario: { type: Array, default: [] },  // Inventário de itens
    fishingData: {                             // Dados temporários de pesca
      dinheiro: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    },
    licenca: { type: Boolean, default: false }, // Licença de armas
    trabalho: {
      maxmoney: { type: Number, default: 0 },
      trampo: { type: String, default: "null" },
      cooldown: { type: Number, default: 0 },
      requiredlevel: { type: Number, default: 0 },
      sobremim: { type: String, default: "null" },
    },
    pesca: {
      peixes: { type: Array, default: [] },     // Lista de peixes pescados
      itensPerda: { type: Array, default: [] }, // Lista de itens "lixo"
    },
  },
  vip: {
    enabled: { type: Boolean, default: false }, // Indica se o VIP está ativo
    level: { type: Number, default: 0 },        // Nível do VIP (1 a 6)
    expiresAt: { type: Date, default: null },   // Data de expiração do VIP
    lastClaimedRecompensa: { type: Date, default: null }, // Data da última recompensa recebida
  },
  infos: {
    level: { type: Number, default: 1 },        // Nível do usuário
    xp: { type: Number, default: 0 },           // XP total
    rep: { type: Number, default: 0 },          // Reputação (exemplo)
  },
  cooldowns: {
    daily: { type: String, default: "0" },
    semanal: { type: String, default: "0" },
    mensal: { type: String, default: "0" },
    trabalho: { type: String, default: "0" },
    recompensa: { type: String, default: "0" },
  },
}));

// Instagram Schema
const Instagram = model("instagram", new Schema({
  _id: { type: String },
  autorFoto: { type: String, default: null },
  likesFoto: { type: Number, default: 0 },
  comentsFoto: { type: Number, default: 0 },
  curtidoresFoto: { type: Array, default: [] },
  comentariosFoto: { type: Array, default: [] },
}));

// Função para verificar se o usuário precisa subir de nível
async function checkLevelUp(user) {
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

  let currentLevel = user.infos.level;
  let currentXP = user.infos.xp;

  for (let level in levelData) {
    if (currentXP >= levelData[level] && currentLevel < parseInt(level)) {
      currentLevel = parseInt(level);
    }
  }

  if (currentLevel !== user.infos.level) {
    user.infos.level = currentLevel;
    await user.save();
    return true; // Retorna true se o nível foi atualizado
  }

  return false; // Retorna false se o nível não foi alterado
}

// Função para atualizar o status do VIP
async function updateVipStatus(user) {
  const now = new Date();
  if (user.vip.enabled && user.vip.expiresAt && now >= user.vip.expiresAt) {
    user.vip.enabled = false;
    user.vip.level = 0;
    user.vip.expiresAt = null;
    await user.save();
    return true; // VIP expirou e foi desativado
  }
  return false; // VIP ainda ativo ou não configurado
}

// Função para aplicar o bônus de VIP ao usuário no comando de economia
async function updateVipBonus(user, action) {
  const rewards = {
    daily: { 1: 25000, 2: 30000, 3: 35000, 4: 40000, 5: 50000, 6: 10000000 },
    work: { 1: 15000, 2: 20000, 3: 25000, 4: 30000, 5: 35000, 6: 9000000 },
    vote: { 1: 5000, 2: 10000, 3: 15000, 4: 20000, 5: 30000, 6: 10000000 },
    semanal: { 1: 40000, 2: 60000, 3: 80000, 4: 90000, 5: 100000, 6: 150000000 },
    mensal: { 1: 60000, 2: 80000, 3: 100000, 4: 150000, 5: 200000, 6: 180000000 },
    recompensa: { 1: 500000, 2: 1000000, 3: 1500000, 4: 2000000, 5: 3000000, 6: 60000000 }
  };

  if (user.vip.enabled) {
    const reward = rewards[action] && rewards[action][user.vip.level];
    if (reward) {
      user.money += reward; // Adiciona o valor do bônus
      user.vip.lastClaimedRecompensa = Date.now(); // Atualiza a data da última recompensa
      await user.save();
      return reward; // Retorna o valor do bônus aplicado
    }
  }

  return 0; // Nenhum bônus aplicado
}

module.exports = { Guild, User, Instagram, checkLevelUp, updateVipStatus, updateVipBonus };
