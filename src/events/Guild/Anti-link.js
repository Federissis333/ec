const client = require(`${process.cwd()}/index.js`);
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: "Anti-link.js"
};

client.on('messageCreate', async (message) => {

    try {

        let guild = message.guild;

        const server = await client.guilddb.findOne({
            IDs: guild.id,
        });
        if (server.antilink.status) {

            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            let Links = ["discord.gg/", "https://", "dsc.gg/", "www.", "dc.gg/", "discord.com/invite/"];

            for (var i = 0; i < Links.length; i++) {
                if (message.content.includes(Links[i])) {
                    message.delete().catch(e => { });
                }

            }

        }

    } catch (err) {

    }

})