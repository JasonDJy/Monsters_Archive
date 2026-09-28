// ============================================================================
// Monster.js — COMPOSANT "UNE créature"
// ----------------------------------------------------------------------------
// Responsabilité : représenter UNE créature = ses données (propriétés) + sa
// ligne <tr> dans le tableau (affichage, mode édition, sauvegarde, suppression).
//
// Ce composant ne sait PAS :
//   - comment la liste est triée / filtrée / comptée  (=> MonstersList)
//   - comment fonctionne l'API en détail              (=> MonstersApi, injectée)
// Il prévient la liste de ce qui s'est passé via deux CALLBACKS (onUpdate, onDelete).
// ============================================================================

import monsterTemplate from "../templates/monster.html?raw"; // "?raw" : Vite importe le fichier sous forme de texte
import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX } from "../config.js";

// --- Préparation du template (exécutée UNE seule fois, au chargement du module) ---
// Un <template> est un conteneur HTML inerte : il accepte un <tr> comme racine,
// contrairement à un <div>. On le remplit avec le texte du fichier monster.html.
const templateElement = document.createElement("template");
templateElement.innerHTML = monsterTemplate;

export default class Monster {
  // ------------------------------------------------------------------------
  // PROPRIÉTÉS (données de base)
  // ------------------------------------------------------------------------
  id; // identifiant généré par MockAPI
  name;
  type;
  dangerLevel; // nombre de 1 à 5
  year; // nombre de 1950 à 1969

  // Propriétés techniques
  element; // la ligne <tr> de cette créature dans le DOM
  #api; // instance de MonstersApi (injectée, privée)
  #onUpdate; // callback : "je viens d'être modifiée"
  #onDelete; // callback : "je viens d'être supprimée"
  #refs; // raccourcis vers les éléments internes de la ligne

  /**
   * @param {{id: string, name: string, type: string, dangerLevel: number, year: number}} data
   *        Données brutes venant de l'API.
   * @param {Object} deps Dépendances injectées par MonstersList.
   * @param {import("../api/MonstersApi.js").default} deps.api
   * @param {(monster: Monster) => void} deps.onUpdate
   * @param {(monster: Monster) => void} deps.onDelete
   */
  constructor(data, { api, onUpdate, onDelete }) {
    this.#api = api;
    this.#onUpdate = onUpdate;
    this.#onDelete = onDelete;

    this.#assign(data);
    this.#buildElement();
    this.render();
  }

  // ------------------------------------------------------------------------
  // PROPRIÉTÉS CALCULÉES (computed) : dérivées des données, jamais stockées
  // ------------------------------------------------------------------------

  /** Vrai si la ligne est en mode édition (classe CSS "isEditing" présente). */
  get isEditing() {
    return this.element.classList.contains("isEditing");
  }

  /** Niveau de danger sous forme de têtes de mort : 3 -> "☠️☠️☠️" (bonus). */
  get dangerSkulls() {
    return "☠️".repeat(this.dangerLevel);
  }

  // ------------------------------------------------------------------------
  // VALIDATION (méthode statique : utilisable SANS créer de Monster,
  // notamment par le formulaire d'ajout de MonstersList)
  // ------------------------------------------------------------------------

  /**
   * Vérifie qu'un objet de données respecte les règles du cahier des charges.
   * @returns {string|null} Un message d'erreur, ou null si tout est valide.
   */
  static validate({ name, type, dangerLevel, year }) {
    if (!name || name.trim() === "") return "The name is required.";
    if (!type) return "The type is required.";
    if (!Number.isInteger(dangerLevel) || dangerLevel < DANGER_MIN || dangerLevel > DANGER_MAX) {
      return `Danger level must be a whole number between ${DANGER_MIN} and ${DANGER_MAX}.`;
    }
    if (!Number.isInteger(year) || year < YEAR_MIN || year > YEAR_MAX) {
      return `Release year must be a whole number between ${YEAR_MIN} and ${YEAR_MAX}.`;
    }
    return null;
  }

  // ------------------------------------------------------------------------
  // MÉTHODES PRIVÉES D'INITIALISATION
  // ------------------------------------------------------------------------

