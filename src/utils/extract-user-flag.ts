import { User } from "discord.js";

export function extractUserFlags(user: User): readonly string[] | undefined {
  try {
    const maybeFlags = user?.flags;
    if (!maybeFlags) return undefined;
    if (typeof maybeFlags.toArray === 'function') return maybeFlags.toArray();
    if (Array.isArray(maybeFlags)) return maybeFlags;
  } catch {
    return undefined;
  }
  return undefined;
}
