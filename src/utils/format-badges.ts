const BADGES: Record<string, string> = {
  "ActiveDeveloper": "<:ActiveDev:1398270523489914910> ",
  "BugHunterLevel1": "<:BugHunt1:1398266960562884684> ",
  "BugHunterLevel2": "<:BugHunt2:1398266873191333970> ",
  "CertifiedModerator": "<:CertifModo:1398266358898364577> ",
  "Hypesquad": "<:HypeBadge0:1398266162285907968> ",
  "HypeSquadOnlineHouse1": "<:HypeBadge1:1398265015290695690> ",
  "HypeSquadOnlineHouse2": "<:HypeBadge2:1398265039982563409> ",
  "HypeSquadOnlineHouse3": "<:HypeBadge3:1398263002355994714> ",
  "Partner": "<:Partner:1398270455781130340> ",
  "PremiumEarlySupporter": "<:PremiumEarlySup:1398266640818507826> ",
  "Staff": "<:Staff:1398266753863389286> ",
  "VerifiedDeveloper": "<:VerifDev:1398266529795014769> ",
}

export function formatBadgesFromFlags(flags: readonly string[] | undefined): string {
  if (!flags || flags.length === 0) return '```Aucun tag```';
  const out = flags.map((f) => BADGES[f] ?? '').filter(Boolean).join(' ');
  return out.length ? out : '```Aucun tag```';
}