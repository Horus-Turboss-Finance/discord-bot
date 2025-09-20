import { ChatInputCommandInteraction } from 'discord.js';
import { createBotStatusEmbed } from '../../../services/bot-status.service';

export async function handleBotSubcommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const embed = createBotStatusEmbed(interaction);
  await interaction.editReply({ embeds: [embed] });
}