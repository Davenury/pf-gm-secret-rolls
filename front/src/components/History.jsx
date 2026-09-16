import React, {useState, useEffect} from 'react'
import { TextField, Card, List, Divider, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material'
import { ChevronRight, Casino, Delete } from '@mui/icons-material'
import Header from './Header'
import Swal from 'sweetalert2'

export default function History({ load }) {
  const [history, setHistory] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch(`/api/v1/history`)
      .then(res => res.json())
      .then(it => setHistory(it))
  }, [refresh])

  const results = (historyEntry) => historyEntry.results.reduce((acc, curr) => {
    if (!acc[curr.result]) {
      acc[curr.result] = 1
    } else {
      acc[curr.result] += 1
    }

    return acc
  }, {})

  const clearHistory = () => {
    fetch(`/api/v1/history`, {
      method: "DELETE"
    }).then(res => {
      Swal.fire({
        title: "History cleared",
        toast: true,
        showConfirmButton: false,
        icon: "success",
        timer: 2000,
        position: "bottom-end",
      })
      setRefresh(!refresh)
    })
  }

  return (
    <>
      <Header
        eyebrow="ROLL LOG"
        title="Check History"
        action={
          <Button
            variant="contained"
            startIcon={<Delete />}
            onClick={clearHistory}
            color="error"
          >
            Clear History
          </Button>
        }
      />
      <Card>
        <List disablePadding>
          {history.map((h, i) => {
            const result = results(h)
            return (
            <React.Fragment key={`${i}`}>
              {i > 0 && <Divider />}
              <ListItemButton onClick={() => load(h)} sx={{ py: 1.75 }}>
                <ListItemIcon>
                  <Casino />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight={800}>
                      {h.skill}{" "}
                      <Typography component="span" color="text.secondary">
                        · DC {h.dc}
                      </Typography>
                    </Typography>
                  }
                  secondary={`Critical Successes: ${result["Critical Success"] ?? 0} · Successes: ${result["Success"] ?? 0} · Fails: ${result["Failure"] ?? 0} · Critical Fails: ${result["Critical Failure"] ?? 0}`}
                />
                <Typography variant="caption" color="text.secondary">
                  {h.time}
                </Typography>
                <ChevronRight />
              </ListItemButton>
            </React.Fragment>
          )})}
        </List>
      </Card>
    </>
  );
}