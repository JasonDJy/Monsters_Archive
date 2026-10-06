// ============================================================================
// MonstersList.js — COMPOSANT "LA LISTE DES CRÉATURES"
// ----------------------------------------------------------------------------
// Gère le formulaire d'ajout, le compteur, la recherche, le tri et les actions
// des lignes (modifier / enregistrer / supprimer).
//
// Réactivité : les DONNÉES (monsters, searchTerm, sortKey, sortDirection) sont
// la source de vérité. Dès qu'une donnée change, #refresh() redessine le
// tableau, le compteur, les flèches de tri et le message d'état.
// ============================================================================

import Monster from "../monster/Monster.js";
import DB from "../../DB.js";
import getTemplate from "./template.js";

export default class MonstersList {
  // --------------------------------------------------------------------------
  // PROPRIÉTÉS DE BASE
  // --------------------------------------------------------------------------
  monsters = []; // instances de Monster
  searchTerm = "";
  sortKey = null; // "name" | "type" | "dangerLevel" | "year" | null
  sortDirection = "asc"; // "asc" | "desc"

  #refs; // raccourcis vers les éléments du template

  /** @param {{monsters?: Object[]}} data Données brutes venant de l'API. */
  constructor({ monsters = [] } = {}) {
    this.monsters = monsters.map((row) => new Monster(row));
  }

  // --------------------------------------------------------------------------
  // PROPRIÉTÉS CALCULÉES (computed : dérivées des propriétés de base)
  // --------------------------------------------------------------------------

  /** Nombre TOTAL de créatures (indépendant de la recherche). */
  get count() {
    return this.monsters.length;
  }

