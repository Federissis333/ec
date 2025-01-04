import { Events, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  name: Events.InteractionCreate,
  async run(interaction) {
    if (interaction.isButton()) {
      const userId = interaction.user.id;

      if (interaction.customId === "service_bio") {
        try {
          // Fetch user data
          const response = await axios({
            method: "get",
            url: `http://mistysync.online/users/${interaction.user.id}`,
          });

          const { data: res } = response;

          if (res.apiStatusResponse === 200) {
            // Cria a embed da bio
            const embedBio = new EmbedBuilder()
              .setColor(res.userProfile.profileColor)
              .setDescription(
                `**BIO:**\n\`\`\`${res.userProfile.bio || "SEM BIO"}\`\`\``
              );

            // Verifica se o usuário tem um banner e adiciona à embed
            if (res.userProfile.banner?.icon) {
              embedBio.setImage(res.userProfile.banner.iconURL);
            }

            // Envia a resposta com a bio de forma efêmera (só o usuário verá)
            await interaction.reply({
              embeds: [embedBio],
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Error fetching user bio.",
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error trying to fetch user bio.",
            ephemeral: true,
          });
        }
      }

      if (interaction.customId === "service_nitro") {
        try {
          // Obtendo dados do usuário
          const response = await axios({
            method: "get",
            url: `http://mistysync.online/users/${userId}`,
          });

          const { data: res } = response;

          if (res.apiStatusResponse === 200) {
            const embeds = [];

            // Verificando as informações do Nitro
            if (res.nitro && (res.nitro.since || res.nitro.guildBoost?.since)) {
              const embedNitroInfos = new EmbedBuilder()
                .setColor(res.userProfile.profileColor)
                .setDescription("## Nitro Infos:")
                .addFields(
                  {
                    name: "**Assinante desde:**",
                    value: `<t:${~~(
                      new Date(res.nitro.since).getTime() / 1000
                    )}:f>`,
                    inline: true,
                  },
                  {
                    name: "**Tipo de nitro:**",
                    value: `\`\`\`${
                      res.nitro.type == 2 ? "Nitro Boost" : "Nitro Basic"
                    }\`\`\``,
                    inline: true,
                  },
                  {
                    name: "**Insignia de boost desde:**",
                    value: `${
                      res.nitro.guildBoost
                        ? `<t:${~~(
                            new Date(res.nitro.guildBoost.since).getTime() /
                            1000
                          )}:f>`
                        : "**Sem insignia de boost.**"
                    }`,
                    inline: false,
                  }
                );

              embeds.push(embedNitroInfos);
            }

            // Enviar a resposta efêmera (só o usuário vê)
            await interaction.reply({
              embeds,
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Error fetching user data.",
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error trying to fetch user information.",
            ephemeral: true,
          });
        }
      }
    }
  },
};
