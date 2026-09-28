// ============================================================================
// MonstersApi.js — COUCHE D'ACCÈS AUX DONNÉES
// ----------------------------------------------------------------------------
// Unique responsabilité : parler à l'API REST MockAPI.
// Cette classe ne connaît NI le DOM NI les composants : elle reçoit des objets
// JavaScript simples et renvoie des objets JavaScript simples (via des Promises).
//
// Correspondance CRUD  <->  verbes HTTP  :
//   getAll()   -> GET    /monsters
//   create()   -> POST   /monsters
//   update()   -> PUT    /monsters/:id
//   remove()   -> DELETE /monsters/:id
// ============================================================================

export default class MonstersApi {
  /** Adresse complète de la ressource (ex. https://xxx.mockapi.io/api/v1/monsters). */
  #endpoint;

  /**
   * @param {string} baseUrl URL de base de l'API, sans "/monsters".
   */
  constructor(baseUrl) {
    // Le "#" rend la propriété privée : elle n'est accessible que dans la classe.
    this.#endpoint = `${baseUrl}/monsters`;
  }

  /**
   * Méthode utilitaire privée : centralise l'appel fetch et la gestion d'erreur,
   * pour ne pas répéter ce code dans chacune des 4 méthodes publiques.
   *
   * @param {string} path    Fin de l'URL (ex. "/12"), vide pour la collection.
   * @param {RequestInit} options Options de fetch (method, headers, body...).
   * @returns {Promise<any>} Le JSON renvoyé par l'API.
   */
  async #request(path = "", options = {}) {
    const response = await fetch(`${this.#endpoint}${path}`, options);

    // fetch ne rejette la Promise qu'en cas d'erreur RÉSEAU.
    // Un code 404 ou 500 doit être détecté à la main via `response.ok`.
    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Récupère toutes les créatures.
   * @returns {Promise<Object[]>} Tableau d'objets { id, name, type, dangerLevel, year }.
   */
  getAll() {
    return this.#request();
  }

  /**
   * Crée une créature. L'id est généré par MockAPI.
   * @param {{name: string, type: string, dangerLevel: number, year: number}} data
   * @returns {Promise<Object>} La créature créée, avec son id.
   */
  create(data) {
    return this.#request("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour une créature existante.
   * @param {string} id   Identifiant MockAPI de la créature.
   * @param {Object} data Nouvelles valeurs.
   * @returns {Promise<Object>} La créature mise à jour.
   */
  update(id, data) {
    return this.#request(`/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime une créature.
   * @param {string} id Identifiant MockAPI de la créature.
   * @returns {Promise<Object>} La créature supprimée (renvoyée par MockAPI).
   */
  remove(id) {
    return this.#request(`/${id}`, { method: "DELETE" });
  }
}
