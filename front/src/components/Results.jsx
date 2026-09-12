import Header from './Header'
import { P } from '../theme'
import {useState} from 'react'
import { Stack, Button, Grid, Paper, Typography, Card, CardContent, Box, Divider, Avatar, Chip, IconButton } from '@mui/material'
import { Casino, ChevronRight, Info, InfoOutlined } from '@mui/icons-material'
import { showCharacterNotes } from './CharacterNotes'

export default function Results({ data, onNew, campaign, type }) {

  const [open, setOpen] = useState(null),
    name = data.skill;

  return (
    <>
      <Header
        eyebrow="RESULTS"
        title={`${name} · DC ${data.dc}`}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Casino />}
              onClick={() => onNew({}, campaign)}
            >
              New Check
            </Button>
          </Stack>
        }
      />
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {[
          ["Critical Success", "warning"],
          ["Success", "success"],
          ["Failure", "error"],
          ["Critical Failure", "error"],
        ].map(([l, col]) => (
          <Grid size={{ xs: 6, sm: 3 }} key={l}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={900} color={`${col}.main`}>
                {data.results.filter((r) => r.result === l).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {l}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent sx={{ p: 0 }}>
          {data.results.map((r, i) => {
            let notes = (r.character.notes ?? []).filter(it => it.boost === "all" || it.boost.includes(name))
            let o = open === r.id;
            return (
              <Box key={r.id}>
                {i > 0 && <Divider />}
                <Box
                  onClick={() => setOpen(o ? null : r.id)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderLeft: `4px solid ${
                      r.result.includes("Failure")
                        ? P.error
                        : r.result === "Critical Success"
                        ? P.warning
                        : P.success
                    }`,
                    "&:hover": { bgcolor: "rgba(255,255,255,.025)" },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ sm: "center" }}
                  >
                    <Avatar sx={{ bgcolor: P.surface2 }} src={r.character.avatar}>
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={800}>
                          {r.character.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={r.result}
                          color={
                            r.result.includes("Failure")
                              ? "error"
                              : r.result === "Critical Success"
                              ? "warning"
                              : "success"
                          }
                          variant="outlined"
                        />
                        {
                          r.just != "" && (<Chip
                                            size="small"
                                            label={r.just}
                                            variant="outlined"
                                            color={
                                            r.result.includes("Failure")
                                              ? "error"
                                              : "success"
                                          }
                                          />)
                        }
                        {
                          notes.length > 0 && (<Chip size="small" icon={<Info />} label="Notes" onClick={(e) => {e.stopPropagation(); showCharacterNotes(r.character, null, name)}} />)
                        }
                        <Chip 
                          size="small"
                          label={`Nat roll: ${r.d20}`}
                          variant="outlined"
                          color={r.nat20 ? "warning" : r.nat1 ? "error" : "info"}
                        />
                        {
                          r.aids.length > 0 && (<Chip size="small" label="Aided" variant="outlined" />)
                        }
                      </Stack>
                    </Box>
                    <Typography variant="h5" fontWeight={900}>
                      {r.total}
                    </Typography>
                    <ChevronRight
                      sx={{ transform: o ? "rotate(90deg)" : "none" }}
                    />
                  </Stack>
                  {o && (
                    <Box sx={{ mt: 2, ml: { sm: 7 } }}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "rgba(255,255,255,.02)" }}
                      >
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          fontWeight={800}
                        >
                          ROLL COMPOSITION
                        </Typography>
                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={1}
                          sx={{ mt: 0.5 }}
                        >
                          <Chip label={`Nat roll (${r.d20})`} />
                          <Chip
                            label={`Character Skill: ${r.charSkill >= 0 ? "+" : ""}${
                              r.charSkill
                            } ${name}`}
                          />
                          {
                            r.aids.length > 0 && (<Chip
                                  variant="outlined"
                                  label={`${r.aidBonus >= 0 ? '+' : '-'}${r.aidBonus} from Aid`}
                                />)
                          }
                          <Chip variant="outlined" label={`Total ${r.total}`} />
                        </Stack>
                        {r.aids.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography fontWeight={800}>
                              Aids details
                            </Typography>
                            {r.aids.map((a, j) => (
                              <Stack
                                key={j}
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ mt: 1 }}
                              >
                                <Avatar
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    bgcolor: "#374151",
                                  }}
                                  src={a.aider.avatar}
                                >
                                  
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row">
                                    <Typography variant="body2" fontWeight={700}>
                                      {a.aider.name}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {a.skillName} · Nat roll: {a.d20} + {a.bonus} (aider skill) ={" "}
                                    {a.total} · Aid DC: {a.aidDc}
                                  </Typography>
                                </Box>
                                {
                                  (a.aider.notes ?? []).filter(it => it.boost.includes(a.skillName) || it.boost === "all").length > 0 && (<IconButton onClick={(e) => {
                                          e.stopPropagation()
                                          showCharacterNotes(a.aider, null, a.skillName)
                                        }}>
                                          <InfoOutlined />
                                        </IconButton>)
                                }
                                <Chip
                                  size="small"
                                  color={
                                    a.aidResult.result.includes("Failure")
                                      ? "error"
                                      : a.aidResult.result === "Critical Success"
                                      ? "warning"
                                      : "success"
                                  }
                                  label={
                                    a.aidResult.result
                                  }
                                />
                              </Stack>
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}