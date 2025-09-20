import { ChatInputCommandInteraction, GuildMember, User } from "discord.js";

export async function fetchUserAndMember(
  interaction: ChatInputCommandInteraction
): Promise<{ user: User | null; member: GuildMember | null; targetId: string }> {
  const userOption = interaction.options.getUser('user');
  const idOption = interaction.options.getString('id');
  let targetId = userOption?.id ?? idOption ?? interaction.user.id;

  let guildMember: GuildMember | null = null;
  let user: User | null = null;

  if(isNaN(Number(targetId))) targetId = interaction.user.id;

  try {
    if (interaction.guild) {
      guildMember = await interaction.guild.members
        .fetch({ user: targetId, withPresences: true })
        .catch(() => null);
    }

    user = (await interaction.client.users.fetch(targetId).catch(() => null)) ?? null;
  } catch (e) {
    console.log(e)
    // silent fallback
  }

  return { user, member: guildMember, targetId };
}