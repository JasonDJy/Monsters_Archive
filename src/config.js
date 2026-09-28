// ============================================================================
// config.js — Constantes partagées par toute l'application
// ----------------------------------------------------------------------------
// Un seul endroit pour les valeurs "magiques" : si le cahier des charges change
// (ex. niveau de danger de 1 à 10), on modifie ici et rien d'autre.
// ============================================================================

/**
 * URL de base de l'API MockAPI (SANS "/monsters" à la fin).
 *
 * - En priorité : la variable d'environnement VITE_API_URL définie dans le
 *   fichier ".env" (voir ".env.example"). Vite l'expose via `import.meta.env`.
 * - Sinon : la valeur de secours ci-dessous, à remplacer par VOTRE URL MockAPI.
 */
export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://XXXXXXXXXXXXXXXX.mockapi.io/api/v1";

// Bornes de validation définies dans le cahier des charges
export const DANGER_MIN = 1;
export const DANGER_MAX = 5;
export const YEAR_MIN = 1950;
export const YEAR_MAX = 1969;
