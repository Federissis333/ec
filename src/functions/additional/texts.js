const client = require(`${process.cwd()}/index.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

async function BoasVindas(canal) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Adyra: Boas Vindas", iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) })
        .setImage(process.env.IMG_SUPPORT_BOASVINDAS)
        .setColor("#ce52fe")
        .setDescription("Sou uma bot de moderação, proteção e entretenimento, fui criada para proteger e entreter seu servidor.\nPossuo comandos de fácil uso, para mais informações utilize \`a!ajuda\`.")
        .addFields({ name: `<a:adyrashine:1033874963742064681> Sistemas mais utlizados:`, value: `・Sistema de NSFW\n・Sistema de Auto-roles\n・Sistema de Boas-vindas\n・Sistema de random gif/icon/banner\n・Sistema de contador de membros em call\n・Sistema de proteção de URL.` })
        .addFields({ name: `<a:adyrashine:1033874963742064681> Me ajude e ganhe benéficos:`, value: `Caso esteja com um boost sobrando e quer se tornar um membro vip e receber diversas vantagens confira os benéficos em: <#1022020088360095774>, e me ajude.` })
        .addFields({ name: `<a:adyrashine:1033874963742064681> Me dê ideias e ganhe benéficos:`, value: `Sua sugestão é muito importante para meu desenvolvimento, deixe sua sugestão em: <#1022391751316623400> e caso ela for aceita você receberá alguns coins.` })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Me adicione em seu servidor")
                .setURL("https://discord.com/api/coauth2/authorize?client_id= Id do bot )&permissions=8&scope=applications.commands%20bot")
                .setStyle(5)
        )

    canal.send({ embeds: [embed], components: [row] })

}

async function Termos(canal) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Adyra: Termos", iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) })
        .setImage(process.env.IMG_SUPPORT_TERMOS)
        .setColor("#ce52fe")
        .setDescription("Ao utilizar nossos serviços, você automaticamente concorda com os seguintes termos.")
        .addFields({ name: `<:note:1052628464408203344> Termos de uso:`, value: "`1` A Adyra poderá coletar as seguintes informações suas: Avatar, Banner, Servidores, Mensagens, Mídias, apenas para uso próprio sem distribuição para terceiros." })
        .addFields({ name: `<:note:1052628464408203344> Termos de compra:`, value: "`1` Não realizamos reembolso de nenhum item adquirido, por serem produtos virtuais.\n`2` Nós não podemos remover qualquer produdo seu como forma de punição." })
        .addFields({ name: `<:note:1052628464408203344> Finalização:`, value: `Você poderá ser banido dos serviços da Adyra sem qualquer tipo de aviso prévio ou direito a reembolso de algum serviço adquirido.` })
    canal.send({ embeds: [embed] })

}

async function Notificar(canal) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Adyra: Notificações", iconURL: client.user.displayAvatarURL({ display: true, size: 4096 }) })
        .setImage(process.env.IMG_SUPPORT_NOTIFICAR)
        .setColor("#ce52fe")
        .setDescription("Os cargos de notificações foram implementados para reduzir as menções de `@everyone/@here`.\n\nAo clicar nos botões abaixo, você irá receber os cargos de notificação\nCaso deseje retirar o cargo basta clicar novamente no botão.")

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Notificar Autalizações")
                .setCustomId("notifcar_update")
                .setStyle(3),
            new ButtonBuilder()
                .setLabel("Notificar Status")
                .setCustomId("notifcar_status")
                .setStyle(3)
        )

    canal.send({ embeds: [embed], components: [row] })

}

module.exports = { BoasVindas, Termos, Notificar };