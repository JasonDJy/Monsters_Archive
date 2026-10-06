import { defineConfig } from "vite";

export default defineConfig({
  // Chemins relatifs dans dist/ : la version de production fonctionne
  // quel que soit le dossier ou le serveur qui l'héberge.
  base: "./",
});
