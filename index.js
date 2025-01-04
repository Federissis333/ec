const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const dotenv = require('dotenv').config();
const { createWinstonLogger } = require(`${process.cwd()}/src/structures/Logger.js`);
const { Guild, User, Instagram } = require(`${process.cwd()}/src/structures/MongoModels.js`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});

const logs = require('discord-logs');
logs(client);

client.prefix_commands = new Collection();
client.prefix_aliases_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.events = new Collection();

client.userdb = User;
client.guilddb = Guild;
client.instadb = Instagram;
client.logger = createWinstonLogger(
  {
    handleExceptions: true,
    handleRejections: true,
  },
  client,
);

module.exports = client;

["PrefixCommands", "AppCommands", "Events"].forEach((file) => {
  require(`${process.cwd()}/src/handlers/${file}`)(client);
});

// Loga no Discord
Promise.all([client.login(process.env.TOKEN)]);
