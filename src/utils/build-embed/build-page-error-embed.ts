import { EmbedBuilder } from 'discord.js';

export function buildPageErrorEmbed(type: string, urls: string[]): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${type.toUpperCase()} PAGE ERROR`)
    .setDescription("Des urls n'ont pas pu être chargées selon le worker")
    .addFields({
      name: 'Listes des url',
      value: urls.map((url) => `- \`${url}\``).join('\n'),
    })
    .setColor('#D92D20')
    .setThumbnail('https://cdn-icons-png.flaticon.com/512/14090/14090276.png')
    .setFooter({ text: 'Worker' })
    .setTimestamp();
}
