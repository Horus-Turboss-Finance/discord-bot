import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { handleWebsiteSubcommand } from "./subcommands/website-subcommand";
import { handleBotSubcommand } from "./subcommands/bot-subcommand";

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('monitoring')
  .addSubcommand(sub => 
    sub
      .setName("website")
      .setDescription("Monitoring of website")
  )
  .addSubcommand(sub => 
    sub
      .setName("bot")
      .setDescription("Monitoring of bot")
  )
export const cooldown = 5 as const;

export async function main(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  await interaction.deferReply().catch(() => null);

  try {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "website":
        await handleWebsiteSubcommand(interaction);
        break;
      case "bot":
        await handleBotSubcommand(interaction);
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
