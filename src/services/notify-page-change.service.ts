import { Client, TextChannel } from 'discord.js';
import { ENV } from '../config/env-loader';
import { buildPageChangeEmbed } from '../utils/build-embed/build-page-change-embed';

export async function notifyPageChange(
  client: Client,
  args: { type: string; arr: Array<{ url: string; change: Record<string, boolean> }> }
): Promise<void> {
  const embed = buildPageChangeEmbed(args.type, args.arr);

  try {
    const channel = await client.channels.fetch(ENV.DISCORD_CHANNEL_NOTIFIER) as TextChannel;
    await channel.send({ embeds: [embed] });
  } catch (error) {
    // TODO: remplacer par logger
    console.error(error);
  }
}