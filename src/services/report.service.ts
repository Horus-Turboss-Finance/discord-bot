import { ENV } from '../config/env-loader';
import { Client, TextChannel } from 'discord.js';
import { buildReportEmbed } from '../utils/build-embed/build-report-embed';

interface ReportPayload {
  reporterId: string;
  reporterTag: string;
  guildId: string | null;
  type: string;
  description: string;
  lien?: string | null;
}

export async function handleReportSubmission(payload: ReportPayload, client : Client): Promise<void> {
  const reportChannel = await client.channels.fetch(ENV.DISCORD_CHANNEL_REPORTS);
  if (!reportChannel || !reportChannel.isTextBased()) throw new Error('Canal de report introuvable');

  const embed = buildReportEmbed(payload);

  await (reportChannel as TextChannel).send({ embeds: [embed] });
}