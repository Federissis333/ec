module.exports = {
    config: {
        name: "remover",
        description: "Remova moedas do saldo de um usuário.",
        category: "economia",
        usage: "!remover <@usuário> <quantidade>",
    },
    permissions: "Administrator",
    owner: true,
    run: async (client, message, args) => {
        // Verifica se o autor tem permissão de administrador
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("🚫 Você não tem permissão para usar este comando.");
        }

        const user = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!user || isNaN(amount) || amount <= 0) {
            return message.reply("❌ Uso incorreto do comando! O formato correto é: `!remover @usuário <quantidade>`.");
        }

        try {
            // Obtém ou cria o documento do usuário
            const userdb = await client.userdb.findOne({ userID: user.id }) || {
                economia: { ruby: 0, banco: 0, money: 0, sujo: 0, sobremim: `null`, marry: { casado: false, user: null, time: 0 } },
                icon: null, color: null, emblemas: {}, infos: { xp: 0, level: 0, rep: 0 }
            };

            // Verifica se o usuário tem saldo suficiente
            if (userdb.economia.money < amount) {
                return message.reply("❌ O saldo do usuário é insuficiente para realizar essa remoção.");
            }

            // Remove as moedas do saldo
            userdb.economia.money -= amount;
            await userdb.save();

            message.reply(`✅ Você removeu **${amount} moedas** de ${user.username}. Agora ele(a) tem **${userdb.economia.money} moedas**.`);
        } catch (err) {
            console.error("❌ Erro ao remover moedas:", err);
            message.reply("❌ Ocorreu um erro ao remover moedas.");
        }
    },
};