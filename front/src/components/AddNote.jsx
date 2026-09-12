import Swal from 'sweetalert2';
import '../sweetalert.css';
import { FormControl, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import React from 'react';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export async function showAddNoteDialog(basicSkills) {
  let formValue = null;

  const result = await MySwal.fire({
    title: 'Add Character Note',

    html: (
      <AddNoteForm
        skills={basicSkills}
        onChange={(value) => {
          formValue = value;
        }}
      />
    ),

    width: 620,

    showCancelButton: true,
    confirmButtonText: 'Add Note',
    cancelButtonText: 'Cancel',

    customClass: {
      popup: 'pathfinder-swal-popup',
      title: 'pathfinder-swal-title',
      htmlContainer: 'pathfinder-swal-html',
      confirmButton: 'pathfinder-swal-confirm',
      cancelButton: 'pathfinder-swal-cancel',
    },

    preConfirm: () => {
      if (!formValue?.boost?.length) {
        Swal.showValidationMessage(
          'Select at least one skill to boost.',
        );
        return false;
      }

      if (!formValue.condition.trim()) {
        Swal.showValidationMessage(
          'Condition is required.',
        );
        return false;
      }

      return {
        ...formValue,

        // ["perception", "athletics"] -> "perception,athletics"
        // ["all"] -> "all"
        boost: formValue.boost.join(','),

        condition: formValue.condition.trim(),
        short_text: formValue.short_text.trim(),
        feat: formValue.feat.trim(),
      };
    },
  });

  return result.isConfirmed ? result.value : null;
}

function AddNoteForm({ skills, onChange }) {
  const [form, setForm] = React.useState({
    boost: [],
    condition: '',
    modifier: 1,
    short_text: '',
    feat: '',
  });

  const update = (field, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      // Keep the value used by SweetAlert2 in sync
      onChange(next);

      return next;
    });
  };

  const handleBoostChange = (event) => {
    const selected = event.target.value;

    update(
      'boost',
      selected.includes('all')
        ? ['all']
        : selected,
    );
  };

  return (
    <div className="pathfinder-note-form">
      {/* Boost */}
      <div className="pathfinder-form-section">
        <label className="pathfinder-swal-label">
          Boost
        </label>

        <FormControl fullWidth>
          <Select
            multiple
            value={form.boost}
            onChange={handleBoostChange}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return (
                  <span className="pathfinder-select-placeholder">
                    Select skills...
                  </span>
                );
              }

              if (selected.includes('all')) {
                return 'All skills';
              }

              return selected.join(', ');
            }}
            sx={{
              height: 42,
              background: '#151a22',
              borderRadius: '8px',
              color: '#e8ecf1',
              fontFamily: 'inherit',
              fontSize: '0.82rem',

              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                boxSizing: 'border-box',
                padding: '0 11px',
              },

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f4958',
              },

              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#566174',
              },

              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7c5cff',
                borderWidth: '1px',
                boxShadow: '0 0 0 3px rgba(124, 92, 255, 0.18)',
              },

              '& .MuiSelect-icon': {
                color: '#687384',
              },
            }}

            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 0.5,
                  background: '#202631',
                  border: '1px solid #3f4958',
                  borderRadius: '8px',
                  color: '#e8ecf1',

                  '& .MuiMenuItem-root': {
                    fontSize: '0.82rem',
                    minHeight: 38,

                    '&:hover': {
                      background: '#2a313e',
                    },

                    '&.Mui-selected': {
                      background: 'rgba(124, 92, 255, 0.14)',
                    },

                    '&.Mui-selected:hover': {
                      background: 'rgba(124, 92, 255, 0.2)',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="all">
              <Checkbox
                checked={form.boost.includes('all')}
                sx={{
                  color: '#687384',
                  p: 0.75,

                  '&.Mui-checked': {
                    color: '#7c5cff',
                  },
                }}
              />

              <ListItemText primary="All skills" />
            </MenuItem>

            {skills.map((skill) => (
              <MenuItem
                key={skill}
                value={skill}
                disabled={form.boost.includes('all')}
              >
                <Checkbox
                  checked={form.boost.includes(skill)}
                  sx={{
                    color: '#687384',
                    p: 0.75,

                    '&.Mui-checked': {
                      color: '#7c5cff',
                    },
                  }}
                />

                <ListItemText primary={skill} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Condition + Modifier */}
      <div className="pathfinder-form-section">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
          }}
        >
          <div style={{ flexGrow: 10 }}>
            <label
              className="pathfinder-swal-label"
              htmlFor="note-condition"
            >
              Condition
            </label>

            <input
              id="note-condition"
              className="pathfinder-swal-input"
              placeholder="e.g. air elementals"
              value={form.condition}
              onChange={(e) =>
                update('condition', e.target.value)
              }
            />
          </div>

          <div
            className="pathfinder-form-section"
            style={{ flexGrow: 1 }}
          >
            <label
              className="pathfinder-swal-label"
              htmlFor="note-modifier"
            >
              Modifier
            </label>

            <input
              id="note-modifier"
              type="number"
              className="pathfinder-swal-number"
              value={form.modifier}
              onChange={(e) =>
                update('modifier', Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="pathfinder-form-section">
        <label
          className="pathfinder-swal-label"
          htmlFor="note-short-text"
        >
          Description
          <span className="pathfinder-swal-label-optional">
            optional
          </span>
        </label>

        <textarea
          id="note-short-text"
          className="pathfinder-swal-textarea"
          placeholder="Describe what this note does..."
          rows={3}
          value={form.short_text}
          onChange={(e) =>
            update('short_text', e.target.value)
          }
        />
      </div>

      {/* Feat */}
      <div className="pathfinder-form-section">
        <label
          className="pathfinder-swal-label"
          htmlFor="note-feat"
        >
          Feat
          <span className="pathfinder-swal-label-optional">
            optional
          </span>
        </label>

        <input
          id="note-feat"
          type="url"
          className="pathfinder-swal-input"
          placeholder="https://2e.aonprd.com/Feats.aspx?ID=..."
          value={form.feat}
          onChange={(e) =>
            update('feat', e.target.value)
          }
        />
      </div>
    </div>
  );
}
