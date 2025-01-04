const client = require(`${process.cwd()}/index.js`);
const { ChannelType } = require('discord.js');

module.exports = {
    name: "messageUpdate"
};

client.on('messageUpdate', async (oldMessage, newMessage) => {

    if (newMessage?.channel?.type == ChannelType.DM || newMessage?.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    client.emit('messageCreate', newMessage);

});