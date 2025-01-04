const fs = require('node:fs');
const chalk = require('chalk');
const clog = chalk.hex('#ce52fe');
const clogred = chalk.hex('#ff0000');

module.exports = (client, config) => {

  fs.readdirSync(`${process.cwd()}/src/commands/prefix/`).forEach(dir => {
    const commands = fs.readdirSync(`${process.cwd()}/src/commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {

      let pull = require(`${process.cwd()}/src/commands/prefix/${dir}/${file}`);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);
      } else {
        console.log(clogred(`Shard Manager: Commands `) + `${pull.config.name} Error.`)
        continue;
      };
      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach(x => client.prefix_aliases_commands.set(x, pull.name))

    };

    client.logger.info(`${commands.length} comandos foram carregados com sucesso!`, { tags: [`Category: Prefix: ${dir}`] });
  });
};