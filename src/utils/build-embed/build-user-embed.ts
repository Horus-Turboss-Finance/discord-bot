import { EmbedBuilder, User } from "discord.js";
import { safeDateTimestamp } from "../safe-date-timestamp";
import { formatBadgesFromFlags } from "../format-badges";

export function buildUserEmbed(user: User): EmbedBuilder {
  const flagsArray = user ? user.flags?.toArray?.() ?? [] : [];
  const badgeStr = formatBadgesFromFlags(flagsArray);

  const embed = new EmbedBuilder()
    .setColor('#EFCB8C')
    .setAuthor({ name: `Information sur ${user.username}`, iconURL: user.displayAvatarURL?.() })
    .setDescription(`Voici les informations concernant l'utilisateur ${user.username}`)
    .addFields(
      { name: 'Mention', value: `<@${user.id}>`, inline: true },
      { name: 'Identifiant', value: `\`\`\`${user.id}\`\`\``, inline: true },
      { name: 'Tag', value: badgeStr, inline: false },
      {
        name: 'Création du compte',
        value: `<t:${safeDateTimestamp(user.createdTimestamp)}:D> (<t:${safeDateTimestamp(user.createdTimestamp)}:R>)`,
        inline: true,
      }
    );

  embed.setThumbnail(user.displayAvatarURL?.() ?? undefined);

  const banner = typeof user.bannerURL === 'function' ? user.bannerURL() ?? null : null;
  if (banner) embed.setImage(`${banner}?size=1280`);

  return embed;
}