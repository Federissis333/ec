const client = require(`${process.cwd()}/index.js`);
const chalk = require('chalk');
const cerr = chalk.hex('#ff0000');

module.exports = {
    name: "AntiCrash"
};

client.on('ready', async () => {

    process.on('unhandledRejection', (reason, promise) => {
        log(reason, promise)
    });

    process.on('uncaughtException', (err, origin) => {
        log(err, err)
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
    });

    client.logger.info(`Anti-crash iniciado com sucesso!`, { tags: ['Bot'] });

})

function log(name, error) {
    console.log(`[${cerr('Error Manager')}]: ${name}`, "\n", error);
}