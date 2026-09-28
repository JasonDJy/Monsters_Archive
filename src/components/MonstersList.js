// ============================================================================
// MonstersList.js — COMPOSANT "LA LISTE des créatures"
// ----------------------------------------------------------------------------
// Responsabilité : gérer l'ENSEMBLE des créatures :
//   - charger la liste depuis l'API au démarrage
//   - formulaire d'ajout
//   - compteur total
//   - recherche (filtre) et tri par colonne (bonus)
//   - affichage des lignes (chaque ligne = un composant Monster)
//
// Principe de RÉACTIVITÉ utilisé (simple et défendable) :
//   les DONNÉES sont la source de vérité (this.monsters, this.searchTerm,
//   this.sortKey...). Dès qu'une donnée change, on appelle render() qui
//   redessine la liste et le compteur à partir de ces données.
// ============================================================================

import listTemplate from "../templates/monsters-list.html?raw";
import Monster from "./Monster.js";

export default class MonstersList {
  // ------------------------------------------------------------------------
  // PROPRIÉTÉS (données de base)
  // ------------------------------------------------------------------------
  monsters = []; // tableau d'instances de Monster (TOUTES les créatures)
  searchTerm = ""; // texte tapé dans le champ de recherche
  sortKey = null; // propriété de tri : "name" | "type" | "dangerLevel" | "year" | null
  sortDirection = "asc"; // "asc" (croissant) ou "desc" (décroissant)

  #container; // élément DOM dans lequel le composant s'affiche (<main id="monsters-app">)
  #api; // instance de MonstersApi
  #refs; // raccourcis vers les éléments internes du template

  /**
   * @param {HTMLElement} container Élément DOM de montage.
   * @param {import("../api/MonstersApi.js").default} api
   */
  constructor(container, api) {
    this.#container = container;
    this.#api = api;
  }

  // ------------------------------------------------------------------------
  // PROPRIÉTÉS CALCULÉES (computed)
  // ------------------------------------------------------------------------

  /** Nombre TOTAL de créatures (indépendant du filtre de recherche). */
  get count() {
    return this.monsters.length;
  }

