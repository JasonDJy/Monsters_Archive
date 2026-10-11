// ============================================================================
// DB.js — LA COUCHE DONNÉES
// ----------------------------------------------------------------------------
// Elle sait parler à l'API. Elle ne sait rien afficher, elle ne connaît pas
// le DOM. (C'est le "facteur" : il fait les allers-retours avec le serveur.)
//
// Toutes les méthodes sont "static" : pas besoin de faire "new DB()",
// on les utilise directement : DB.findAll()
//
//   findAll()        -> GET    monsters       (lire toutes les créatures)
//   create()         -> POST   monsters       (ajouter une créature)
//   updateOne()      -> PUT    monsters/:id   (modifier une créature)
//   deleteOneById()  -> DELETE monsters/:id   (supprimer une créature)
// ============================================================================

export default class DB {
  /**
   * Mémorise l'URL de l'API (appelée une seule fois par MonstersList).
   * @param {string} url
   */
  static setApiURL(url) {
    this.apiURL = url;
  }

  /**
   * Récupère toutes les créatures.
   * await : on attend la réponse du serveur avant de continuer.
   * @returns {Promise<Object[]>}
   */
  static async findAll() {
    const response = await fetch(this.apiURL + "monsters");
    return response.json();
  }

  /**
   * Ajoute une créature. Le serveur renvoie la créature créée AVEC son id.
   * @param {Object} data { name, type, dangerLevel, year }
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const response = await fetch(this.apiURL + "monsters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // JSON.stringify : objet JavaScript -> texte JSON (format attendu par l'API)
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Modifie une créature existante.
   * @param {Monster} monster La créature (avec ses nouvelles valeurs)
   * @returns {Promise<Object>}
   */
  static async updateOne(monster) {
    const response = await fetch(this.apiURL + "monsters/" + monster.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: monster.name,
        type: monster.type,
        dangerLevel: monster.dangerLevel,
        year: monster.year,
      }),
    });
    return response.json();
  }

  /**
   * Supprime une créature.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async deleteOneById(id) {
    const response = await fetch(this.apiURL + "monsters/" + id, {
      method: "DELETE",
    });
    return response.json();
  }
}
