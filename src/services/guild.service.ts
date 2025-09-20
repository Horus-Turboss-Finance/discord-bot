import { Guild } from 'discord.js';

export async function fetchGuildStats(guild: Guild) {
  const [channels, emojis, roles, owner] = await Promise.all([
    guild.channels.fetch().catch(() => guild.channels.cache),
    guild.emojis.fetch().catch(() => guild.emojis.cache),
    guild.roles.fetch().catch(() => guild.roles.cache),
    guild.fetchOwner().then((o) => o.user).catch(() => null),
  ]);

  const channelCount = (channels)?.size ?? Object.keys(channels ?? {}).length ?? 0;

  const rolesArray = typeof roles.map === 'function'
    ? roles.map((r) => `<@&${r.id}>`)
    : [];
  const rolesCount = Math.max(0, (rolesArray.length ?? 0) - 1);

  const emojiArray = typeof emojis.map === 'function'
    ? emojis.map((e) => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`)
    : [];
  const emojiCount = emojiArray.length;
  const emojiPreview = emojiArray.slice(0, 18).join(' ') || 'Aucun emoji';

  return {
    owner,
    channelCount,
    rolesCount,
    emojiCount,
    emojiPreview,
    boostCount: guild.premiumSubscriptionCount ?? 0,
    boostTier: guild.premiumTier ?? 0,
  };
}