# 🦖 Monster Archive

Gestion d'un bestiaire de créatures de films de série B (1950-1969).
**JavaScript moderne en composants** (classes ES6, modules) + **Vite** + **API REST MockAPI**.

## Installation

```bash
npm install          # installe Vite
npm run dev          # serveur de développement
npm run build        # version de production dans /dist
npm run preview      # tester la version de production
```

## MockAPI

Ressource `monsters` avec les champs `name` (String), `type` (String),
`dangerLevel` (Number), `year` (Number). L'`id` est généré automatiquement.
L'URL de base du projet se trouve dans `src/config.js` (`API_URL`, **sans** `/monsters`).

## Architecture (un dossier par composant : `Classe.js` + `template.js`)

```
index.html                         Page + point de montage <main id="monsters-app">
vite.config.js                     Config Vite (base relative pour le build)
documents/                         Gabarit HTML et consignes fournis
src/
├── main.js                        Démarrage : new MonstersList({ el, apiURL })
├── DB.js                          Parle à l'API : setApiURL, findAll, create, updateOne, deleteOneById
├── config.js                      URL de l'API, bornes de validation, types de créatures
├── style.css                      CSS du gabarit
└── components/
    ├── monster/
    │   ├── Monster.js             UNE créature : render(), initEvents(), update(), dispatch()
    │   └── template.js            HTML d'un <tr>
    └── monsters-list/
        ├── MonstersList.js        Le chef d'orchestre : tableau, DOM, DB
        └── template.js            HTML du formulaire + tableau
```

## Fonctionnement

- **Ordre des actions** : DB → tableau → DOM.
- **`Monster.render()`** crée son `<tr>` via un `<template>`, ajoute ses événements et le retourne :
  c'est `MonstersList` qui décide où le placer.
- **Événements personnalisés** : `Monster` ne connaît pas son parent. Il émet `monster:updated`
  ou `monster:deleted` (`CustomEvent` avec `bubbles: true`) et `MonstersList` écoute sur le `<tbody>`.
- **Calcul / affichage séparés** : `getMonstersCount()` calcule, `renderMonstersCount()` affiche.
- **Mode édition** : ajout/retrait de la classe `isEditing` sur le `<tr>` (CSS du gabarit).
- Tailwind, polices et Font Awesome restent en CDN, comme dans le gabarit fourni.

## Bonus réalisés

- 🔍 Recherche par nom ou type (`getVisibleMonsters()`)
- 🔃 Tri en cliquant sur les en-têtes, 2e clic = ordre inversé (`sortBy()`)
- ☠️ Niveau de danger en têtes de mort (`getDangerSkulls()`)
