// ============================================================================
// main.js — POINT D'ENTRÉE de l'application (référencé par index.html)
// ----------------------------------------------------------------------------
// Rôle : assembler les briques. Aucune logique métier ici.
//   API (données)  ->  injectée dans  ->  MonstersList (liste)  ->  crée des Monster
// ============================================================================

import "./style.css"; // Vite intègre le CSS au bundle (dev et production)
import { API_URL } from "./config.js";
import MonstersApi from "./api/MonstersApi.js";
import MonstersList from "./components/MonstersList.js";

// 1) La couche d'accès aux données
const api = new MonstersApi(API_URL);

// 2) Le composant liste, monté dans <main id="monsters-app"> de index.html
const list = new MonstersList(document.querySelector("#monsters-app"), api);

// 3) Démarrage : charge les créatures depuis l'API et affiche l'interface
list.init();
