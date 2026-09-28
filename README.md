# 🦖 Monster Archive

Application de gestion d'un bestiaire de créatures de films de série B (1950-1969).
**Vanilla JavaScript moderne** (classes ES6, modules) + **Vite** + **API REST MockAPI**.

## Installation

```bash
npm install
cp .env.example .env     # puis mettre l'URL de VOTRE projet MockAPI dans .env
npm run dev              # serveur de développement
npm run build            # version de production dans /dist
npm run preview          # tester la version de production
```

## Mise en place de MockAPI

1. Créer un projet sur [mockapi.io](https://mockapi.io).
2. Ajouter une ressource `monsters` avec les champs :
   `name` (String), `type` (String), `dangerLevel` (Number), `year` (Number).
   (`id` est généré automatiquement.)
3. Copier l'URL de base du projet (ex. `https://xxxx.mockapi.io/api/v1`) dans `.env`
   (variable `VITE_API_URL`) — **sans** `/monsters` à la fin.

## Architecture

```
index.html                    Page + point de montage <main id="monsters-app">
src/
├── main.js                   Point d'entrée : assemble API + liste
├── config.js                 URL de l'API et bornes de validation
├── style.css                 CSS du gabarit
├── api/
│   └── MonstersApi.js        Accès aux données (GET / POST / PUT / DELETE)
├── components/
│   ├── Monster.js            UNE créature : données, ligne <tr>, édition, sauvegarde, suppression
│   └── MonstersList.js       LA liste : chargement, ajout, compteur, recherche, tri
└── templates/
    ├── monster.html          Template de la ligne (un <tr>)
    └── monsters-list.html    Template du formulaire + tableau
```

| Fichier | Responsabilité unique |
|---|---|
| `MonstersApi` | Parler à l'API. Ne connaît pas le DOM. |
| `Monster` | Une créature. Prévient la liste via les callbacks `onUpdate` / `onDelete`. |
| `MonstersList` | L'ensemble des créatures. Source de vérité : `monsters`, `searchTerm`, `sortKey`, `sortDirection`. |

## Fonctionnalités

- Affichage, ajout, modification, suppression (répercutés dans l'API)
- Compteur dynamique du nombre total de créatures
- **Bonus** : recherche par nom / type, tri par colonne (2e clic = ordre inverse), niveau de danger en ☠️

## Choix techniques (DM2)

- **Vite** : serveur de dev rapide, modules ES natifs, `?raw` pour importer les templates HTML, build de production minifié.
- **Tailwind, polices et Font Awesome restent en CDN**, comme dans le gabarit fourni.
