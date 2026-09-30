# Frontoffice et backoffice

Deux projets Angular partagent les composants et services existants, mais ont des routeurs et des artefacts distincts :

| Projet | Port local | Artefact |
| --- | --- | --- |
| frontoffice | 4200 | dist/frontoffice |
| backoffice | 4300 | dist/backoffice |

Le frontoffice reprend le portail public existant (actualites, formations, recrutement, contact). Le backoffice reprend l'espace connecte existant pour les agents et administrateurs. Un eventuel espace agents separe du backoffice necessite de definir les ecrans et profils concernes. Le projet historique `frontend_mfpai` reste disponible pour compatibilite.

```text
npm.cmd run config
npm.cmd run start:frontoffice
```

Dans un second terminal :

```text
npm.cmd run start:backoffice
```

Les URLs publiques sont lues dans `.env` par `npm.cmd run config` et ecrites dans `src/assets/runtime-config.js`. Ce fichier ne doit contenir aucun secret. `environment.ts` lit cette configuration au chargement; apres deploiement, `assets/runtime-config.js` peut etre remplace sans recompiler. Configurer la revalidation ou `Cache-Control: no-store` pour ce fichier. Servir chaque artefact sur son propre domaine ou port, via HTTPS en production.

```text
npm.cmd run build:frontoffice
npm.cmd run build:backoffice
```

Chaque build conserve le routage par fragment `/#/...`. Les liens de connexion du portail pointent vers l'URL du backoffice. Le backoffice exige une session sur toutes ses routes metier; les controles definitifs se font dans l'API. Le navigateur n'envoie les jetons qu'a l'origine et au chemin de l'API configuree.

La connexion n'est pas partagee automatiquement entre deux domaines. Ne pas transferer les jetons par URL. Une federation SSO/OIDC est une integration distincte.

Sur un poste limite en memoire, la verification du backoffice a reussi avec :

```powershell
$env:NG_BUILD_MAX_WORKERS='1'
node --max-old-space-size=1536 node_modules/@angular/cli/bin/ng.js build backoffice --configuration development --source-map=false --progress=false
```
