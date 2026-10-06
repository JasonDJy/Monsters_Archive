// ============================================================================
// DB.js — ACCÈS AUX DONNÉES (API REST MockAPI)
// ----------------------------------------------------------------------------
// Classe statique : on appelle directement DB.create(...), sans "new".
// Ne connaît pas le DOM : reçoit et renvoie des objets JS simples.
//
//   getMonsters() -> GET    /monsters
//   create()      -> POST   /monsters
//   update()      -> PUT    /monsters/:id
//   remove()      -> DELETE /monsters/:id
// ============================================================================

import { API_URL } from "./config.js";

export default class DB {
  static #endpoint = `${API_URL}/monsters`;

  /**
   * Méthode privée commune aux 4 requêtes : appel fetch + gestion d'erreur.
   * fetch ne rejette qu'en cas d'erreur RÉSEAU : un 404/500 se teste via response.ok.
   * @param {string} path Fin de l'URL (ex. "/12"), vide pour toute la collection.
   * @param {RequestInit} options method, headers, body.
   * @returns {Promise<any>} Le JSON renvoyé par l'API.
   */
  static async #request(path = "", options = {}) {
    const response = await fetch(`${DB.#endpoint}${path}`, options);
    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /** @returns {Promise<Object[]>} Toutes les créatures. */
  static getMonsters() {
    return DB.#request();
  }

  /** @returns {Promise<Object>} La créature créée, AVEC l'id généré par MockAPI. */
  static create(data) {
    return DB.#request("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  /** @returns {Promise<Object>} La créature modifiée. */
  static update(id, data) {
    return DB.#request(`/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  /** @returns {Promise<Object>} La créature supprimée. */
  static remove(id) {
    return DB.#request(`/${id}`, { method: "DELETE" });
  }
}