  /** Créatures à afficher : filtrées par la recherche, puis triées. */
  get visibleMonsters() {
    const term = this.searchTerm.trim().toLowerCase();

    // filter() renvoie un NOUVEAU tableau : this.monsters n'est pas modifié
    const filtered = this.monsters.filter(
      (monster) =>
        monster.name.toLowerCase().includes(term) || monster.type.toLowerCase().includes(term),
    );

    if (this.sortKey) {
      const direction = this.sortDirection === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        const valueA = a[this.sortKey];
        const valueB = b[this.sortKey];
        // Nombres : soustraction. Textes : comparaison alphabétique.
        const result =
          typeof valueA === "number" ? valueA - valueB : String(valueA).localeCompare(valueB);
        return result * direction;
      });
    }
    return filtered;
  }

  // --------------------------------------------------------------------------
  // AFFICHAGE
  // --------------------------------------------------------------------------

  /**
   * Injecte le template, mémorise les éléments utiles, branche les événements
   * puis affiche les lignes.
   * @param {string} selector Sélecteur CSS de l'élément de montage.
   */
  render(selector) {
    const root = document.querySelector(selector);
    root.innerHTML = getTemplate();

    const q = (sel) => root.querySelector(sel);
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

    this.#bindEvents();
    this.#refresh();
    return this;
  }

  /** Redessine tout ce qui dépend des données. */
  #refresh() {
    const r = this.#refs;
    const visible = this.visibleMonsters;

    r.body.innerHTML = visible.map((monster) => monster.render()).join("");
    r.count.textContent = this.count;

    // Flèche ▲ / ▼ uniquement sur la colonne triée
    const arrow = this.sortDirection === "asc" ? "▲" : "▼";
    r.thead.querySelectorAll("a[data-sort]").forEach((link) => {
      link.querySelector(".sort-indicator").textContent =
        link.dataset.sort === this.sortKey ? arrow : "";
    });

    // Message d'état : uniquement si aucune ligne n'est affichée
    if (visible.length > 0) this.#showStatus("");
    else if (this.count === 0) this.#showStatus("The archive is empty. File your first creature!");
    else this.#showStatus("No creature matches your search.");
  }

  /** Affiche le message, ou masque la zone si le message est vide. */
  #showStatus(message) {
    this.#refs.status.textContent = message;
    this.#refs.status.classList.toggle("hidden", message === "");
  }

  // --------------------------------------------------------------------------
  // ÉVÉNEMENTS (délégation : un écouteur par zone, pas un par bouton,
  // car les lignes sont recréées à chaque #refresh())
  // --------------------------------------------------------------------------

  #bindEvents() {
    const r = this.#refs;

    r.form.addEventListener("submit", (event) => this.#handleAdd(event));

    r.search.addEventListener("input", (event) => {
      this.searchTerm = event.target.value;
      this.#refresh();
    });

    r.thead.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-sort]");
      if (!link) return;
      event.preventDefault(); // empêche href="#" de remonter en haut de page
      this.#sortBy(link.dataset.sort);
    });

    r.body.addEventListener("click", (event) => this.#handleRowClick(event));
  }

  /** Retrouve l'objet Monster correspondant à la ligne <tr> qui contient `target`. */
  #getMonsterFrom(target) {
    const row = target.closest("tr[data-id]");
    if (!row) return null;
    return this.monsters.find((monster) => String(monster.id) === row.dataset.id) ?? null;
  }

  /** Clic dans le tableau : la classe du bouton (gabarit) indique l'action. */
  #handleRowClick(event) {
    const button = event.target.closest("button");
    const monster = button && this.#getMonsterFrom(button);
    if (!monster) return;

    if (button.classList.contains("btn-edit")) this.#startEditing(monster);
    if (button.classList.contains("btn-check")) this.#save(monster, button.closest("tr"));
    if (button.classList.contains("btn-delete")) this.#remove(monster);
  }

  // --------------------------------------------------------------------------
  // ACTIONS (modifient l'API PUIS les données locales)
  // --------------------------------------------------------------------------

  /** Ajout d'une créature depuis le formulaire. */
  async #handleAdd(event) {
    event.preventDefault(); // empêche le rechargement de la page

    const r = this.#refs;
    const data = {
      name: r.newName.value.trim(),
      type: r.newType.value,
      dangerLevel: Number(r.newDanger.value), // les <input> renvoient du texte
      year: Number(r.newYear.value),
    };

    const validationError = Monster.validate(data);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const created = await DB.create(data); // l'API renvoie la créature AVEC son id
      this.monsters.push(new Monster(created));
      r.form.reset();
      this.#refresh();
    } catch (error) {
      console.error(error);
      alert("Could not add the creature. Please try again.");
    }
  }

  /** Passe la ligne en mode édition et place le curseur dans le nom. */
  #startEditing(monster) {
    monster.isEditing = true;
    this.#refresh();
    this.#refs.body.querySelector(`tr[data-id="${monster.id}"] .input-name`)?.focus();
  }

  /** Lit les champs d'une ligne en mode édition et renvoie des données typées. */
  #readRow(row) {
    const q = (sel) => row.querySelector(sel);
    return {
      name: q(".input-name").value.trim(),
      type: q(".input-type").value,
      dangerLevel: Number(q(".input-danger").value),
      year: Number(q(".input-year").value),
    };
  }

  /** Enregistre les modifications d'une ligne. */
  async #save(monster, row) {
    const newData = this.#readRow(row);

    const validationError = Monster.validate(newData);
    if (validationError) {
      alert(validationError);
      return; // on reste en mode édition pour laisser corriger
    }

    try {
      // On attend la confirmation de l'API, PUIS on met à jour l'objet et l'affichage
      const saved = await DB.update(monster.id, newData);
      monster.update(saved);
      monster.isEditing = false;
      this.#refresh();
    } catch (error) {
      console.error(error);
      alert("Could not save the creature. Please try again.");
    }
  }

  /** Supprime une créature après confirmation. */
  async #remove(monster) {
    if (!confirm(`Delete "${monster.name}" from the archive?`)) return;

    try {
      await DB.remove(monster.id);
      this.monsters = this.monsters.filter((m) => m !== monster);
      this.#refresh();
    } catch (error) {
      console.error(error);
      alert("Could not delete the creature. Please try again.");
    }
  }

  /** Trie par la colonne cliquée ; un 2e clic sur la même colonne inverse l'ordre. */
  #sortBy(key) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = key;
      this.sortDirection = "asc";
    }
    this.#refresh();
  }
}
