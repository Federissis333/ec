const client = require(`${process.cwd()}/index.js`);

async function StatChannel() {

    const servers = client.channels.cache.get(process.env.CANAL_STATUS_SERVER);
    const users = client.channels.cache.get(process.env.CANAL_STATUS_USERS);

    if (servers) {

        setInterval(() => {

            servers.setName(`📡・${client.guilds.cache.size.toLocaleString()} Servidores`).catch((err) => { })

        }, 1800000);
    }

    if (users) {

        setInterval(() => {

            let mcount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

            users.setName(`👥・${abreviar(mcount)} Usuários`).catch((err) => { })

        }, 1800000);

    }

}

module.exports = { StatChannel };

function abreviar(number, precision = 1) { return number.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: precision }); }