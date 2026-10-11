// ============================================================================
// monster/template.js — HTML D'UNE CRÉATURE
// ----------------------------------------------------------------------------
// Une fonction qui reçoit une créature et retourne le HTML d'une ligne <tr>.
// Chaque cellule contient :
//   - un <span> visible en mode lecture   (classe "isEditing-hidden")
//   - un champ  visible en mode édition   (classe "isEditing-visible")
// Le CSS du gabarit affiche l'un ou l'autre selon la classe "isEditing" du <tr>.
// ============================================================================

import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX, MONSTER_TYPES } from "../../config.js";

export default function getTemplate(monster) {
  return `
    <tr class="monster-row" data-id="${monster.id}">
      <td class="p-3 font-semibold">
        <span class="name-text isEditing-hidden">${monster.name}</span>
        <input type="text" class="input-name isEditing-visible field" value="${monster.name}" />
      </td>
      <td class="p-3">
        <span class="type-text isEditing-hidden">${monster.type}</span>
        <select class="input-type isEditing-visible field">
          <!-- Une <option> par type ; celui de la créature est "selected" -->
          ${MONSTER_TYPES.map((type) => `<option ${type === monster.type ? "selected" : ""}>${type}</option>`).join("")}
        </select>
      </td>
      <td class="p-3 whitespace-nowrap">
        <!-- Bonus : autant de ☠️ que le niveau de danger -->
        <span class="danger-text isEditing-hidden" title="Danger level ${monster.dangerLevel}">${monster.getDangerSkulls()}</span>
        <input type="number" min="${DANGER_MIN}" max="${DANGER_MAX}" class="input-danger isEditing-visible field" value="${monster.dangerLevel}" />
      </td>
      <td class="p-3">
        <span class="year-text isEditing-hidden">${monster.year}</span>
        <input type="number" min="${YEAR_MIN}" max="${YEAR_MAX}" class="input-year isEditing-visible field" value="${monster.year}" />
      </td>
      <td class="p-3">
        <div class="flex justify-end gap-2">
          <button class="btn-check isEditing-visible btn btn-jade py-2 px-3" aria-label="Save">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="btn-edit isEditing-hidden btn btn-gold py-2 px-3" aria-label="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-delete isEditing-hidden btn btn-lipstick py-2 px-3" aria-label="Delete">
            <i class="fa-solid fa-skull"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}
