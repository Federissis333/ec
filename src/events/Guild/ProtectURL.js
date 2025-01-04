const { ProtectURL } = require(`${process.cwd()}/src/functions/urlProtection/ProtectURL.js`);
const client = require(`${process.cwd()}/index.js`);
const logs = require('discord-logs');
logs(client);

module.exports = {
    name: "ProtectURL"
};

client.on('guildVanityURLUpdate', async (guild, oldVanityURL, newVanityURL) => {

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    if (server.urlprotect.status) {

        if (server.urlprotect.url === "null") return;

        if (newVanityURL !== server.urlprotect.url) ProtectURL(guild, server.urlprotect.url)

    }

});

client.on('guildVanityURLRemove', async (guild, VanityURL) => {

    const server = await client.guilddb.findOne({
        IDs: guild.id,
    });

    if (server.urlprotect.status) {

        if (server.urlprotect.url === "null") return;

        ProtectURL(guild, server.urlprotect.url)

    }

});