import { ChatInputCommandInteraction, InteractionReplyOptions, MessageFlags } from 'discord.js';

export async function handleCommandError(
  interaction: ChatInputCommandInteraction,
  error: unknown
): Promise<void> {
  // TODO: remplacer par logger
  console.error('❌ Erreur lors de l’exécution de la commande :', error);

  const errorMessage = {
    content: 'Une erreur est survenue lors de l’exécution de la commande.',
    flags: MessageFlags.Ephemeral,
  } as InteractionReplyOptions;

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  } catch {
    // Silencieux pour éviter les erreurs de cascade
  }
}