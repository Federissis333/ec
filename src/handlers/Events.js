const fs = require('node:fs');
const chalk = require('chalk');
const clog = chalk.hex('#ce52fe');
const clogred = chalk.hex('#ff0000');

module.exports = (client) => {
	let events = 0;

	fs.readdirSync(`${process.cwd()}/src/events/`).forEach(dir => {
		const commands = fs.readdirSync(`${process.cwd()}/src/events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of commands) {

			let pull = require(`${process.cwd()}/src/events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
			} else {
				console.log(clogred(`Shard Manager: Events `) + `${pull.name} Error.`)
				continue;
			}
		}

		events += commands.length

	});

	client.logger.info(`${events} eventos foram carregados com sucesso!`, { tags: ['Events'] });
}