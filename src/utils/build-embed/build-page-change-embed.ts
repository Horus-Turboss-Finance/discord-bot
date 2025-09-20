import { EmbedBuilder } from 'discord.js';

export function buildPageChangeEmbed(
  type: string,
  changesArray: Array<{ url: string; change: Record<string, boolean> }>
): EmbedBuilder {
  let hasCSSChange = false;
  let hasJSChange = false;
  const urlsWithChanges: string[] = [];

  for (const { url, change } of changesArray) {
    if (change.css) hasCSSChange = true;
    if (change.js) hasJSChange = true;

    const inlineChanges = [];
    if (change.html) inlineChanges.push('```HTML```');
    if (change.img) inlineChanges.push('```IMG```');

    if (inlineChanges.length > 0) {
      urlsWithChanges.push(`- **${url} :** ${inlineChanges.join('\n ')}`);
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(`${type.toUpperCase()} PAGE CHANGE`)
    .setColor('#DC6803')
    .setThumbnail('https://cdn-icons-png.flaticon.com/512/4344/4344882.png')
    .setFooter({ text: 'Worker #1' })
    .setTimestamp();

  const changeDescriptions: string[] = [];
  if (hasCSSChange) changeDescriptions.push('🖌️ **Changement de style (CSS)** détecté');
  if (hasJSChange) changeDescriptions.push('⚙️ **Changement de script (JS)** détecté');

  if (changeDescriptions.length === 0 && urlsWithChanges.length === 0) {
    changeDescriptions.push('*Aucun changement détecté précisément.*');
  }

  if (changeDescriptions.length) {
    embed.setDescription(changeDescriptions.join('\n\n'));
  }

  if (urlsWithChanges.length > 0) {
    embed.addFields({
      name: 'Contenu modifié',
      value: urlsWithChanges.join('\n'),
    });
  }

  return embed;
}