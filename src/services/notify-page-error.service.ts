import { Client, TextChannel } from 'discord.js';
import { ENV } from '../config/env-loader';
import { buildPageErrorEmbed } from '../utils/build-embed/build-page-error-embed';

export async function notifyPageError(
  client: Client,
  args: { type: string; arr: string[] }
): Promise<void> {
  const embed = buildPageErrorEmbed(args.type, args.arr);

  try {
    const channel = await client.channels.fetch(ENV.DISCORD_CHANNEL_NOTIFIER) as TextChannel;
    await channel.send({
      embeds: [embed],
      content: `<@${channel.guild.ownerId}>`,
    });
  } catch (error) {
    // TODO: remplacer par logger
    console.error(error);
  }
}