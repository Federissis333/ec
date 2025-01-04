const client = require(`${process.cwd()}/index.js`);
const { PermissionsBitField, Routes, REST, User } = require("discord.js");
const fs = require('node:fs');
const chalk = require('chalk');
const clog = chalk.hex('#ce52fe');
const clogred = chalk.hex('#ff0000');

module.exports = (client) => {

  let commands = [];

  // Slash commands handler:
  fs.readdirSync(`${process.cwd()}/src/commands/slash/`).forEach((dir) => {

    const SlashCommands = fs.readdirSync(`${process.cwd()}/src/commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of SlashCommands) {
      let pull = require(`${process.cwd()}/src/commands/slash/${dir}/${file}`);

      if (pull.name, pull.description, pull.type == 1) {
        client.slash_commands.set(pull.name, pull);

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
        });

      } else {
        console.log(clogred(`Shard Manager: Slash Commands `) + `${pull.name} Error.`)
        continue;
      };
    };

    client.logger.info(`${SlashCommands.length} comandos foram carregados com sucesso!`, { tags: [`Category: Slash: ${dir}`] });

  });

  // User commands handler:
  fs.readdirSync(`${process.cwd()}/src/commands/user/`).forEach((dir) => {

    const UserCommands = fs.readdirSync(`${process.cwd()}/src/commands/user/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`${process.cwd()}/src/commands/user/${dir}/${file}`);

      if (pull.name, pull.type == 2) {
        client.user_commands.set(pull.name, pull);

        commands.push({
          name: pull.name,
          type: pull.type || 2,
        });

      } else {
        console.log(clogred(`Shard Manager: User Commands `) + `${pull.name} Error.`)
        continue;
      };
    };

    client.logger.info(`${UserCommands.length} comandos foram carregados com sucesso!`, { tags: [`Category: User: ${dir}`] });

  });

  // Message commands handler:
  fs.readdirSync(`${process.cwd()}/src/commands/message/`).forEach((dir) => {
    const UserCommands = fs.readdirSync(`${process.cwd()}/src/commands/message/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`${process.cwd()}/src/commands/message/${dir}/${file}`);

      if (pull.name, pull.type == 3) {
        client.message_commands.set(pull.name, pull);

        commands.push({
          name: pull.name,
          type: pull.type || 3,
        });

      } else {
        console.log(clogred(`Shard Manager: Message Commands `) + `${pull.name} Error.`)
        continue;
      };
    };

    client.logger.info(`${UserCommands.length} comandos foram carregados com sucesso!`, { tags: [`Category: Message: ${dir}`] });

  });

  // Registering all the application commands:
  if (!process.env.BOTID) {
    console.log(clogred(`[WARN] `) + `É preciso informar o id do bot no .env`)
    return process.exit();
  };

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  (async () => {
    /* console.log(clog(`Shard Manager: Application Commands `) + `Registrando comandos...`) */

    try {
      await rest.put(
        Routes.applicationCommands(process.env.BOTID),
        { body: commands }
      );

      client.logger.info(`Foram registrados ${commands.length} comandos no Discord!`, { tags: ['Commands'], });
    } catch (err) {
      console.log(err);
    }
  })();
};