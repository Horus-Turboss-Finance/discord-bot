import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { fetchWebsiteStatus, calculateStatusColorScore } from '../../../services/website-status.service';

/**
 * Gère la sous-commande "website" du slash command "ping"
 * @param interaction Interaction Discord provenant d'un ChatInputCommand
 */
export async function handleWebsiteSubcommand(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    const statusItems = await fetchWebsiteStatus();

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Status du site Cash Sights', iconURL: 'https://cashsight.fr/logo.png' })
      .setTimestamp()
      .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: `Requested by ${interaction.user.username}` })
      .setImage('https://cashsight.fr/banner');

    for (const item of statusItems) {
      embed.addFields(
        {
          name: `${item.errorCount > 0 ? '🔺' : '🔷'} ${item.type} status`,
          value: `\`\`\`${item.errorCount > 0 ? `${item.errorCount} error endpoint(s)` : 'Service en ligne'}\`\`\``,
        },
        {
          name: `${item.ping > 2000 ? '🔺' : item.ping > 1000 ? '🟠' : '🔷'} ping`,
          value: `\`\`\`${item.ping}ms\`\`\``,
          inline: true,
        },
        {
          name: '⏰ Dernier redémarrage',
          value: `\`\`\`${item.lastErrorRelative}\`\`\``,
          inline: true,
        }
      );
    }

    const colorScore = calculateStatusColorScore(statusItems);
    if (colorScore > 3) embed.setColor('#D92D20'); // rouge
    else if (colorScore > 1) embed.setColor('#DC6803'); // orange
    else embed.setColor('#EFCB8C'); // jaune clair

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Erreur dans website-status main:', error);
    await interaction.editReply({ content: 'Une erreur est survenue lors de la récupération du status.' });
  }
}