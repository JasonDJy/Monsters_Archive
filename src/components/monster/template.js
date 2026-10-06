// ============================================================================
// monster/template.js — HTML D'UNE CRÉATURE
// ----------------------------------------------------------------------------
// Une ligne <tr> reprenant la structure du gabarit. Chaque cellule contient :
//   - un <span> visible en mode lecture (classe isEditing-hidden)
//   - un champ  visible en mode édition (classe isEditing-visible)
// Le CSS du gabarit bascule de l'un à l'autre via la classe "isEditing" du <tr>.
// Seul ajout au gabarit : data-id, pour retrouver la créature au clic.
// ============================================================================

import { DANGER_MIN, DANGER_MAX, YEAR_MIN, YEAR_MAX, MONSTER_TYPES } from "../../config.js";

/**
 * Neutralise les caractères HTML d'un texte saisi par l'utilisateur.
 * Indispensable car le template est injecté via innerHTML (risque XSS).
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** @param {import("./Monster.js").default} monster */
export default function getTemplate(monster) {
  // <option> du <select>, avec le type actuel présélectionné
  const typeOptions = MONSTER_TYPES.map(
    (type) => `<option${type === monster.type ? " selected" : ""}>${type}</option>`,
  ).join("");

  return `
    <tr class="monster-row${monster.isEditing ? " isEditing" : ""}" data-id="${escapeHtml(monster.id)}">
      <td class="p-3 font-semibold">
        <span class="isEditing-hidden">${escapeHtml(monster.name)}</span>
        <input type="text" class="input-name isEditing-visible field" value="${escapeHtml(monster.name)}" />
      </td>
      <td class="p-3">
        <span class="isEditing-hidden">${escapeHtml(monster.type)}</span>
        <select class="input-type isEditing-visible field">${typeOptions}</select>
      </td>
      <td class="p-3 whitespace-nowrap">
        <span class="isEditing-hidden" title="Danger level ${monster.dangerLevel}">${monster.dangerSkulls}</span>
        <input type="number" min="${DANGER_MIN}" max="${DANGER_MAX}" class="input-danger isEditing-visible field" value="${monster.dangerLevel}" />
      </td>
      <td class="p-3">
        <span class="isEditing-hidden">${monster.year}</span>
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
