import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box, Toolbar, Typography, Stack, Tooltip, IconButton, Avatar } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import Setup from './components/Setup'
import History from './components/History'
import Results from './components/Results'
import Characters from './components/Characters'
import Sidebar from './components/Sidebar'
import { P, theme } from './theme'
import roll from './utils'

function App() {
  const [v, setV] = useState("checks");
  const [campaign, setCampaign] = useState("")
  const [characters, setCharacters] = useState({})
  const initial = {
    skill: "perception",
    dc: 18,
    selected: [],
    aids: [],
  };
  const [data, setData] = useState({});
  const [history, setHistory] = useState({})
  const perform = async (c) => {

    const d = roll(c)

    await fetch(`/api/v1/history`, {
      method: "POST",
      body: JSON.stringify(d),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setHistory({})
    setData(d);
    setV("results");
  };
  const newRoll = (data, campaign) => {
    setHistory({})
    setCampaign(campaign)
    setV("checks");
  };

  const loadHistory = (historyEntry) => {
    setHistory(historyEntry)
    setData({})

    setV("results")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: P.bg }}>
        <Sidebar view={v === "results" ? "checks" : v} setView={setV} />
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              borderBottom: `1px solid ${P.border}`,
              bgcolor: "rgba(13,17,23,.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography fontWeight={700}>
                {v === "checks" ? "Checks" : v[0].toUpperCase() + v.slice(1)}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Visibility mode">
                  <IconButton>
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Avatar sx={{ width: 32, height: 32, bgcolor: P.surface2 }}>
                  GM
                </Avatar>
              </Stack>
            </Toolbar>
          </Box>
          <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1320, mx: "auto" }}>
            {v === "checks" && <Setup onRoll={perform} initialData={data} initialCampaign={campaign} onSelectCampaign={(campaign) => setCampaign(campaign)} onLoadCharacters={(chars) => setCharacters(chars)} />}{" "}
            {v === "results" && <Results data={Object.entries(history).length > 0 ? history : data} onNew={newRoll} campaign={campaign} characters={characters}/>}{" "}
            {v === "characters" && <Characters />}{" "}
            {v === "history" && <History load={(history) => loadHistory(history)} />}{" "}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default App;
