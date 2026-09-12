import Swal from 'sweetalert2';
import '../sweetalert.css'

import {skills} from '../data'

export async function showAddAidDialog(characters) {

    const possibleSkills = skills(characters)

    const inCharacters = Object.entries(characters).map(([id, c]) => ({...c, id}))

  const result = await Swal.fire({
    title: 'Add Aid Relationship',

    html: `
      <div class="pathfinder-form">

        <div style="display: grid; grid-template-columns: auto auto; gap: 24px;">
            <div class="pathfinder-form-section">
            <label class="pathfinder-swal-label" for="aid-target">
                Target
            </label>

            <select
                id="aid-target"
                class="pathfinder-swal-select"
            >
                ${inCharacters
                .map(
                    (character) =>
                    `<option value="${character.id}">
                        ${character.name}
                    </option>`
                )
                .join('')}
            </select>
            </div>

            <div class="pathfinder-form-section">
            <label class="pathfinder-swal-label" for="aid-helper">
                Helper
            </label>

            <select
                id="aid-helper"
                class="pathfinder-swal-select"
            >
                ${inCharacters
                .map(
                    (character) =>
                    `<option value="${character.id}">
                        ${character.name}
                    </option>`
                )
                .join('')}
            </select>
            </div>
        </div>

        <div class="pathfinder-form-section" style="margin-top: 16px;">
            <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 24px;">
              <div class="pathfinder-form-field">
                <label
                  class="pathfinder-swal-label"
                  for="aid-skill"
                >
                  Skill
                </label>

                <div class="pathfinder-skill-select-wrapper">
                  <select
                    id="aid-skill"
                    class="pathfinder-swal-select"
                  >
                    ${possibleSkills
                      .map(
                        (skill) =>
                          `<option value="${skill}">
                            ${skill}
                          </option>`
                      )
                      .join('')}
                  </select>

                  <p
                    id="aid-skill-note-info"
                    class="pathfinder-skill-note-info"
                    style="display: none;"
                  >
                    ⓘ
                  </p>
                </div>

              </div>
              <div class="pathfinder-form-field pathfinder-form-field-small">
                  <label
                      class="pathfinder-swal-label"
                      for="aid-dc"
                      style="margin: 8px"
                  >
                      DC
                  </label>

                  <input
                      id="aid-dc"
                      type="number"
                      class="pathfinder-swal-input pathfinder-swal-number"
                      value="20"
                      min="1"
                  />
              </div>
          </div>

          <div></div>
          <div class="pathfinder-form-section" style="margin-top: 16px;">
            <label class="pathfinder-swal-label">
              Bonuses:
            </label>
            <div></div>
            <div style="display: grid; grid-template-columns: auto auto auto auto; gap: 12px; width: 100%;">
                <div class="pathfinder-form-field pathfinder-form-field-small">
                    <label
                        class="pathfinder-swal-label"
                        for="crit-fail-aid-bonus"
                    >
                        Crit Fail
                    </label>

                    <input
                        id="crit-fail-aid-bonus"
                        type="number"
                        class="pathfinder-swal-input pathfinder-swal-number"
                        value="-1"
                    />
                </div>

                <div class="pathfinder-form-field pathfinder-form-field-small">
                    <label
                        class="pathfinder-swal-label"
                        for="fail-aid-bonus"
                    >
                        Fail
                    </label>

                    <input
                        id="fail-aid-bonus"
                        type="number"
                        class="pathfinder-swal-input pathfinder-swal-number"
                        value="0"
                    />
                </div>
                
                <div class="pathfinder-form-field pathfinder-form-field-small">
                    <label
                        class="pathfinder-swal-label"
                        for="success-aid-bonus"
                    >
                        Success
                    </label>

                    <input
                        id="success-aid-bonus"
                        type="number"
                        class="pathfinder-swal-input pathfinder-swal-number"
                        value="1"
                    />
                </div>
                
                <div class="pathfinder-form-field pathfinder-form-field-small">
                    <label
                        class="pathfinder-swal-label"
                        for="crit-success-aid-bonus"
                    >
                        Crit Success
                    </label>

                    <input
                        id="crit-success-aid-bonus"
                        type="number"
                        class="pathfinder-swal-input pathfinder-swal-number"
                        value="2"
                    />
                </div>
            </div>
        </div>
      </div>
    `,

    showCancelButton: true,

    confirmButtonText: 'Add Aid',
    cancelButtonText: 'Cancel',

    customClass: {
      popup: 'pathfinder-swal-popup',
      title: 'pathfinder-swal-title',
      htmlContainer: 'pathfinder-swal-html',
      confirmButton: 'pathfinder-swal-confirm',
      cancelButton: 'pathfinder-swal-cancel',
    },

    focusConfirm: false,

    didOpen: () => {
      const helperSelect = document.getElementById('aid-helper');
      const skillSelect = document.getElementById('aid-skill');
      const infoIcon = document.getElementById('aid-skill-note-info');

      const updateSkillInfo = () => {
        const helperId = helperSelect.value;
        const skill = skillSelect.value;

        const helper = characters[helperId];

        const hasNote = helper?.notes?.some((note) => {
          const boosts = note.boost
            .split(',')
            .map((boost) => boost.trim());

          return boosts.includes('all') || boosts.includes(skill);
        });

        infoIcon.style.display = hasNote ? 'inline-flex' : 'none';
        infoIcon.title = `Helper has ${(helper.notes ?? []).filter(it => it.boost.includes(skill) || it.boost === "all").length} notes regarding ${skill}`
      };

      helperSelect.addEventListener('change', updateSkillInfo);
      skillSelect.addEventListener('change', updateSkillInfo);

      updateSkillInfo();
    },

    preConfirm: () => {
      const target = document.getElementById('aid-target').value;
      const helper = document.getElementById('aid-helper').value;
      const skill = document.getElementById('aid-skill').value;
      const dc = Number(document.getElementById('aid-dc').value);
      const critFailBonus = Number(document.getElementById('crit-fail-aid-bonus').value),
        failBonus = Number(document.getElementById('fail-aid-bonus').value),
        successBonus = Number(document.getElementById('success-aid-bonus').value),
        critSuccessBonus = Number(document.getElementById('crit-success-aid-bonus').value);

      if (target === helper) {
        Swal.showValidationMessage(
          'Target and helper must be different characters.'
        );
        return false;
      }

      if (!dc || dc < 1) {
        Swal.showValidationMessage(
          'Aid check DC must be at least 1.'
        );
        return false;
      }

      if (!Number.isInteger(critFailBonus) || !Number.isInteger(failBonus) || !Number.isInteger(successBonus) || !Number.isInteger(critSuccessBonus)) {
        Swal.showValidationMessage(
          'Bonus must be a whole number.'
        );
        return false;
      }

      return {
        targetId: target,
        aiderId: helper,
        skill,
        dc,
        bonuses: {
          critFail: critFailBonus,
          fail: failBonus,
          success: successBonus,
          critSuccess: critSuccessBonus
        },
      };
    },
  });

  return result.isConfirmed ? result.value : null;
}