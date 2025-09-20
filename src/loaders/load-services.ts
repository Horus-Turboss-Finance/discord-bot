import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

// Chargement des services métier (effets de bord : planification, etc.)
export async function loadServices(): Promise<void> {
  const servicesDir = resolve(__dirname, '../jobs');
  const serviceFiles = readdirSync(servicesDir).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js'),
  );

  for (const file of serviceFiles) {
    const path = join(servicesDir, file);
    await import(path); // Peut déclencher des effets (init, jobs, etc.)
  }
}