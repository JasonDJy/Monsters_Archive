// ============================================================================
// monsters-list/template.js — HTML DE LA LISTE
// ----------------------------------------------------------------------------
// Reprend le gabarit : formulaire d'ajout (aside) + archive (section :
// compteur, recherche, tableau).
// Le <tbody> est volontairement VIDE : MonstersList y injecte une ligne
// par créature (monster.render()).
// ============================================================================

import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX, MONSTER_TYPES } from "../../config.js";

export default function getTemplate() {
  const typeOptions = MONSTER_TYPES.map((type) => `<option>${type}</option>`).join("");

  return `
    <!-- Formulaire d'ajout -->
    <aside class="deco-frame md:w-1/3 p-6 bg-[var(--murk)]/60 self-start">
      <h2 class="display text-2xl mb-5 text-[var(--pearl)]">File a new creature</h2>

      <!-- novalidate : la validation est faite en JS (Monster.validate) -->
      <form class="add-form" novalidate>
        <label class="block mb-4 text-[var(--silver)]">
          Name
          <input type="text" name="name" class="new-name field" placeholder="The Crawling Mass" />
        </label>

        <label class="block mb-4 text-[var(--silver)]">
          Type
          <select name="type" class="new-type field">${typeOptions}</select>
        </label>

        <label class="block mb-4 text-[var(--silver)]">
          Danger level (${DANGER_MIN} to ${DANGER_MAX})
          <input type="number" name="dangerLevel" min="${DANGER_MIN}" max="${DANGER_MAX}" class="new-danger field" placeholder="3" />
        </label>

        <label class="block mb-6 text-[var(--silver)]">
          Release year
          <input type="number" name="year" min="${YEAR_MIN}" max="${YEAR_MAX}" class="new-year field" placeholder="1957" />
        </label>

        <button type="submit" class="btn btn-lipstick w-full py-3 px-4 text-lg">Add to the archive</button>
      </form>
    </aside>

    <!-- Archive : compteur, recherche, tableau -->
    <section class="deco-frame md:w-2/3 p-6 bg-[var(--murk)]/40">
      <div class="flex flex-wrap justify-between items-baseline gap-2 mb-5">
        <h2 class="display text-2xl">The archive</h2>
        <p class="text-[var(--silver)]">
          Creatures on file :
          <span class="monsters-count display text-2xl text-[var(--gold)]">0</span>
        </p>
      </div>

      <input type="search" class="search-input field mb-5" placeholder="Search by name or type" />

      <div class="overflow-x-auto">
        <table class="monsters-table w-full">
          <thead>
            <tr>
              <!-- data-sort = nom de la propriété de Monster utilisée pour trier -->
              <th class="text-left p-3"><a href="#" data-sort="name">Name <span class="sort-indicator" aria-hidden="true"></span></a></th>
              <th class="text-left p-3"><a href="#" data-sort="type">Type <span class="sort-indicator" aria-hidden="true"></span></a></th>
              <th class="text-left p-3"><a href="#" data-sort="dangerLevel">Danger <span class="sort-indicator" aria-hidden="true"></span></a></th>
              <th class="text-left p-3"><a href="#" data-sort="year">Year <span class="sort-indicator" aria-hidden="true"></span></a></th>
              <th class="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="monsters-body"></tbody>
        </table>
      </div>

      <!-- Message d'état (liste vide / aucun résultat), masqué sinon -->
      <p class="status hidden text-center text-[var(--silver)] italic mt-5" role="status"></p>
    </section>
  `;
}
