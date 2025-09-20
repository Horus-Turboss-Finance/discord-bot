# 🧱 Architecture – Bot Discord Utilitaire - Cash Sights
Ce document présente l'architecture logicielle du **bot Discord utilitaire de Cash Sights**, ainsi que les choix techniques clés.  
L'objectif est de fournir une base de code **maintenable**, **évolutive** et **fiable**, adaptée à un environnement Node.js orienté événements.

## 🧭 Vue d'ensemble
Le bot est structuré selon une architecture **modulaire**, inspirée des principes **DDD (Domain Driven Design)** simplifiés, avec une séparation claire entre :
- Commandes (slash, contextuelles)
- Événements Discord (guild, message, interaction, etc.)
- Services métiers (logique fonctionnelle / appels API)
- Utils & constantes
- Gestion des erreurs et des logs

```txt
src/
├── client/   → Initialisation et configuration du bot Discord ou worker events
├── commands/ → Commandes slash et contextuelles
├── config/   → Constantes globales, loaders de config, environnements
│   └── deploy-commands.ts→ Script pour enregistrer les commandes auprès de l’API Discord
├── events/   → Listeners d’événements Discord (ready, message, etc.)
├── jobs/     → tâches planifiées / rappels / cron
├── loader/   → chargement centralisé des différentes parties de l'app
├── services/ → Logique métier (ex : interaction avec l’API Cash Sights)
├── types/    → Types TypeScript partagés
├── utils/    → Helpers & fonctions utilitaires pures
└── index.ts  → Entrée principale du bot
```

> \[!NOTE]
> Cette architecture est susceptible d'évoluer lors du prochain refactor.

## ⚙️ Principes de base
### 📦 TypeScript First
Le projet est entièrement en **TypeScript**, pour améliorer la **Developer Experience (DX)**, renforcer la **sécurité** à l'exécution et bénéficier d'un **code auto-documenté**.

### 📡 API Cash Sights
La communication avec l'API Cash Sights est centralisée dans les fichiers du dossier `services/`, en utilisant **Axios**, et sécurisée à l'aide de tokens stockés dans les fichiers d'environnement (`.env.production`, etc.).

## 🧩 Commandes Discord
Les commandes sont **modulaires**, **déclaratives** et conformes à Discordjs v14.

Structure d'une commande (TS) :
```ts
export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('monitoring')

export const cooldown = 5 as const; // optionnel

export async function main(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  // logique ici
}
```

### 🔄 Déploiement des commandes
Un script dédié `/src/config/deploy-commands.ts` permet d'enregistrer dynamiquement les commandes via l'API Discord :

```bash
npm run deploy:commands
```

## 🔁 Événements Discord
Les événements sont définis dans `events/`, chaque fichier correspondant à un listener (ex : `ready`, `interactionCreate`, `messageCreate`, etc.).

```ts
export const config = {
  name: Events.ClientReady,
  once: true,
};

/**
 * Listener de l’événement ClientReady
 * @param client Client DiscordJS
 */
export const main = async (client: Client): Promise<void> => {
  console.log(`Connected! Logged in as ${client.user?.tag}`);
};
```

## 🧠 Services Métiers
La logique métier (ex : appels API, calculs, validation) est **isolée** dans des services (`/services/`), afin d'éviter la duplication de logique dans les commandes ou les événements.

Exemple :
```ts
// notify-page-change.service.js
import { Client, TextChannel } from 'discord.js';
import { ENV } from '../config/env-loader';
import { buildPageChangeEmbed } from '../utils/build-embed/build-page-change-embed';

export async function notifyPageChange(
  client: Client,
  args: { type: string; arr: Array<{ url: string; change: Record<string, boolean> }> }
): Promise<void> {
  const embed = buildPageChangeEmbed(args.type, args.arr);

  try {
    const channel = await client.channels.fetch(ENV.DISCORD_CHANNEL_NOTIFIER) as TextChannel;
    await channel.send({ embeds: [embed] });
  } catch (error) {
    // TODO: remplacer par logger
    console.error(error);
  }
}
```

## 🔌 Configuration & Environnement
Le projet utilise `--env-file` pour charger les variables d'environnement :
* `NODE_ENV`
* `DISCORD_TOKEN`
* `DISCORD_CLIENT_ID`
* `DISCORD_CHANNEL_NOTIFIER`

La configuration sensible ne doit **jamais** être hardcodée dans le code source.

## 🧰 Utils & Helpers
Des utilitaires génériques sont disponibles dans `utils/` (ex : formatage de dates, gestion des erreurs, validation de données).

## 🧪 Tests *(en cours de structuration)*
* Framework de test : **Jest**
* Stratégie :
  * Tests unitaires des services métier
  * Mocks d'API avec `nock` ou `msw`
  * (plus tard) tests d'intégration via un client Discord simulé

Structure des fichiers de test :
```txt
src/
└── test/
    └── services/
        └── user.service.test.ts
```

## 🪝 Jobs & Planification
Le dossier `job/` inclut les tâches planifiées (ex : rappels automatiques, synchronisations périodiques).

## 🚦 Lint & Qualité de code
Le projet utilise :
* **ESLint** avec configuration TypeScript
* **Prettier** pour le formatage automatique
* Règles strictes :
  * Pas de `console.log` en production
  * Typage explicite obligatoire

```bash
npm run lint
```

## 🧬 Déploiement & Exécution
* En local : `npm run dev`

> À terme, une configuration `build` + `ts-node` est envisagée pour ce projet

## 🤝 Contribution
Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour :
* Le workflow Git
* La convention de commit (Gitmoji)
* Les bonnes pratiques de PR

> Pour toute évolution d'architecture ou discussion structurelle, merci de créer une *issue* dédiée ou de ping un membre du core.

---

> 🧠 Le mot d'ordre : **robustesse, simplicité, scalabilité.**
> Un bon bot est un bot discret, rapide, et fiable.