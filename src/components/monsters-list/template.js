// ============================================================================
// monsters-list/template.js — HTML DE L'APPLICATION
// ----------------------------------------------------------------------------
// Reprend le gabarit fourni :
//   - à gauche  (<aside>)   : le formulaire d'ajout
//   - à droite  (<section>) : le compteur, la recherche et le tableau
// Le <tbody> est VIDE : MonstersList y ajoute une ligne par créature.
// Seuls ajouts au gabarit : des classes pour retrouver les éléments en JS.
// ============================================================================

import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX, MONSTER_TYPES } from "../../config.js";

export default function getTemplate() {
  return `
    <!-- Aside gauche pour le formulaire -->
    <aside class="deco-frame md:w-1/3 p-6 bg-[var(--murk)]/60 self-start">
      <h2 class="display text-2xl mb-5 text-[var(--pearl)]">File a new creature</h2>

      <label class="block mb-4 text-[var(--silver)]">
        Name
        <input type="text" class="new-name field" placeholder="The Crawling Mass" />
      </label>

      <label class="block mb-4 text-[var(--silver)]">
        Type
        <select class="new-type field">
          ${MONSTER_TYPES.map((type) => `<option>${type}</option>`).join("")}
        </select>
      </label>

      <label class="block mb-4 text-[var(--silver)]">
        Danger level (${DANGER_MIN} to ${DANGER_MAX})
        <input type="number" min="${DANGER_MIN}" max="${DANGER_MAX}" class="new-danger field" placeholder="3" />
      </label>

      <label class="block mb-6 text-[var(--silver)]">
        Release year
        <input type="number" min="${YEAR_MIN}" max="${YEAR_MAX}" class="new-year field" placeholder="1957" />
      </label>

      <button class="btn-add btn btn-lipstick w-full py-3 px-4 text-lg">Add to the archive</button>
    </aside>

    <!-- Section droite pour la liste des créatures -->
    <section class="deco-frame md:w-2/3 p-6 bg-[var(--murk)]/40">
      <div class="flex flex-wrap justify-between items-baseline gap-2 mb-5">
        <h2 class="display text-2xl">The archive</h2>
        <p class="text-[var(--silver)]">
          Creatures on file :
          <span class="monsters-count display text-2xl text-[var(--gold)]">0</span>
        </p>
      </div>

      <!-- Bonus : filtre de recherche -->
      <input type="search" class="search-input field mb-5" placeholder="Search by name or type" />

      <div class="overflow-x-auto">
        <table class="monsters-table w-full">
          <thead>
            <tr>
              <!-- Bonus : tri. data-sort = propriété de Monster utilisée pour trier -->
              <th class="text-left p-3"><a href="#" class="sort-link" data-sort="name">Name</a></th>
              <th class="text-left p-3"><a href="#" class="sort-link" data-sort="type">Type</a></th>
              <th class="text-left p-3"><a href="#" class="sort-link" data-sort="dangerLevel">Danger</a></th>
              <th class="text-left p-3"><a href="#" class="sort-link" data-sort="year">Year</a></th>
              <th class="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="monsters-body"></tbody>
        </table>
      </div>
    </section>
  `;
}
