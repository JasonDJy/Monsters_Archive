// ============================================================================
// Monster.js — COMPOSANT "UNE CRÉATURE"
// ----------------------------------------------------------------------------
// Contient les données d'une créature et fournit son HTML (via template.js).
// Ne parle ni à l'API ni au DOM : c'est MonstersList qui s'en charge.
// ============================================================================

import getTemplate from "./template.js";
import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX } from "../../config.js";

export default class Monster {
  // --------------------------------------------------------------------------
  // PROPRIÉTÉS DE BASE (données venant de l'API, valeurs par défaut)
  // --------------------------------------------------------------------------
  id = null;
  name = "Unnamed creature";
  type = "Alien";
  dangerLevel = DANGER_MIN;
  year = YEAR_MIN;

  // État d'affichage : la ligne est-elle en mode édition ?
  isEditing = false;

  /** @param {Object} data Données brutes { id, name, type, dangerLevel, year }. */
  constructor(data) {
    this.update(data);
  }

  // --------------------------------------------------------------------------
  // PROPRIÉTÉ CALCULÉE (computed : dérivée des données, jamais stockée)
  // --------------------------------------------------------------------------

  /** 3 -> "☠️☠️☠️" */
  get dangerSkulls() {
    return "☠️".repeat(this.dangerLevel);
  }

  // --------------------------------------------------------------------------
  // MÉTHODES
  // --------------------------------------------------------------------------

  /**
   * Copie les données dans l'objet (à la création ET après une modification).
   * Number() : l'API peut renvoyer les nombres sous forme de texte.
   */
  update({ id, name, type, dangerLevel, year }) {
    if (id !== undefined) this.id = id;
    if (name) this.name = name;
    if (type) this.type = type;
    this.dangerLevel = Number(dangerLevel);
    this.year = Number(year);
  }

  /** @returns {string} Le HTML (<tr>) de la créature. */
  render() {
    return getTemplate(this);
  }

  /**
   * Vérifie les règles du cahier des charges.
   * Statique : utilisable sans instance (données du formulaire d'ajout).
   * @returns {string|null} Message d'erreur, ou null si tout est valide.
   */
  static validate({ name, type, dangerLevel, year }) {
    if (!name) return "The name is required.";
    if (!type) return "The type is required.";
    if (!Number.isInteger(dangerLevel) || dangerLevel < DANGER_MIN || dangerLevel > DANGER_MAX) {
      return `Danger level must be a whole number between ${DANGER_MIN} and ${DANGER_MAX}.`;
    }
    if (!Number.isInteger(year) || year < YEAR_MIN || year > YEAR_MAX) {
      return `Release year must be a whole number between ${YEAR_MIN} and ${YEAR_MAX}.`;
    }
    return null;
  }
}