  /** Copie les données de l'API dans les propriétés de l'objet. */
  #assign({ id, name, type, dangerLevel, year }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.dangerLevel = Number(dangerLevel); // sécurité : l'API pourrait renvoyer une chaîne
    this.year = Number(year);
  }

  /** Clone le template, mémorise les éléments utiles et branche les événements. */
  #buildElement() {
    // cloneNode(true) : copie profonde => chaque créature a sa propre ligne
    this.element = templateElement.content.querySelector(".monster-row").cloneNode(true);

    // On cherche les éléments UNE fois ici, plutôt qu'à chaque render()
    const q = (selector) => this.element.querySelector(selector);
    this.#refs = {
      viewName: q(".view-name"),
      viewType: q(".view-type"),
      viewDanger: q(".view-danger"),
      viewYear: q(".view-year"),
      inputName: q(".input-name"),
      inputType: q(".input-type"),
      inputDanger: q(".input-danger"),
      inputYear: q(".input-year"),
    };

    // Événements : les fonctions fléchées gardent le bon "this" (l'instance Monster)
    q(".btn-edit").addEventListener("click", () => this.startEditing());
    q(".btn-check").addEventListener("click", () => this.save());
    q(".btn-delete").addEventListener("click", () => this.remove());

    // Confort clavier : Entrée = enregistrer, Échap = annuler (seulement en édition)
    this.element.addEventListener("keydown", (event) => {
      if (!this.isEditing) return;
      // Sur un bouton, Entrée déclenche déjà un "click" : on l'ignore pour ne pas sauvegarder 2 fois
      if (event.target.closest("button")) return;
      if (event.key === "Enter") this.save();
      if (event.key === "Escape") this.cancelEditing();
    });
  }

  // ------------------------------------------------------------------------
  // AFFICHAGE (gestion du DOM)
  // ------------------------------------------------------------------------

  /**
   * Synchronise le DOM avec les propriétés de l'objet.
   * On utilise textContent / .value (et non innerHTML) : le texte saisi par
   * l'utilisateur n'est jamais interprété comme du HTML (protection XSS).
   */
  render() {
    const r = this.#refs;

    // Mode affichage
    r.viewName.textContent = this.name;
    r.viewType.textContent = this.type;
    r.viewDanger.textContent = this.dangerSkulls;
    r.viewDanger.title = `Danger level ${this.dangerLevel}`;
    r.viewYear.textContent = this.year;

    // Mode édition (champs pré-remplis avec les valeurs actuelles)
    r.inputName.value = this.name;
    r.inputType.value = this.type;
    r.inputDanger.value = this.dangerLevel;
    r.inputYear.value = this.year;
  }

  /** Passe en mode édition : la classe "isEditing" fait tout le travail (CSS du gabarit). */
  startEditing() {
    this.element.classList.add("isEditing");
    this.#refs.inputName.focus();
  }

  /** Revient en mode affichage. */
  stopEditing() {
    this.element.classList.remove("isEditing");
  }

  /** Annule l'édition : on remet les champs à leurs valeurs d'origine. */
  cancelEditing() {
    this.render();
    this.stopEditing();
  }

  // ------------------------------------------------------------------------
  // ACTIONS (modifient les données ET l'API)
  // ------------------------------------------------------------------------

  /** Lit les champs du mode édition et renvoie un objet de données typé. */
  #readInputs() {
    const r = this.#refs;
    return {
      name: r.inputName.value.trim(),
      type: r.inputType.value,
      dangerLevel: Number(r.inputDanger.value), // les <input> renvoient toujours du texte
      year: Number(r.inputYear.value),
    };
  }

  /** Valide les champs, envoie la modification à l'API, puis met à jour l'affichage. */
  async save() {
    const newData = this.#readInputs();

    const error = Monster.validate(newData);
    if (error) {
      alert(error);
      return; // on reste en mode édition pour laisser corriger
    }

    try {
      // 1) On attend la confirmation de l'API...
      const saved = await this.#api.update(this.id, newData);
      // 2) ...puis seulement on met à jour l'objet, le DOM et la liste
      this.#assign(saved);
      this.render();
      this.stopEditing();
      this.#onUpdate(this); // la liste re-trie / re-filtre / recompte
    } catch (error) {
      console.error(error);
      alert("Could not save the creature. Please try again.");
    }
  }

  /** Demande confirmation, supprime dans l'API, puis prévient la liste. */
  async remove() {
    if (!confirm(`Delete "${this.name}" from the archive?`)) return;

    try {
      await this.#api.remove(this.id);
      this.element.remove(); // retire la ligne du DOM
      this.#onDelete(this); // la liste retire l'objet de son tableau et recompte
    } catch (error) {
      console.error(error);
      alert("Could not delete the creature. Please try again.");
    }
  }
}
