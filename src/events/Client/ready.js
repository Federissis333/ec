const client = require(`${process.cwd()}/index.js`);
const { SendStatus } = require(`${process.cwd()}/src/functions/topgg/status.js`);
const { NotifySytem } = require(`${process.cwd()}/src/functions/additional/notify.js`);
const { StatChannel } = require(`${process.cwd()}/src/functions/additional/statchannel.js`);
const mongoose = require('mongoose');
const { User } = require(`${process.cwd()}/src/structures/MongoModels`); // Modelo do MongoDB
mongoose.set('strictQuery', false);

module.exports = {
  name: "ready.js"
};

client.on('ready', async () => {
  client.logger.info(`${client.user.tag} iniciado com sucesso!`, { tags: ['Bot'] });

  MongoConnect();
  BotStatus();
  NotifySytem();
  StatChannel();
  SendStatus();
  SyncUsers(); // Chama a função para sincronizar usuários
});

async function BotStatus() {
  client.user.setActivity(`${client.guilds.cache.size.toString()} servers | n!help`, { type: 2 });

  setInterval(() => {
    client.user.setActivity(`${client.guilds.cache.size.toString()} servers | n!help`, { type: 2 });
  }, 1000);
}

async function MongoConnect() {
  await mongoose.connect(process.env.MONGO)
    .then(() => {
      client.logger.info(`O banco de dados em MongoDB foi conectado!`, { tags: ['Database'] });
    })
    .catch((err) => {
      client.logger.error(`Erro ao conectar ao MongoDB: ${err}`, { tags: ['Database'] });
    });
}

// Função para sincronizar todos os usuários
async function SyncUsers() {
  try {
    client.guilds.cache.forEach(async (guild) => {
      client.logger.info(`Sincronizando usuários no servidor: ${guild.name}`, { tags: ['Sync'] });

      const members = await guild.members.fetch(); // Busca todos os membros do servidor

      for (const [memberId, member] of members) {
        let user = await User.findOne({ userID: memberId }); // Verifica se o usuário já está no banco

        if (!user) {
          // Cria um novo registro para o usuário
          user = new User({
            userID: memberId,
            economia: {
              money: 0,
              banco: 0,
              pixFeitos: 0,
              pixRecebidos: 0,
            },
            icon: member.user.displayAvatarURL(),
            color: "#ffffff",
            emblemas: [],
          });

          await user.save();
          client.logger.info(`Usuário registrado: ${member.user.tag}`, { tags: ['Sync'] });
        } else {
          client.logger.info(`Usuário já registrado: ${member.user.tag}`, { tags: ['Sync'] });
        }
      }

      client.logger.info(`Sincronização concluída no servidor: ${guild.name}`, { tags: ['Sync'] });
    });
  } catch (err) {
    client.logger.error(`Erro ao sincronizar usuários: ${err}`, { tags: ['Sync'] });
  }
}