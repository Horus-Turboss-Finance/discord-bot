import { EmbedBuilder, Guild, User } from 'discord.js';
import { safeDateTimestamp } from '../safe-date-timestamp';

interface ServerEmbedParams {
  guild: Guild;
  requester: User;
  stats: {
    owner: User | null;
    channelCount: number;
    rolesCount: number;
    emojiCount: number;
    emojiPreview: string;
    boostCount: number;
    boostTier: number;
  };
}

export function buildServerEmbed({ guild, requester, stats }: ServerEmbedParams): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#EFCB8C');

  const guildCreatedAt = safeDateTimestamp(guild.createdTimestamp);
  const guildBanner = typeof guild.bannerURL === 'function' ? guild.bannerURL?.() ?? null : null;
  const guildIcon = typeof guild.iconURL === 'function' ? guild.iconURL?.() ?? null : null;

  if (guildBanner) {
    embed.setImage(`${guildBanner}?size=1280`);
  }

  embed
    .setAuthor({ name: guild.name, iconURL: guildIcon ?? undefined })
    .setTitle('Informations sur le serveur')
    .setDescription(guild.description ?? 'Aucune description')
    .setThumbnail(guildIcon ?? null)
    .addFields(
      { name: 'ID du serveur', value: `\`\`\`${guild.id}\`\`\``, inline: true },
      {
        name: 'Propriétaire',
        value: stats.owner ? `<@${stats.owner.id}> (\`${stats.owner.username}\`)` : 'Inconnu',
        inline: true,
      },
      {
        name: 'Date de création',
        value: `<t:${guildCreatedAt}:D> (<t:${guildCreatedAt}:R>)`,
        inline: false,
      },
      { name: 'Nombre de membres', value: `\`\`\`${guild.memberCount}\`\`\``, inline: true },
      { name: 'Nombre de rôles', value: `\`\`\`${stats.rolesCount}\`\`\``, inline: true },
      { name: 'Nombre de salons', value: `\`\`\`${stats.channelCount}\`\`\``, inline: true },
      {
        name: 'État des boost',
        value: `\`\`\`${stats.boostCount} Boost (Niveau ${stats.boostTier})\`\`\``,
        inline: false,
      },
      { name: `Emojis [${stats.emojiCount}]`, value: stats.emojiPreview, inline: false }
    )
    .setFooter({
      text: `Requested by ${requester.username ?? requester.tag ?? 'Unknown'}`,
      iconURL: requester.displayAvatarURL?.() ?? undefined,
    });

  return embed;
}