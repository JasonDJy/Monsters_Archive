# 🦖 Monster Archive – Projet Frontend (Vanilla JS moderne en composants)

## 🎯 Objectif du projet

Créer une application de gestion d'un bestiaire de créatures de films de série B (1950-1969) à partir du gabarit HTML fourni.

Implémentation attendue : **Vanilla JavaScript moderne en composants (classes ES6, modules), avec le bundler Vite JS**, connectée à une **API REST MockAPI**.

---

## 🗄️ Source de données : MockAPI

Créez un projet sur [mockapi.io](https://mockapi.io) avec une ressource `monsters` respectant ce schéma :

| Propriété | Type | Exemple |
|---|---|---|
| `id` | Object ID (généré par MockAPI) | `"1"` |
| `name` | String | `"Krakorr"` |
| `type` | String | `"Giant reptile"` |
| `dangerLevel` | Number (1 à 5) | `5` |
| `year` | Number (1950 à 1969) | `1954` |

Toutes les actions de l'utilisateur (ajout, modification, suppression) doivent être répercutées dans l'API. Un rechargement de la page ne doit perdre aucune donnée.

---

## 🧱 Architecture attendue

L'application est découpée en **composants**, chacun responsable d'une seule chose :

- une couche d'accès aux données (API) ;
- un composant représentant **une** créature ;
- un composant représentant **la liste** des créatures ;
- un template HTML par composant.

Vous devez être capable d'expliquer, de défendre et de modifier chaque fichier à la demande.

---

## 🔧 Fonctionnalités de base attendues

- 📜 Afficher les créatures de l'API au chargement
- ✅ Ajouter une créature (nom, type, niveau de danger, année)
- ✏️ Modifier une créature
- ❌ Supprimer une créature
- 🔢 Afficher dynamiquement le **nombre total de créatures**

---

## 💡 Astuce de développement

L'interface est déjà préparée pour faciliter l'édition :

```html
<!-- Exemple : une ligne en cours d'édition -->
<tr class="monster-row isEditing">
```

Ajoutez ou retirez la classe `isEditing` pour basculer entre mode édition et mode affichage d'une créature.

Les classes CSS `.isEditing-visible` et `.isEditing-hidden` gèrent déjà l'affichage conditionnel.

---

## 🌟 Défis bonus

Vous pouvez enrichir votre application avec les fonctionnalités suivantes :

- 🔍 Filtrage dynamique par nom ou type via le champ de recherche
- 🔃 Tri des créatures par nom, type, niveau de danger ou année en cliquant sur les en-têtes de colonne (`<th>`)
- ☠️ Affichage du niveau de danger sous forme de têtes de mort (niveau 3 → ☠️☠️☠️) au lieu du chiffre

---

## 📦 Livrables

À déposer : **une version Repomix de votre projet**, c'est-à-dire un fichier unique qui rassemble tout votre code.

À la racine du projet :

```bash
npx repomix
```

Déposez le fichier `repomix-output.xml` généré.

À présenter lors de l'évaluation :

- Le dépôt Git, avec un historique de commits lisible et défendable
- Le projet de développement Vite
- Une version de production (`npm run build`) fonctionnelle
