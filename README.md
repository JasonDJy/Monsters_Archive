# 🦖 Monster Archive

Gestion d'un bestiaire de créatures de films de série B (1950-1969).
**JavaScript moderne** (classes ES6, modules, champs privés) + **Vite** + **API REST MockAPI**.

## Installation

```bash
npm install
cp .env.example .env     # puis mettre l'URL de VOTRE projet MockAPI dans .env
npm run dev              # serveur de développement
npm run build            # version de production dans /dist
npm run preview          # tester la version de production
```

## MockAPI

Ressource `monsters` avec les champs `name` (String), `type` (String),
`dangerLevel` (Number), `year` (Number). L'`id` est généré automatiquement.
`VITE_API_URL` = URL de base du projet (ex. `https://xxxx.mockapi.io/api/v1`), **sans** `/monsters`.

## Architecture (un dossier par composant : `Classe.js` + `template.js`)

```
index.html                         Page + point de montage <main id="monsters-app">
vite.config.js                     Config Vite (base relative pour le build)
src/
├── main.js                        Point d'entrée : DB.getMonsters() puis new MonstersList().render()
├── DB.js                          Accès à l'API (classe statique : GET / POST / PUT / DELETE)
├── config.js                      URL de l'API, bornes de validation, types de créatures
├── utils.js                       escapeHtml (anti-XSS) et getTypeOptions
├── style.css                      CSS du gabarit
└── components/
    ├── monster/
    │   ├── Monster.js             UNE créature : données, validate(), render()
    │   └── template.js            getTemplate(monster) -> HTML d'un <tr>
    └── monsters-list/
        ├── MonstersList.js        LA liste : ajout, compteur, recherche, tri, actions des lignes
        └── template.js            getTemplate() -> HTML du formulaire + tableau
```

## Choix techniques

- **Vite** : serveur de dev rapide, modules ES, build de production minifié.
- **Délégation d'événements** : un écouteur par zone (formulaire, `<thead>`, `<tbody>`), les boutons portent `data-action`.
- **Templates en fonctions JS** : valeurs échappées avec `escapeHtml` car injectées via `innerHTML`.
- Tailwind, polices et Font Awesome restent en CDN, comme dans le gabarit fourni.
