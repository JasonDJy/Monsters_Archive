// ============================================================================
// main.js — POINT D'ENTRÉE DE L'APPLICATION
// ----------------------------------------------------------------------------
// On crée la liste en lui donnant :
//   - el     : l'élément du DOM où elle doit s'afficher
//   - apiURL : l'adresse de l'API
// ============================================================================

// Le CSS est importé ici pour que Vite l'intègre dans la version de production
import "./style.css";
import MonstersList from "./components/monsters-list/MonstersList.js";
import { API_URL } from "./config.js";

new MonstersList({
  el: "#monsters-app",
  apiURL: API_URL,
});
