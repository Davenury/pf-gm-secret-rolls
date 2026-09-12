import Swal from 'sweetalert2';
import '../sweetalert.css';
import { Stack, Card, CardContent, Typography, Link, Chip, Box, IconButton } from '@mui/material'
import { OpenInNew, DeleteForever } from '@mui/icons-material'

import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showCharacterNotes(character, deleteNote, skill) {

  const notes = character.notes ?? []

  if (!notes?.length) {
    return Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'info',
      title: 'No notes',
      text: 'This character has no notes yet.',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: {
        popup: 'pathfinder-swal-toast',
      },
    });
  }

  return MySwal.fire({
    title: 'Character Notes',
    html: <CharacterNotes notes={notes} deleteNote={deleteNote} skill={skill} />,
    width: 700,
    confirmButtonText: 'Close',

    customClass: {
      popup: 'pathfinder-swal-popup',
      title: 'pathfinder-swal-title',
      confirmButton: 'pathfinder-swal-confirm',
    },
  });
}

function CharacterNotes({ notes, deleteNote, skill }) {

  let shownNotes = notes
  if (skill) {
    shownNotes = notes.filter(it => it.boost.includes(skill) || it.boost === "all")
  }

  return (
    <Stack
      spacing={1}
      sx={{
        textAlign: 'left',
        maxHeight: '60vh',
        overflowY: 'auto',
        pr: 0.5,
      }}
    >
      {shownNotes.map((note, index) => (
        <Card
          key={index}
          sx={{
            background: '#151a22',
            border: '1px solid #3f4958',
            borderRadius: '8px',
            boxShadow: 'none',
            color: '#e8ecf1',

            '&:hover': {
              borderColor: '#566174',
            },
          }}
        >
          <CardContent
            sx={{
              p: 1.5,
              '&:last-child': {
                pb: 1.5,
              },
            }}
          >
            <Stack spacing={0.75}>
              {/* Header */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.75}
                  minWidth={0}
                >
                  <Typography
                    sx={{
                      color: '#a98cff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}
                  >
                    ✦ {note.boost}
                  </Typography>
                </Stack>
                <Stack direction="column">
                    <Box
                    sx={{
                        flexShrink: 0,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: '5px',
                        background: '#343c4a',
                        color: '#dce2ea',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                    }}
                    >
                    {note.modifier >= 0 ? '+' : ''}
                    {note.modifier}
                    </Box>
                    {
                      deleteNote != null && (<IconButton onClick={() => deleteNote(note.noteId)} color="error">
                                                <DeleteForever />
                                            </IconButton>)
                    }
                </Stack>
              </Stack>

              {/* Condition */}
              {note.condition && (
                <Typography
                  sx={{
                    color: '#c3cad5',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                  }}
                >
                  Condition: {note.condition}
                </Typography>
              )}

              {/* Description */}
              {note.short_text && (
                <Typography
                  sx={{
                    mt: 0.25,
                    color: '#8e99a8',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {note.short_text}
                </Typography>
              )}

              {/* Feat */}
              {note.feat && (
                <Link
                  href={note.feat}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    alignSelf: 'flex-start',
                    mt: 0.25,
                    color: '#9b83ff',
                    fontSize: '0.75rem',
                    fontWeight: 600,

                    '&:hover': {
                      color: '#b5a3ff',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  View feat
                  <OpenInNew
                    sx={{
                      fontSize: '0.8rem',
                    }}
                  />
                </Link>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}