  /** Créatures à afficher : `monsters` filtré par la recherche, puis trié. */
  get visibleMonsters() {
    const term = this.searchTerm.trim().toLowerCase();

    // 1) FILTRE : le nom OU le type doit contenir le texte recherché
    // (filter() renvoie un NOUVEAU tableau : this.monsters n'est pas modifié)
    const filtered = this.monsters.filter(
      (monster) =>
        monster.name.toLowerCase().includes(term) || monster.type.toLowerCase().includes(term),
    );

    // 2) TRI (seulement si l'utilisateur a cliqué sur un en-tête)
    if (this.sortKey) {
      const direction = this.sortDirection === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        const valueA = a[this.sortKey];
        const valueB = b[this.sortKey];
        // Nombres : soustraction. Textes : localeCompare (gère accents et casse).
        const result =
          typeof valueA === "number" ? valueA - valueB : String(valueA).localeCompare(valueB);
        return result * direction; // direction = -1 inverse l'ordre
      });
    }
    return filtered;
  }

  // ------------------------------------------------------------------------
  // INITIALISATION
  // ------------------------------------------------------------------------

  /** Monte le template dans la page, branche les événements et charge les données. */
  async init() {
    // Le template est un fichier statique de confiance : innerHTML est sans risque ici
    this.#container.innerHTML = listTemplate;
    this.#cacheElements();
    this.#bindEvents();

    this.#showStatus("Loading the archive...");
    try {
      const rows = await this.#api.getAll();
      // Chaque objet brut de l'API devient une instance de Monster
      this.monsters = rows.map((data) => this.#createMonster(data));
      this.render();
    } catch (error) {
      console.error(error);
      this.#showStatus("Could not reach the archive. Check the API URL in src/config.js or .env.");
    }
  }

  /** Mémorise les éléments du template dont on a besoin (recherchés une seule fois). */
  #cacheElements() {
    const q = (selector) => this.#container.querySelector(selector);
    this.#refs = {
      form: q(".add-form"),
      newName: q(".new-name"),
      newType: q(".new-type"),
      newDanger: q(".new-danger"),
      newYear: q(".new-year"),
      count: q(".monsters-count"),
      search: q(".search-input"),
      thead: q(".monsters-table thead"),
      body: q(".monsters-body"),
      status: q(".status"),
    };
  }

  /** Branche les 3 sources d'événements : formulaire, recherche, en-têtes de colonnes. */
  #bindEvents() {
    // Formulaire : "submit" se déclenche au clic sur le bouton ET à la touche Entrée
    this.#refs.form.addEventListener("submit", (event) => this.#handleAdd(event));

    // Recherche : "input" se déclenche à chaque caractère tapé
    this.#refs.search.addEventListener("input", (event) => {
      this.searchTerm = event.target.value;
      this.render();
    });

    // Tri : DÉLÉGATION d'événement — un seul écouteur sur <thead> au lieu d'un par <a>
    this.#refs.thead.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-sort]");
      if (!link) return; // clic ailleurs que sur un en-tête triable
      event.preventDefault(); // empêche le href="#" de remonter en haut de page
      this.#sortBy(link.dataset.sort);
    });
  }

  // ------------------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------------------

  /** Fabrique un composant Monster en lui donnant l'API et les callbacks. */
  #createMonster(data) {
    return new Monster(data, {
      api: this.#api,
      onUpdate: () => this.render(), // une créature a changé -> on redessine (tri/filtre/compteur)
      onDelete: (monster) => this.#removeFromList(monster),
    });
  }

  /** Ajout d'une créature depuis le formulaire. */
  async #handleAdd(event) {
    event.preventDefault(); // empêche le rechargement de la page

    const r = this.#refs;
    const data = {
      name: r.newName.value.trim(),
      type: r.newType.value,
      dangerLevel: Number(r.newDanger.value),
      year: Number(r.newYear.value),
    };

    const error = Monster.validate(data);
    if (error) {
      alert(error);
      return;
    }

    try {
      const created = await this.#api.create(data); // l'API renvoie la créature AVEC son id
      this.monsters.push(this.#createMonster(created));
      this.#refs.form.reset(); // vide le formulaire
      this.render();
    } catch (error) {
      console.error(error);
      alert("Could not add the creature. Please try again.");
    }
  }

  /** Retire une créature du tableau (appelée par le callback onDelete de Monster). */
  #removeFromList(monsterToRemove) {
    this.monsters = this.monsters.filter((monster) => monster !== monsterToRemove);
    this.render();
  }

  /**
   * Choisit la colonne de tri : un 2e clic sur la même colonne inverse l'ordre.
   * @param {string} key Nom de la propriété (attribut data-sort de l'en-tête).
   */
  #sortBy(key) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = key;
      this.sortDirection = "asc";
    }
    this.render();
  }

  // ------------------------------------------------------------------------
  // AFFICHAGE (gestion du DOM)
  // ------------------------------------------------------------------------

  /** Redessine tout ce qui dépend des données : lignes, compteur, flèches de tri, message. */
  render() {
    const visible = this.visibleMonsters;

    // Les lignes : on VIDE le <tbody> puis on remet l'élément <tr> de chaque Monster visible.
    // (replaceChildren déplace les <tr> existants : leur état, ex. mode édition, est conservé)
    this.#refs.body.replaceChildren(...visible.map((monster) => monster.element));

    // Le compteur : nombre TOTAL, pas seulement les lignes filtrées
    this.#refs.count.textContent = this.count;

    // Les flèches ▲ ▼ dans les en-têtes
    this.#refs.thead.querySelectorAll("a[data-sort]").forEach((link) => {
      const arrow = this.sortDirection === "asc" ? "▲" : "▼";
      link.querySelector(".sort-indicator").textContent =
        link.dataset.sort === this.sortKey ? arrow : "";
    });

    // Le message d'état : uniquement si rien n'est affiché
    if (visible.length > 0) {
      this.#showStatus("");
    } else if (this.count === 0) {
      this.#showStatus("The archive is empty. File your first creature!");
    } else {
      this.#showStatus("No creature matches your search.");
    }
  }

  /** Affiche un message sous le tableau, ou le masque si le texte est vide. */
  #showStatus(message) {
    this.#refs.status.textContent = message;
    this.#refs.status.classList.toggle("hidden", message === ""); // "hidden" = classe Tailwind
  }
}
