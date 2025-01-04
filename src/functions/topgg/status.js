const client = require(`${process.cwd()}/index.js`);
const { AutoPoster } = require('topgg-autoposter');

async function SendStatus() {

    if (client.user.id !== process.env.ADYRAID) return;

    return AutoPoster(process.env.TOPGG, client).then(x => client.logger.info(`informações enviadas com sucesso!`, { tags: ['Top.gg'] })).catch()

}

module.exports = { SendStatus };