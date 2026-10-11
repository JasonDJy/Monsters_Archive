// ============================================================================
// Monster.js — COMPOSANT "UNE CRÉATURE"
// ----------------------------------------------------------------------------
// Représente UNE créature (une ligne <tr> du tableau).
// Il connaît ses propriétés, sait se rendre à l'écran et gère ses propres
// boutons (modifier, enregistrer, supprimer).
//
// Il ne parle PAS à l'API et ne connaît PAS son parent :
// quand il se passe quelque chose, il ÉMET un événement (dispatch)
// et c'est MonstersList qui écoute et décide quoi faire.
// ============================================================================

import getTemplate from "./template.js";
import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX } from "../../config.js";

export default class Monster {
  /**
   * @param {Object} data Objet JSON venu de l'API : { id, name, type, dangerLevel, year }
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    // Number() : on s'assure d'avoir des nombres (et pas du texte)
    this.dangerLevel = Number(data.dangerLevel);
    this.year = Number(data.year);
    // On réserve une place pour stocker le <tr> de cette créature
    this.domElt = null;
  }

  /**
   * Calcule les têtes de mort à afficher.
   * @returns {string}
   */
  getDangerSkulls() {
    return "☠️".repeat(this.dangerLevel);
  }

  /**
   * Vérifie que les données respectent le cahier des charges.
   * "static" : on l'appelle sur la classe (Monster.isValid(...)) car,
   * lors d'un ajout, la créature n'existe pas encore.
   * @param {Object} data { name, type, dangerLevel, year }
   * @returns {boolean} true si tout est correct
   */
  static isValid(data) {
    if (data.name === "") return false;
    if (data.dangerLevel < DANGER_MIN || data.dangerLevel > DANGER_MAX) return false;
    if (data.year < YEAR_MIN || data.year > YEAR_MAX) return false;
    return true;
  }

  /**
   * Crée le <tr> de la créature, ajoute ses événements et le RETOURNE.
   * C'est le parent (MonstersList) qui décide où le placer.
   * @returns {HTMLElement}
   */
  render() {
    // <template> : son contenu est lu mais pas affiché.
    // On y met notre HTML puis on récupère le premier vrai élément (le <tr>).
    const template = document.createElement("template");
    template.innerHTML = getTemplate(this);
    this.domElt = template.content.firstElementChild;
    this.initEvents();
    return this.domElt;
  }

  /**
   * Met à jour la créature (propriétés + affichage) puis prévient le parent.
   * @param {Object} data { name, type, dangerLevel, year }
   */
  update(data) {
    // 1) Les propriétés
    this.name = data.name;
    this.type = data.type;
    this.dangerLevel = data.dangerLevel;
    this.year = data.year;

    // 2) Le DOM : on met à jour les textes du mode lecture
    this.domElt.querySelector(".name-text").innerText = this.name;
    this.domElt.querySelector(".type-text").innerText = this.type;
    this.domElt.querySelector(".danger-text").innerText = this.getDangerSkulls();
    this.domElt.querySelector(".danger-text").title = "Danger level " + this.dangerLevel;
    this.domElt.querySelector(".year-text").innerText = this.year;

    // On repasse en mode lecture
    this.domElt.classList.remove("isEditing");

    // 3) On prévient le parent (c'est lui qui parle à l'API)
    this.dispatch("monster:updated", { monster: this });
  }

  /** Ajoute les événements sur les boutons de la ligne. */
  initEvents() {
    // Crayon : passer en mode édition (le CSS du gabarit gère l'affichage)
    this.domElt.querySelector(".btn-edit").addEventListener("click", () => {
      this.domElt.classList.add("isEditing");
    });

    // Check : lire les champs et enregistrer
    this.domElt.querySelector(".btn-check").addEventListener("click", () => {
      const data = {
        name: this.domElt.querySelector(".input-name").value.trim(),
        type: this.domElt.querySelector(".input-type").value,
        dangerLevel: Number(this.domElt.querySelector(".input-danger").value),
        year: Number(this.domElt.querySelector(".input-year").value),
      };
      if (!Monster.isValid(data)) {
        alert("Please check the name, the danger level (1-5) and the year (1950-1969).");
        return; // on reste en mode édition pour laisser corriger
      }
      this.update(data);
    });

    // Crâne : demander au parent de supprimer cette créature
    this.domElt.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("Delete " + this.name + " from the archive?")) {
        this.dispatch("monster:deleted", { id: this.id });
      }
    });
  }

  /**
   * Émet un événement personnalisé vers le parent.
   * bubbles: true -> l'événement "remonte" dans le DOM jusqu'à MonstersList.
   * @param {string} type   Nom de l'événement (ex : "monster:deleted")
   * @param {Object} detail Données envoyées avec l'événement
   */
  dispatch(type, detail) {
    this.domElt.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }));
  }
}
