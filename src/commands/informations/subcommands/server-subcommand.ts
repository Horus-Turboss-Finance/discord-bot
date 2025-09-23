import { ChatInputCommandInteraction } from 'discord.js';
import { fetchGuildStats } from '../../../services/guild.service';
import { buildServerEmbed } from '../../../utils/build-embed/build-server-embed';

export async function handleServerSubcommand(interaction: ChatInputCommandInteraction) {
  if(!interaction.inGuild()) return;
  
  const stats = await fetchGuildStats(interaction.guild!);
  const embed = buildServerEmbed({
    guild: interaction.guild!,
    requester: interaction.user,
    stats,
  });

  await interaction.editReply({ embeds: [embed] });
}