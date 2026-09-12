import Header from './Header'
import { useEffect, useState } from 'react'
import { Grid, Button, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Stack, Box, Alert, Card } from '@mui/material'
import { Add, Casino, SevenK } from '@mui/icons-material'
import { C, skills } from '../data'
import CharRow from './CharRow'
import Aid from './Aid'
import { showAddAidDialog } from './AddAid'
import Swal from 'sweetalert2';
import '../sweetalert.css'

export default function Setup({ onRoll, initialData, onSelectCampaign, onLoadCharacters, initialCampaign }) {
  const [skill, setSkill] = useState(initialData?.skill ?? "perception"),
    [dc, setDc] = useState(initialData?.dc ?? 18),
    [sel, setSel] = useState(initialData?.selected ?? []),
    [aids, setAids] = useState([]),
    [campaign, setCampaign] = useState(initialCampaign ?? "");
  
  const [characters, setCharacters] = useState({})
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
     fetch("http://localhost:8080/api/v1/campaigns")
      .then(res => res.json())
      .then(json => {
        setCampaigns(json)
      })
  }, [])

  useEffect(() => {
    if (campaign != "") {
      fetch(`http://localhost:8080/api/v1/players?campaign=${encodeURI(campaign)}`)
        .then(res => res.json())
        .then(json => {
          setCharacters(json)
          onLoadCharacters(json)
        })
    }
  }, [campaign])

  const toggle = (id) =>{
    setSel(() => (sel.includes(id) ? sel.filter((y) => y !== id) : [...sel, id]));
  }

  const roll = () => {
    if (sel.length === 0) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',

        icon: 'warning',

        title: 'No characters selected',
        text: 'Select at least one character before rolling.',

        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,

        customClass: {
          popup: 'pathfinder-swal-toast',
        },
      });
    } else if (aids.length > 0 && !aids.map(it => it.targetId).every(targetId => sel.includes(targetId))) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',

        icon: 'warning',

        title: 'Unused aids',
        text: 'There are characters that are aided and not in the roll',

        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,

        customClass: {
          popup: 'pathfinder-swal-toast',
        },
      });
    } else if (aids.length > 0 && aids.map(it => it.aiderId).some(aiderId => sel.includes(aiderId))) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',

        icon: 'warning',

        title: 'Aid and skill check',
        text: 'There are characters that are aiding another and checking the skill',

        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,

        customClass: {
          popup: 'pathfinder-swal-toast',
        },
      });
    } else {
      onRoll({ characters, skill, dc, selected: sel, aids })
    }
  }

  const addAid = async () => {
    const aid = await showAddAidDialog(characters)

    if (aid) {
      setAids([...aids, aid])
    }
  };
  return (
    <>
      <Header
        eyebrow="NEW CHECK"
        title="Group Check"
      />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Box>
                <Typography fontWeight={800} sx={{ mb: 2 }}>
                  1. Choose current campaign
                </Typography>
              </Box>
              <Grid container>
                  <FormControl fullWidth>
                    <InputLabel>Campaign</InputLabel>
                    <Select
                      value={campaign}
                      label="Campaign"
                      onChange={(e) => {
                        setCampaign(e.target.value)
                        onSelectCampaign(e.target.value)
                      }}
                    >
                      {campaigns.map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              </Grid>
              <Box sx={{mt: 3}}>
                <Typography fontWeight={800} sx={{ mb: 2 }}>
                  2. Choose the check
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <FormControl fullWidth>
                    <InputLabel>Skill check</InputLabel>
                    <Select
                      value={skill}
                      label="Skill check"
                      onChange={(e) => setSkill(e.target.value)}
                    >
                      {skills(characters).map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="DC"
                    value={dc}
                    onChange={(e) =>
                      setDc(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </Grid>
              </Grid>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mb: 1.5 }}
              >
                <Box>
                  <Typography fontWeight={800}>
                    3. Select who is rolling
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {sel.length} players selected
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() =>
                    setSel(sel.length === Object.keys(characters).length ? [] : Object.keys(characters))
                  }
                >
                  {sel.length === Object.keys(characters).length ? "Deselect all" : "Select all"}
                </Button>
              </Stack>
              <Stack spacing={1}>
                {Object.entries(characters).map(([id, c]) => (
                  <CharRow
                    key={id}
                    character={c}
                    selected={sel.includes(id)}
                    onToggle={() => toggle(id)}
                    skill={skill}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography fontWeight={800}>Aid Another</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Attach helpers to the characters making the actual check. Aid
                rolls remain hidden from the main results list.
              </Typography>
              <Stack spacing={1.5}>
                {aids.map((aid, i) => (
                  <Aid
                    key={i}
                    aid={aid}
                    characters={characters}
                    onDelete={() => setAids((x) => x.filter((_, j) => j !== i))}
                  />
                ))}
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                sx={{ mt: 2 }}
                onClick={addAid}
                disabled={campaign === ""}
              >
                Add Aid Relationship
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card
            sx={{
              bgcolor: "rgba(139,92,246,.08)",
              borderColor: "rgba(139,92,246,.35)",
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ md: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={800}>
                    {skill} · DC {dc}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sel.length} rollers · {aids.length} Aid relationships
                  </Typography>
                </Box>
                <Button
                  size="large"
                  variant="contained"
                  startIcon={<Casino />}
                  onClick={() => roll()}
                >
                  Roll All Checks
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}