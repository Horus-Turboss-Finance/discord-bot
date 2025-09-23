import { EmbedBuilder } from 'discord.js';

interface ReportPayload {
  reporterId: string;
  reporterTag: string;
  guildId: string | null;
  type: string;
  description: string;
  lien?: string | null;
}

export function buildReportEmbed(payload: ReportPayload): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`🛡️ Nouveau signalement - ${payload.type.toUpperCase()}`)
    .setDescription(payload.description)
    .addFields(
      { name: 'Auteur', value: `${payload.reporterTag} (${payload.reporterId})`, inline: false },
      { name: 'Type', value: payload.type, inline: true },
      { name: 'Serveur', value: payload.guildId ?? 'DM / inconnu', inline: true },
      ...(payload.lien ? [{ name: 'Lien', value: payload.lien, inline: false }] : [])
    )
    .setTimestamp();
}