import { EmbedBuilder, Client, TextChannel } from 'discord.js';
import { WORKER_EVENTS } from '../types/worker-events';
import { monitoringWorker } from '../client/worker';
import { ENV } from '../config/env-loader';

export function setupWorkerListeners(client: Client): void {
  monitoringWorker.on(WORKER_EVENTS.PAGE_CHANGE, (args) => {
    handlePageChange(client, args);
  });

  monitoringWorker.on(WORKER_EVENTS.PAGE_ERROR, (args) => {
    handlePageError(client, args);
  });
}

function handlePageChange(
  client: Client,
  args: { type: string; arr: Array<{ url: string; change: Record<string, boolean> }> }
): void {
  const { type, arr } = args;

  let hasCSSChange = false;
  let hasJSChange = false;
  const urlsWithChanges: string[] = [];

  for (const entry of arr) {
    const { url, change } = entry;

    if (change.css) hasCSSChange = true;
    if (change.js) hasJSChange = true;

    const changes = [];
    if (change.html) changes.push('```HTML```');
    if (change.img) changes.push('```IMG```');

    if (changes.length > 0) {
      urlsWithChanges.push(`- **${url} :** ${changes.join('\n ')}`);
    }
  }

  const changeFields = urlsWithChanges.length > 0
    ? { name: 'Contenu modifié', value: urlsWithChanges.join('\n') }
    : undefined;

  const changeDescriptions: string[] = [];
  if (hasCSSChange) changeDescriptions.push('🖌️ **Changement de style (CSS)** détecté');
  if (hasJSChange) changeDescriptions.push('⚙️ **Changement de script (JS)** détecté');
  if (changeDescriptions.length === 0 && !changeFields) {
    changeDescriptions.push('*Aucun changement détecté précisément.*');
  }

  const embed = new EmbedBuilder()
    .setTitle(`${type.toUpperCase()} PAGE CHANGE`)
    .setColor('#DC6803')
    .setThumbnail('https://cdn-icons-png.flaticon.com/512/4344/4344882.png')
    .setFooter({ text: 'Worker #1' })
    .setTimestamp();

  if (changeFields) embed.addFields(changeFields);
  if (changeDescriptions.length) embed.setDescription(changeDescriptions.join('\n\n'));

  client.channels.fetch(ENV.DISCORD_CHANNEL_NOTIFIER)
    .then((channel) => (channel as TextChannel).send({ embeds: [embed] }))
    .catch(console.error); // TODO: remplacer par logger
}

function handlePageError(
  client: Client,
  args: { type: string; arr: string[] }
): void {
  const { type, arr } = args;

  const embed = new EmbedBuilder()
    .setTitle(`${type.toUpperCase()} PAGE ERROR`)
    .setDescription("Des urls n'ont pas pu être chargées selon le worker")
    .addFields({
      name: 'Listes des url',
      value: arr.map((url) => `- \`${url}\``).join('\n'),
    })
    .setColor('#D92D20')
    .setThumbnail('https://cdn-icons-png.flaticon.com/512/14090/14090276.png')
    .setFooter({ text: 'Worker' })
    .setTimestamp();

  client.channels.fetch(ENV.DISCORD_CHANNEL_NOTIFIER)
    .then((channel) =>
      (channel as TextChannel).send({
        embeds: [embed],
        content: `<@${(channel as TextChannel).guild.ownerId}>`,
      })
    )
    .catch(console.error); // TODO: remplacer par logger
}