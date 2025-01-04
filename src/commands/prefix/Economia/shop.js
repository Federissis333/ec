const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    config: {
        name: "shop",
        aliases: ["loja"],
        description: "Exibe a loja com itens disponíveis para compra.",
        category: "economia",
    },
    run: async (client, message, args) => {
        const membro = message.author;

        const shopEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("🛒 Loja de Itens")
            .setDescription("Aqui estão os itens disponíveis para compra:")
            .addFields(
                { name: "Arma", value: "💰 **Preço**: 5000 coins", inline: true },
                { name: "Faca", value: "💰 **Preço**: 1000 coins", inline: true },
                { name: "Colete", value: "💰 **Preço**: 500 coins", inline: true },
                { name: "Arma de Alto Calibre", value: "💰 **Preço**: 10.000 coins", inline: false }
            )
            .setFooter({ text: "Clique em 'Comprar' para adquirir um item." })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("Comprar")
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("sair")
                .setLabel("Sair")
                .setStyle(4)
        );

        const msg = await message.reply({ embeds: [shopEmbed], components: [buttons] });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== membro.id) return interaction.reply({ content: "Apenas o autor do comando pode interagir.", ephemeral: true });

            if (interaction.customId === "comprar") {
                const modal = new ModalBuilder()
                    .setCustomId("comprarModal")
                    .setTitle("Comprar Item");

                const itemInput = new TextInputBuilder()
                    .setCustomId("item")
                    .setLabel("Qual item deseja comprar?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Exemplo: Arma")
                    .setRequired(true);

                const quantidadeInput = new TextInputBuilder()
                    .setCustomId("quantidade")
                    .setLabel("Quantas unidades deseja comprar?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Exemplo: 1")
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(itemInput),
                    new ActionRowBuilder().addComponents(quantidadeInput)
                );

                await interaction.showModal(modal);
            } else if (interaction.customId === "sair") {
                await msg.edit({ content: "A interação foi encerrada.", embeds: [], components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            msg.edit({ components: [] });
        });
    },
};
