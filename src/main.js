// ============================================================================
// main.js — POINT D'ENTRÉE
// ----------------------------------------------------------------------------
// 1) Récupère les créatures depuis l'API.
// 2) Instancie la liste et lui demande de s'afficher dans #monsters-app.
// ============================================================================

import "./style.css"; // importé ici pour que Vite l'intègre au build
import MonstersList from "./components/monsters-list/MonstersList.js";
import DB from "./DB.js";

try {
  const monsters = await DB.getMonsters();
  new MonstersList({ monsters }).render("#monsters-app");
} catch (error) {
  console.error(error);
  document.querySelector("#monsters-app").textContent =
    "Could not reach the archive. Please try again later.";
}
