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
commands/            → Commandes slash et contextuelles
└── feature/
    └── kiff.js      → Exemple de commande enregistrée
events/              → Listeners d'événements Discord (ready, message, etc.)
└── ready.js
core/                → Logique métier (ex : interaction avec l'API Cash Sights)
documentation/       → (à fusionner avec core/ ou à supprimer lors du refactor)
utils/               → Helpers & fonctions utilitaires pures
services/            → Tâches planifiées / rappels / appels API
index.js             → Entrée principale du bot
CommandsRegister.js  → Script pour enregistrer les commandes auprès de l'API Discord
```

> \[!NOTE]
> Cette architecture est susceptible d'évoluer lors du prochain refactor.

## ⚙️ Principes de base
### 📦 TypeScript First
Le projet sera entièrement migré vers **TypeScript**, afin d'améliorer la **Developer Experience (DX)**, renforcer la **sécurité** à l'exécution et bénéficier d'un **code auto-documenté**.

### 📡 API Cash Sights
La communication avec l'API Cash Sights sera centralisée lors du prochain refactor dans les fichiers du dossier `services/`, en utilisant **Axios**, et sécurisée à l'aide de tokens stockés dans les fichiers d'environnement (`.env.production`, etc.).

## 🧩 Commandes Discord
Les commandes sont **modulaires**, **déclaratives** et conformes à Discordjs v14.

Structure d'une commande (JS) :

```js
module.exports.data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Monitoring du bot');

module.exports.cooldown = 5; // optionnel

/**
 * @param {import("discord.js").Interaction} interaction 
 */
module.exports.main = async (interaction) => {
  // logique ici
};
```

### 🔄 Déploiement des commandes
Un script dédié `commandsRegister.js` permet d'enregistrer dynamiquement les commandes via l'API Discord :

```bash
npm run deploy:commands
```

## 🔁 Événements Discord
Les événements sont définis dans `events/`, chaque fichier correspondant à un listener (ex : `ready`, `interactionCreate`, `messageCreate`, etc.).

```js
module.exports.config = {
  name: Events.ClientReady,
  once: true,
};

/**
 * @param {Client} client 
 */
module.exports.main = (client) => {
  console.log(`Connected! Logged in as ${client.user.tag}`);
};
```

## 🧠 Services Métiers
La logique métier (ex : appels API, calculs, validation) est **isolée** dans des services (`/services/`), afin d'éviter la duplication de logique dans les commandes ou les événements.

Exemple :

```js
// user.service.js
export async function getUserKiffScore(userId) {
  const response = await axios.get(`${API_URL}/user/${userId}/kiff`);
  return response.data;
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
└── services/
    └── user.service.test.ts
```

## 🪝 Jobs & Planification
Le dossier `services/` inclut temporairement les tâches planifiées (ex : rappels automatiques, synchronisations périodiques).
Ce dossier sera renommé `jobs/` lors du prochain refactor pour plus de clarté.

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