const { ComponentType } = require("discord.js");
const client = require(`${process.cwd()}/index.js`);

async function NotifySytem() {

    const canal = client.channels.cache.get(process.env.CANAL_NOTIFICAR);

    const collector = canal.createMessageComponentCollector({ componentType: ComponentType.Button });

    collector.on('collect', async (i) => {

        let member = i.member;
        let update = process.env.NOTIFICAR_UPDATE;
        let status = process.env.NOTIFICAR_STATUS;

        if (i.customId === "notifcar_update") {

            if (member.roles.cache.has(update)) {
                await member.roles.remove(update)
                await i.reply({ content: `${member}, notificações de **autalizações** desativadas.`, ephemeral: true });
            } else {
                await member.roles.add(update)
                await i.reply({ content: `${member}, notificações de **autalizações** ativadas.`, ephemeral: true });
            };

        } else if (i.customId === "notifcar_status") {

            if (member.roles.cache.has(status)) {
                await member.roles.remove(status)
                await i.reply({ content: `${member}, notificações de **status** desativadas.`, ephemeral: true });
            } else {
                await member.roles.add(status)
                await i.reply({ content: `${member}, notificações de **status** ativadas.`, ephemeral: true });
            };

        }

    })

}

module.exports = { NotifySytem };