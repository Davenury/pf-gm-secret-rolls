import Swal from 'sweetalert2';

export async function showCreateCharacterDialog(
  campaigns,
  basicSkills,
  currentChar
) {

  const isCharDefined = !!currentChar

  const result = await Swal.fire({
    title: `${isCharDefined ? 'Edit Character' : 'Create Character'}`,
    width: 850,

    html: `
      <div class="pathfinder-character-form">

        <!-- LEFT COLUMN -->
        <div class="pathfinder-character-column">

          <!-- Campaign -->
          <div class="pathfinder-form-section">
            <label
              class="pathfinder-swal-label"
              for="character-campaign"
            >
              Campaign
            </label>

            <select
              id="character-campaign"
              class="pathfinder-swal-select"
            >
              ${
                isCharDefined ? `<option value=${currentChar?.campaign}>${currentChar?.campaign}</option>` :
                  campaigns.map((campaign) => `
                    <option value="" disabled selected>
                      Select a campaign
                    </option>
                    <option value="${campaign}">
                      ${campaign}
                    </option>
                  `).join('')
              }
            </select>
          </div>

          <!-- Name + Type -->
          <div class="pathfinder-form-row" style="margin-top: 16px;">

            <div class="pathfinder-form-field">
              <label
                class="pathfinder-swal-label"
                for="character-name"
              >
                Name
              </label>

              ${
                isCharDefined ? `<input id="character-name"
                  class="pathfinder-swal-input" value="${currentChar?.char?.name}" />` :
                `<input
                  id="character-name"
                  class="pathfinder-swal-input"
                  placeholder="e.g. Kara"
                />`
              }
              
            </div>

            <div class="pathfinder-form-field">
              <label
                class="pathfinder-swal-label"
                for="character-type"
                style="margin: 0"
              >
                Type
              </label>

              <select
                id="character-type"
                class="pathfinder-swal-select"
                style="margin: 0"
              >
              ${
                isCharDefined ? `<option value="${currentChar?.char?.type}">${currentChar?.char?.type}</option>` :
                `<option value="player">Player</option>
                <option value="minion">Minion</option>`
              }
              </select>
            </div>

          </div>

          <!-- Avatar -->
          <div class="pathfinder-form-section">

            <label class="pathfinder-swal-label">
              Avatar
            </label>

            <div class="pathfinder-avatar-upload">

              <div
                id="character-avatar-preview"
                class="pathfinder-avatar-preview"
              >
                ${isCharDefined ? `<img
                    src="${currentChar?.char?.avatar}"
                    alt="Character avatar"
                  />` : `<span>?</span>`}
              </div>

              <div class="pathfinder-avatar-upload-content">

                <label
                  for="character-avatar"
                  class="pathfinder-avatar-button"
                >
                  Choose image
                </label>

                <input
                  id="character-avatar"
                  type="file"
                  accept="image/*"
                  hidden
                />

                <div class="pathfinder-form-hint">
                  JPG, PNG or WebP
                </div>

              </div>

            </div>
          </div>

          <!-- Tags -->
          <div class="pathfinder-form-section">

            <label class="pathfinder-swal-label">
              Tags
            </label>

            <div
              id="character-tags"
              class="pathfinder-tags-input"
            >
              <input
                id="character-tag-input"
                class="pathfinder-tag-input"
                placeholder="Type a tag and press Enter"
              />
            </div>

            <div class="pathfinder-form-hint">
              Add any number of tags.
            </div>

          </div>

        </div>

        <!-- VERTICAL DIVIDER -->
        <div class="pathfinder-character-divider"></div>

        <!-- RIGHT COLUMN -->
        <div class="pathfinder-character-column">

          <div class="pathfinder-form-section">

            <div class="pathfinder-form-section-header">
              <div>
                <div class="pathfinder-form-section-title">
                  Skills
                </div>

                <div class="pathfinder-form-hint">
                  Basic and custom skill modifiers.
                </div>
              </div>

              <button
                type="button"
                id="add-custom-skill"
                class="pathfinder-add-skill-button"
              >
                + Custom Skill
              </button>
            </div>

            <div
              id="pathfinder-skills"
              class="pathfinder-skills-list"
            >

              ${
                (isCharDefined ? Object.keys(currentChar?.char?.skills) : basicSkills).map((skill, index) => `
                  <div
                    class="pathfinder-skill-field"
                    data-skill-type="basic"
                  >
                    <label
                      class="pathfinder-skill-label"
                      for="basic-skill-${index}"
                    >
                      ${skill}
                    </label>

                    <input
                      id="basic-skill-${index}"
                      data-skill="${skill}"
                      type="number"
                      value="${isCharDefined ? currentChar?.char.skills[skill] : "0"}"
                      class="pathfinder-swal-input pathfinder-swal-number"
                    />
                  </div>
                `).join('')}

            </div>

          </div>

        </div>

      </div>
    `,

    showCancelButton: true,

    confirmButtonText: isCharDefined ? 'Edit Character' : 'Create Character',
    cancelButtonText: 'Cancel',

    focusConfirm: false,

    customClass: {
      popup: 'pathfinder-swal-popup',
      title: 'pathfinder-swal-title',
      htmlContainer: 'pathfinder-swal-html',
      confirmButton: 'pathfinder-swal-confirm',
      cancelButton: 'pathfinder-swal-cancel',
    },

    didOpen: () => {
      const popup = Swal.getPopup();

      let avatarBase64 = null;
      const tags = isCharDefined ? currentChar?.char?.tags : [];
      const customSkills = [];

      /*
       * Avatar
       */
      const avatarInput =
        document.getElementById('character-avatar');

      const avatarPreview =
        document.getElementById(
          'character-avatar-preview',
        );

      avatarInput.addEventListener('change', (event) => {
        const file = event.target.files?.[0];

        if (!file) {
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          avatarBase64 = reader.result;

          avatarPreview.innerHTML = `
            <img
              src="${avatarBase64}"
              alt="Character avatar"
            />
          `;
        };

        reader.readAsDataURL(file);
      });

      /*
       * Tags
       */
      const tagsContainer =
        document.getElementById('character-tags');

      const tagInput =
        document.getElementById('character-tag-input');

      const renderTags = () => {
        tagsContainer.innerHTML = '';

        tags.forEach((tag, index) => {
          const element =
            document.createElement('span');

          element.className = 'pathfinder-tag';

          element.innerHTML = `
            <span>${tag}</span>
            <button
              type="button"
              class="pathfinder-tag-remove"
            >
              ×
            </button>
          `;

          element
            .querySelector('.pathfinder-tag-remove')
            .addEventListener('click', () => {
              tags.splice(index, 1);
              renderTags();
            });

          tagsContainer.appendChild(element);
        });

        tagsContainer.appendChild(tagInput);
      };

      tagInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') {
          return;
        }

        event.preventDefault();

        const value = tagInput.value.trim();

        if (!value) {
          return;
        }

        if (!tags.includes(value)) {
          tags.push(value);
        }

        tagInput.value = '';

        renderTags();
      });

      if (isCharDefined) {
        renderTags()
      }

      /*
       * Custom skills
       */
      const skillsContainer =
        document.getElementById(
          'pathfinder-skills',
        );

      const addCustomSkillButton =
        document.getElementById(
          'add-custom-skill',
        );

      const renderCustomSkills = () => {
        skillsContainer
          .querySelectorAll(
            '[data-skill-type="custom"]',
          )
          .forEach((element) => element.remove());

        customSkills.forEach((skill, index) => {
          const element =
            document.createElement('div');

          element.className =
            'pathfinder-skill-field custom-skill';

          element.dataset.skillType = 'custom';

          element.innerHTML = `
            <div class="pathfinder-custom-skill-name">
              <input
                type="text"
                value="${skill.name}"
                placeholder="Custom Lore"
                class="pathfinder-swal-input"
              />

              <button
                type="button"
                class="pathfinder-custom-skill-remove"
              >
                ×
              </button>
            </div>

            <input
              type="number"
              value="${skill.modifier}"
              class="pathfinder-swal-input pathfinder-swal-number"
              placeholder="0"
            />
          `;

          const nameInput =
            element.querySelector(
              '.pathfinder-custom-skill-name input',
            );

          const modifierInput =
            element.querySelector(
              'input[type="number"]',
            );

          const removeButton =
            element.querySelector(
              '.pathfinder-custom-skill-remove',
            );

          nameInput.addEventListener('input', () => {
            skill.name = nameInput.value;
          });

          modifierInput.addEventListener('input', () => {
            skill.modifier =
              Number(modifierInput.value) || 0;
          });

          removeButton.addEventListener(
            'click',
            () => {
              const skillIndex =
                customSkills.indexOf(skill);

              if (skillIndex !== -1) {
                customSkills.splice(
                  skillIndex,
                  1,
                );
              }

              renderCustomSkills();
            },
          );

          skillsContainer.appendChild(element);
        });
      };

      addCustomSkillButton.addEventListener(
        'click',
        () => {
          customSkills.push({
            name: '',
            modifier: 0,
          });

          renderCustomSkills();

          // Focus newly-created name field
          const inputs =
            skillsContainer.querySelectorAll(
              '.custom-skill input[type="text"]',
            );

          inputs[inputs.length - 1]?.focus();
        },
      );

      popup.__characterData = {
        getAvatar: () => avatarBase64,
        getTags: () => [...tags],
        getCustomSkills: () =>
          customSkills.map((skill) => ({
            name: skill.name.trim(),
            modifier: skill.modifier,
          })),
      };
    },

    preConfirm: () => {
      const popup = Swal.getPopup();

      const campaign =
        document.getElementById(
          'character-campaign',
        ).value;

      const name =
        document.getElementById(
          'character-name',
        ).value.trim();

      const type =
        document.getElementById(
          'character-type',
        ).value;

      if (!campaign) {
        Swal.showValidationMessage(
          'Please select a campaign.',
        );
        return false;
      }

      if (!name) {
        Swal.showValidationMessage(
          'Character name is required.',
        );
        return false;
      }

      const skills = {};

      (isCharDefined ? Object.keys(currentChar?.char?.skills) : basicSkills).forEach((skill, index) => {
        const input =
          document.getElementById(
            `basic-skill-${index}`,
          );

        skills[skill] =
          Number(input.value) || 0;
      });

      const customSkills =
        popup.__characterData.getCustomSkills();

      const invalidCustomSkill =
        customSkills.some(
          (skill) => !skill.name,
        );

      if (invalidCustomSkill) {
        Swal.showValidationMessage(
          'Every custom skill must have a name.',
        );
        return false;
      }

      const s = {...skills}

      customSkills.forEach(it => {
        s[it.name] = it.modifier
      })

      return {
        campaign,
        player: {
            name,
            type,

            avatar: popup.__characterData.getAvatar() || isCharDefined ? currentChar?.char?.avatar : "",

            tags:
            popup.__characterData.getTags(),

            skills: s,
            notes: isCharDefined ? currentChar?.char?.notes : []
        }
      };
    },
  });

  return result.isConfirmed
    ? result.value
    : null;
}