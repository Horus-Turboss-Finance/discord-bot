# 🛠️ CONTRIBUTING.md  
Merci de vouloir contribuer à **Cash Sights – Bot Discord Utilitaire** !  
Ce document définit les bonnes pratiques de développement pour garantir un code robuste, lisible et maintenable.

## 🧠 Préambule
Tout développement doit :
- Partir d’une *issue* claire (fonctionnalité, bug, amélioration)
- S'intégrer dans le **GitFlow simplifié** du projet

## 🔧 Stack et Contexte
- **Environnement** : Node.js + Discord.js
- **Langage** : Javascript
- **Gestion de versions** : Git
- **Convention de commits** : [Gitmoji](https://gitmoji.dev/)
- **Workflow Git** : GitFlow simplifié (cf. ci-dessous)

## 📁 Structure du projet
Le bot suit une structure modulaire claire (commands, events, services, utils). Merci de respecter cette architecture lors de l'ajout ou la modification de code.

## 📦 Installation du projet
Avant de commencer le développement :
```bash
npm install
```

Pense aussi à créer un fichier `production.env` à la racine du projet (voir le `.env.example` pour le format).

## 🗂️ Branching Strategy
### 🔧 Types de branches
| Type       | Préfixe        | Description                           | Base        | Destination |
|------------|----------------|---------------------------------------|-------------|-------------|
| Feature    | `feature/`     | Nouvelle fonctionnalité               | `develop`   | `develop`   |
| Fix        | `fix/`         | Correction non urgente                | `develop`   | `develop`   |
| Hotfix     | `hotfix/`      | Correction urgente (prod)             | `main`      | `main`      |
| Refactor   | `refactor/`    | Refonte sans changement fonctionnel   | `develop`   | `develop`   |
| Chore      | `chore/`       | Maintenance ou tâche annexe           | `develop`   | `develop`   |

### 🧾 Convention de nommage
```bash
<type>/<issue-id>-<slug>
```

Exemples :
* `feature/123-login-api`
* `fix/234-empty-input-crash`

## 🔄 Cycle complet d'une fonctionnalité
### 1. 📌 Création d’une issue
* Créer une *issue* avec : description, contexte, critères d’acceptation.
* Taguer avec le bon type (`feature`, `fix`, `chore`, etc.).

### 2. 🌱 Création de branche
```bash
git checkout develop
git pull
git checkout -b feature/123-register-endpoint
```

### 3. 💻 Développement local
* Suivre les conventions du projet (`pnpm`, TypeScript, structure modulaire).
* Faire des commits clairs et gitmoji-compliants :
  ```bash
  git commit -m ":sparkles: Ajout de l'endpoint d'inscription"
  ```

#### 🔑 Principaux gitmojis utilisés :
| Emoji | Code                 | Description                            |
| ----- | -------------------- | -------------------------------------- |
| ✨    | `:sparkles:`         | Nouvelle fonctionnalité                |
| 🐛    | `:bug:`              | Correction de bug                      |
| ♻️    | `:recycle:`          | Refactoring                            |
| 🔥    | `:fire:`             | Suppression de code ou fichier inutile |
| 🧪    | `:test_tube:`        | Ajout ou MAJ de tests                  |
| 📝    | `:memo:`             | MAJ de documentation                   |
| 💄    | `:lipstick:`         | MAJ UI / style                         |
| 🚚    | `:truck:`            | Renommage ou déplacement de fichier    |
| ✅    | `:white_check_mark:` | Ajout d'un test passé avec succès      |

### 4. ⬆️ Push & Pull Request

```bash
git push origin feature/123-register-endpoint
```

* Créer une **PR vers `develop`**
* Utiliser un template
* Vérifier que les conditions pour la PR sont complété

### 5. 🔍 Code Review
* Min. 1 reviewer
* Respect des normes (`ESLint`, `Prettier`, structure, testabilité)

## ✅ Tests & Vérifications
Avant toute **pull request**, merci de :
1. Vérifier que l'application se build correctement :
   ```bash
   pnpm build
   ```

2. Lancer les tests (soon) :
   ```bash
   npm run test
   ```

3. Lancer le linter :
   ```bash
   pnpm lint
   ```

4. Vérifier que le bot fonctionne localement (en mode dev) :
   ```bash
   npm run dev
   ```

## 🎯 Releases & Versioning
### 📦 Versioning : Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH[-label]
```

| Type   | Raison                                         |
| ------ | ---------------------------------------------- |
| MAJOR  | Breaking change                                |
| MINOR  | Nouvelle fonctionnalité compatible             |
| PATCH  | Bugfix / modification mineure                  |
| -label | Pre-release (`-alpha`, `-beta`, `-rc.1`, etc.) |

#### Utilisation du label :
| Situation                             | Utiliser `-label` ? | Exemple        |
| ------------------------------------- | ------------------- | -------------- |
| Fonctionnalité incomplète             | ✅ Oui              | `1.5.0-alpha`  |
| Testable mais pas prête pour la prod  | ✅ Oui              | `1.5.0-beta.3` |
| Release candidate pour test final     | ✅ Oui              | `1.5.0-rc.1`   |
| Release stable et prête pour prod     | ❌ Non              | `1.5.0`        |

Exemples :
* `1.4.0` : ajout d’une nouvelle feature
* `1.4.1` : correction d’un bug
* `2.0.0` : changement cassant
* `2.0.0-beta.1` : version bêta

### 🛠️ Processus de release
1. Regrouper les PR dans `develop`
2. Préparer la release :
   ```bash
   git checkout main
   git pull
   git merge develop
   git tag -a v1.4.0 -m "Release v1.4.0"
   git push origin main --tags
   ```
3. Le pipeline CI déclenche le déploiement
4. (Si hotfix a été fait sur `main`) :
   ```bash
   git checkout develop
   git pull origin main
   ```

## 🧪 Post-merge checklist
* [ ] L’application build correctement (`pnpm build`)
* [ ] Les tests passent (`pnpm test`)
* [ ] Lint OK (`pnpm lint`)
* [ ] Fonctionne en local (`pnpm dev`)
* [ ] SSR fonctionnel (`node ./server.js`)
* [ ] L’issue associée est **clôturée**
* [ ] Le changelog est à jour (automatique ou manuel)

## 📝 Exemple complet
```bash
# Étape 1 : Création de la branche
git checkout develop
git pull
git checkout -b feature/321-register-endpoint

# Étape 2 : Développement
# ... code + commits
git commit -m ":sparkles: Ajout du formulaire d'inscription"

# Étape 3 : Push & PR
git push origin feature/321-register-endpoint
# → PR vers develop

# Étape 4 : Merge PR → develop

# Étape 5 : Release
git checkout main
git merge develop
git tag -a v1.4.0 -m "Release v1.4.0"
git push origin main --tags
```

## 📥 Création d'une Pull Request
Une PR propre doit :
* Utiliser un template fourni (ou justifier pourquoi blank)
* Avoir un titre explicite et une description claire
* Passer les tests
* Être relue et approuvée par **au moins 1 membre de l'équipe core**
* Inclure des commentaires si une logique complexe est ajoutée

## 💬 Code Review
Lors d'une revue de code, nous portons attention à :
* Lisibilité et clarté du code
* Respect de l'architecture modulaire
* Utilisation cohérente des services, commandes et événements
* Gestion propre des erreurs (try/catch, logs)
* Tests associés si pertinents
* Messages de commit clairs et bien formatés
* Aucune console.log / TODO non justifié

## 🧹 Normes de Code
* Favoriser les fonctions pures et services isolés
* Utiliser `async/await` avec gestion des erreurs propre
* Préférer les noms explicites plutôt que les abréviations
* Ne jamais hardcoder de valeurs sensibles (utiliser `production.env`)
* Ne pas oublier de typer toutes les entrées/sorties de fonction

## 🧪 Ajout de commandes Discord
Les commandes sont déclarées dans `/commands/` sous forme de fichiers Javascript.
Merci de suivre l'exemple de structure fourni pour :
* L'organisation des arguments
* La gestion des erreurs
* L'appel aux services ou APIs
* La réponse à l'utilisateur (`interaction.reply(...)`)

## 🙏 Merci !
Merci de contribuer à rendre **Cash Sights** plus robuste et plus agréable à utiliser !

Votre rigueur sur ce processus permet à **Cash Sights** de rester une base de code saine, maintenable et évolutive.

Pour toute question, n'hésitez pas à ouvrir une *issue* ou à contacter un membre de l'équipe core.