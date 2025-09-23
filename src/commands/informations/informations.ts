import { SlashCommandBuilder, ChatInputCommandInteraction, InteractionContextType } from "discord.js";
import { handleServerSubcommand } from "./subcommands/server-subcommand";
import { handleUserSubcommand } from "./subcommands/user-subcommand";

export const data = new SlashCommandBuilder()
  .setName("informations")
  .setDescription("Donne des informations sur...")
  .setContexts(InteractionContextType.Guild)   
  .addSubcommand((sub) =>
    sub
      .setName("user")
      .setDescription("Donne des informations sur un utilisateur")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("L'utilisateur").setRequired(false)
      )
      .addStringOption((opt) =>
        opt
          .setName("id")
          .setDescription("L'ID de l'utilisateur")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("server")
      .setDescription("Donne des informations sur le serveur")
  );

export const cooldown = 15 as const;

export async function main(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  await interaction.deferReply().catch(() => null);

  try {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "user":
        await handleUserSubcommand(interaction);
        break;
      case "server":
        await handleServerSubcommand(interaction);
        break;
      default:
        await interaction.editReply({
          content: "Sous-commande inconnue.",
          embeds: []
        }).catch(() => null);;
    }
  } catch (e) {
    console.log(e)
    // Ne rien divulger à l'utilisateur; utiliser le logger du projet
    await interaction
      .editReply({
        content:
          "Une erreur est survenue lors de la récupération des informations.",
        embeds: [],
      })
      .catch(() => null);
    // TODO: logger.error(err);
  }
}
