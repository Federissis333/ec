async function ProtectURL(guild, url) {

    const patchUrl = {
        url: `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`,
        body: {
            code: url
        },
        json: true,
        method: 'patch',
        headers: {
            "Authorization": `Bot ${process.env.TOKEN}`
        }
    };

    return patch(patchUrl)

}

module.exports = { ProtectURL };