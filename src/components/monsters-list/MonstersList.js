// ============================================================================
// MonstersList.js — COMPOSANT "LA LISTE DES CRÉATURES" (le chef d'orchestre)
// ----------------------------------------------------------------------------
// Il charge les créatures, les affiche et gère toutes les actions.
// C'est le SEUL composant qui parle à l'API (via DB.js).
//
// Ordre toujours respecté pour une action : DB -> tableau -> DOM
// ============================================================================

import DB from "../../DB.js";
import Monster from "../monster/Monster.js";
import getTemplate from "./template.js";

export default class MonstersList {
  /**
   * @param {Object} data { el: sélecteur de l'élément cible, apiURL: adresse de l'API }
   */
  constructor(data) {
    this.domElt = document.querySelector(data.el);
    DB.setApiURL(data.apiURL);
    this.monsters = []; // tableau d'objets Monster
    this.searchTerm = ""; // bonus : texte de la recherche
    this.sortKey = ""; // bonus : colonne de tri ("" = pas de tri)
    this.sortAscending = true; // bonus : true = croissant, false = décroissant
    this.loadMonsters();
  }

  /** Récupère les créatures depuis l'API puis affiche l'application. */
  async loadMonsters() {
    const monsters = await DB.findAll();
    // On transforme chaque objet JSON brut en une vraie instance de Monster
    this.monsters = monsters.map((monster) => new Monster(monster));
    this.render();
  }

  // --------------------------------------------------------------------------
  // CALCULS (ne touchent pas au DOM)
  // --------------------------------------------------------------------------

  /** @returns {number} Le nombre TOTAL de créatures. */
  getMonstersCount() {
    return this.monsters.length;
  }

  /**
   * Bonus : les créatures à afficher, filtrées par la recherche puis triées.
   * @returns {Monster[]}
   */
  getVisibleMonsters() {
    // toLowerCase() : "alien" trouve aussi "Alien"
    const term = this.searchTerm.toLowerCase();

    // On garde les créatures dont le nom OU le type contient le texte cherché
    const result = this.monsters.filter(
      (monster) =>
        monster.name.toLowerCase().includes(term) || monster.type.toLowerCase().includes(term),
    );

    // Tri seulement si une colonne a été choisie
    if (this.sortKey !== "") {
      result.sort((a, b) => {
        // a[this.sortKey] lit la propriété choisie (ex : a["year"] = a.year)
        if (a[this.sortKey] < b[this.sortKey]) return this.sortAscending ? -1 : 1;
        if (a[this.sortKey] > b[this.sortKey]) return this.sortAscending ? 1 : -1;
        return 0;
      });
    }
    return result;
  }

  // --------------------------------------------------------------------------
  // AFFICHAGE (touche au DOM)
  // --------------------------------------------------------------------------

  /** Affiche l'application complète (une seule fois, au chargement). */
  render() {
    this.domElt.innerHTML = getTemplate();
    this.listDomElt = this.domElt.querySelector(".monsters-body");
    this.renderList();
    this.renderMonstersCount();
    this.initEvents();
  }

  /** Vide le tableau puis y ajoute le <tr> de chaque créature visible. */
  renderList() {
    this.listDomElt.innerHTML = "";
    this.getVisibleMonsters().forEach((monster) => this.listDomElt.append(monster.render()));
  }

  /** Affiche le nombre total de créatures. */
  renderMonstersCount() {
    this.domElt.querySelector(".monsters-count").innerText = this.getMonstersCount();
  }

  // --------------------------------------------------------------------------
  // ÉVÉNEMENTS
  // Les fonctions fléchées () => gardent "this" = la liste.
  // --------------------------------------------------------------------------

  initEvents() {
    // Bouton "Add to the archive"
    this.domElt.querySelector(".btn-add").addEventListener("click", () => {
      this.addMonster();
    });

    // Bonus : recherche, à chaque lettre tapée
    this.domElt.querySelector(".search-input").addEventListener("input", (e) => {
      this.searchTerm = e.target.value;
      this.renderList();
    });

    // Bonus : tri, au clic sur un en-tête de colonne
    this.domElt.querySelectorAll(".sort-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault(); // empêche le lien "#" de remonter en haut de la page
        this.sortBy(link.dataset.sort); // dataset.sort lit l'attribut data-sort
      });
    });

    // Événements émis par les Monster (ils "remontent" jusqu'au <tbody>)
    this.listDomElt.addEventListener("monster:updated", async (e) => {
      await this.updateOne(e.detail.monster);
    });
    this.listDomElt.addEventListener("monster:deleted", async (e) => {
      await this.deleteOneById(e.detail.id);
    });
  }

  // --------------------------------------------------------------------------
  // ACTIONS (CRUD)
  // --------------------------------------------------------------------------

  /** Ajoute une créature à partir du formulaire. */
  async addMonster() {
    const nameInput = this.domElt.querySelector(".new-name");
    const dangerInput = this.domElt.querySelector(".new-danger");
    const yearInput = this.domElt.querySelector(".new-year");

    // Les champs renvoient du texte : Number() le transforme en nombre
    const data = {
      name: nameInput.value.trim(),
      type: this.domElt.querySelector(".new-type").value,
      dangerLevel: Number(dangerInput.value),
      year: Number(yearInput.value),
    };

    if (!Monster.isValid(data)) {
      alert("Please check the name, the danger level (1-5) and the year (1950-1969).");
      return;
    }

    // 1) DB : le serveur renvoie la créature avec son id
    const monster = await DB.create(data);
    // 2) Tableau
    this.monsters.push(new Monster(monster));
    // 3) DOM
    this.renderList();
    this.renderMonstersCount();

    // On vide le formulaire
    nameInput.value = "";
    dangerInput.value = "";
    yearInput.value = "";
  }

  /**
   * Enregistre une créature modifiée (le Monster a déjà mis à jour
   * ses propriétés et son affichage).
   * @param {Monster} monster
   */
  async updateOne(monster) {
    return await DB.updateOne(monster);
  }

  /**
   * Supprime une créature.
   * @param {string} id
   */
  async deleteOneById(id) {
    // 1) DB
    await DB.deleteOneById(id);
    // 2) Tableau : findIndex trouve la position, splice(index, 1) supprime 1 élément
    this.monsters.splice(
      this.monsters.findIndex((monster) => monster.id == id),
      1,
    );
    // 3) DOM
    this.domElt.querySelector(`[data-id='${id}']`).remove();
    this.renderMonstersCount();
  }

  /**
   * Bonus : trie par la colonne cliquée. Un 2e clic inverse l'ordre.
   * @param {string} key "name", "type", "dangerLevel" ou "year"
   */
  sortBy(key) {
    if (this.sortKey === key) {
      this.sortAscending = !this.sortAscending; // true devient false et inversement
    } else {
      this.sortKey = key;
      this.sortAscending = true;
    }
    this.renderList();
  }
}
