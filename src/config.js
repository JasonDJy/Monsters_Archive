// ============================================================================
// config.js — CONSTANTES DE L'APPLICATION
// ----------------------------------------------------------------------------
// Un seul endroit pour les valeurs du cahier des charges : si une règle change,
// on la modifie ici et nulle part ailleurs.
// ============================================================================

// URL de base de l'API MockAPI (sans "/monsters" : DB.js l'ajoute)
export const API_URL = "https://6aba56175b549d818d624c13.mockapi.io/api/v1";

// Bornes de validation
export const DANGER_MIN = 1;
export const DANGER_MAX = 5;
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
