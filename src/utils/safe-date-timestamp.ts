export function safeDateTimestamp(ms: number | null | undefined): number {
  if (!ms || Number.isNaN(ms)) return 0;
  return Math.floor(ms / 1000);
}