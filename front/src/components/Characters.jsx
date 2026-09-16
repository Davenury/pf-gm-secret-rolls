import Header from './Header'
import { useState, useEffect } from 'react'
import {
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Stack,
  Typography,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Add,
  Delete,
  Note,
  NoteAdd,
  ExpandMore,
  EditOutlined
} from '@mui/icons-material'
import { P } from '../theme'
import { showCreateCharacterDialog } from './AddCharacter'
import Swal from 'sweetalert2'
import { showCharacterNotes } from './CharacterNotes'
import { showAddNoteDialog } from './AddNote'
import { skills } from '../data'

export default function Characters() {
  const [characters, setCharacters] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [basicSkills, setBasicSkills] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch("/api/v1/campaigns")
      .then(res => res.json())
      .then(json => {
        setCampaigns(json)
      })
  }, [])

  useEffect(() => {
    fetch("/api/v1/players")
      .then(res => res.json())
      .then(json => {
        setCharacters(json)
      })
      .catch(err => console.log(err))
  }, [refresh])

  useEffect(() => {
    fetch("/api/v1/skills/basic")
      .then(res => res.json())
      .then(json => setBasicSkills(json))
  }, [])

  const addCharacter = async () => {
    const result = await showCreateCharacterDialog(
      campaigns,
      basicSkills,
    )

    if (result) {
      let campaignCreated = false

      await fetch("/api/v1/campaigns", {
        method: "POST",
        body: JSON.stringify({
          campaign: result.campaign,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          campaignCreated = true

          Swal.fire({
            title: "Campaign created",
            toast: true,
            showConfirmButton: false,
            icon: "success",
            timer: 1500,
            position: "bottom-end",
          })
        })
        .catch(res => {
          Swal.fire({
            title: "Campaign not created",
            toast: true,
            showConfirmButton: false,
            icon: "error",
            timer: 1500,
            position: "bottom-end",
          })
        })

      if (campaignCreated) {
        await fetch(
          `/api/v1/players/${encodeURI(result.campaign)}`,
          {
            method: "POST",
            body: JSON.stringify(result.player),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(res => {
            Swal.fire({
              title: "Player created",
              toast: true,
              showConfirmButton: false,
              icon: "success",
              timer: 2200,
              position: "bottom-end",
            })
          })
          .catch(res => {
            Swal.fire({
              title: "Player not created",
              toast: true,
              showConfirmButton: false,
              icon: "error",
              timer: 2200,
              position: "bottom-end",
            })
          })

        setRefresh(!refresh)
      }
    }
  }

  const editCharacter = async (charId, char, campaign) => {
    const result = await showCreateCharacterDialog(
      campaigns,
      basicSkills,
      {
        char,
        charId,
        campaign
      }
    )

    if (result) {
      await fetch(
        `/api/v1/players/${encodeURIComponent(campaign)}/${charId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...char,
            ...result.player
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then(res => {
          Swal.fire({
            title: "Player patched",
            toast: true,
            showConfirmButton: false,
            icon: "success",
            timer: 2200,
            position: "bottom-end",
          })
        })
        .catch(res => {
          Swal.fire({
            title: "Player not patched",
            toast: true,
            showConfirmButton: false,
            icon: "error",
            timer: 2200,
            position: "bottom-end",
          })
        })

      setRefresh(!refresh)
    }
  }

  const addCharacterNote = async (charId, char, campaign) => {
    const result = await showAddNoteDialog(
      skills(
        Object.values(characters)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {})
      )
    )

    if (result) {
      await fetch(
        `/api/v1/notes/${encodeURI(campaign)}/${charId}`,
        {
          method: "POST",
          body: JSON.stringify(result),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then(res => {
          Swal.fire({
            title: "Note Added",
            toast: true,
            showConfirmButton: false,
            icon: "success",
            timer: 2000,
            position: "bottom-end",
          })
        })
        .then(() => setRefresh(!refresh))
    }
  }

  const deleteCharacter = async (charId, charName) => {
    const result = await Swal.fire({
      title: `You're about to delete ${charName}`,
      confirmButtonText: "Yes, delete",
      denyButtonText: "Don't delete",
      showDenyButton: true,
    })

    if (result.isConfirmed) {
      await fetch(
        `/api/v1/players/${charId}`,
        {
          method: "DELETE",
        }
      ).then(res => {
        Swal.fire({
          title: "Character deleted",
          toast: true,
          showConfirmButton: false,
          icon: "success",
          timer: 2200,
          position: "bottom-end",
        })
      })

      setRefresh(!refresh)
    }
  }

  const characterNotes = (charId, char, campaign) => {
    const deleteNote = (noteId) => {
      fetch(
        `/api/v1/notes/${encodeURI(campaign)}/${charId}/${noteId}`,
        {
          method: "DELETE",
        }
      )
        .then(res => {
          Swal.fire({
            title: "Note Deleted",
            toast: true,
            showConfirmButton: false,
            icon: "success",
            timer: 2000,
            position: "bottom-end",
          })
        })
    }

    showCharacterNotes(char, deleteNote)
  }

  return (
    <>
      <Header
        eyebrow="PARTY"
        title="Characters"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addCharacter}
          >
            Add Character
          </Button>
        }
      />

      <Grid container spacing={2}>
        {Object.entries(characters).map(([campaign, chars]) => (
          <Grid size={{ xs: 12 }} key={campaign}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  {campaign} · {Object.entries(chars).length} characters
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(chars).map(([charId, char]) => (
                    <Grid
                      key={charId}
                      size={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <Card>
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: P.primary,
                              }}
                              src={char.avatar}
                            />

                            <Box sx={{ flex: 1 }}>
                              <Typography fontWeight={800}>
                                {char.name}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {char.type}
                              </Typography>
                            </Box>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                editCharacter(
                                  charId,
                                  char,
                                  campaign
                                )
                              }}
                            >
                              <EditOutlined />
                            </IconButton>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                addCharacterNote(
                                  charId,
                                  char,
                                  campaign
                                )
                              }}
                            >
                              <NoteAdd />
                            </IconButton>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                characterNotes(
                                  charId,
                                  char,
                                  campaign
                                )
                              }}
                            >
                              <Note />
                            </IconButton>

                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteCharacter(
                                  charId,
                                  char.name
                                )
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          {/* Character details */}
                          <Grid
                            container
                            spacing={1}
                            sx={{
                              position: "relative",
                            }}
                          >
                            {/* Left column */}
                            <Grid size={{ xs: 6 }}>
                              <Stack spacing={1}>
                                {Object.entries(char.skills)
                                  .filter(
                                    (_, index) => index % 2 === 0
                                  )
                                  .map(([skill, value]) => (
                                    <Box
                                      key={skill}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "12px",
                                        alignItems: "center",
                                        height: "1.5em",
                                      }}
                                    >
                                      <img
                                        src="/d20.png"
                                        height="100%"
                                      />

                                      {value >= 0 ? "+" : "-"}{" "}
                                      {Math.abs(value)} {skill}
                                    </Box>
                                  ))}
                              </Stack>
                            </Grid>

                            {/* Vertical divider */}
                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            />

                            {/* Right column */}
                            <Grid size={{ xs: 6 }}>
                              <Stack spacing={1}>
                                {Object.entries(char.skills)
                                  .filter(
                                    (_, index) => index % 2 === 1
                                  )
                                  .map(([skill, value]) => (
                                    <Box
                                      key={skill}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "12px",
                                        alignItems: "center",
                                        height: "1.5em",
                                      }}
                                    >
                                      <img
                                        src="/d20.png"
                                        height="100%"
                                      />

                                      {value >= 0 ? "+" : "-"}{" "}
                                      {Math.abs(value)} {skill}
                                    </Box>
                                  ))}
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
