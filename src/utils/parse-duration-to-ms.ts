// Format supporté : 10m, 1h, 2d, 30s
export function parseDurationToMs(input: string): number | null {
  const regex = /^(\d+)(s|m|h|d)$/i;
  const match = input.match(regex);

  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}
