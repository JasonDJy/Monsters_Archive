// ============================================================================
// config.js — CONSTANTES DE L'APPLICATION
// ----------------------------------------------------------------------------
// Les valeurs "fixes" du cahier des charges, regroupées à un seul endroit.
// Si une valeur change, on la modifie ICI et nulle part ailleurs.
// ============================================================================

// Adresse de notre projet MockAPI (avec le "/" à la fin)
export const API_URL = "https://6aba56175b549d818d624c13.mockapi.io/api/v1/";

// Niveau de danger : de 1 à 5
export const DANGER_MIN = 1;
export const DANGER_MAX = 5;

// Année de sortie du film : de 1950 à 1969
export const YEAR_MIN = 1950;
export const YEAR_MAX = 1969;

// Types proposés dans les <select> (formulaire d'ajout ET mode édition)
export const MONSTER_TYPES = [
  "Giant reptile",
  "Alien",
  "Mutant",
  "Giant insect",
  "Robot",
  "Deep-sea creature",
];
