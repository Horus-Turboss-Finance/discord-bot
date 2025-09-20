import { ChatInputCommandInteraction } from 'discord.js';
import { fetchGuildStats } from '../../../services/guild.service';
import { buildServerEmbed } from '../../../utils/build-embed/build-server-embed';

export async function handleServerSubcommand(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.editReply({
      embeds: [
        {
          title: 'Commande disponible uniquement en serveur',
          color: 0xE74C3C,
        },
      ],
    });
    return;
  }

  const stats = await fetchGuildStats(interaction.guild);
  const embed = buildServerEmbed({
    guild: interaction.guild,
    requester: interaction.user,
    stats,
  });

  await interaction.editReply({ embeds: [embed] });
}