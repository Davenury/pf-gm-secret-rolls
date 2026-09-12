import { P } from '../theme'
import { Drawer, Toolbar, Avatar, Box, Typography, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Casino, People, History, Settings } from '@mui/icons-material'

export default function Sidebar({ view, setView }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 230,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 230,
          boxSizing: "border-box",
          borderRight: `1px solid ${P.border}`,
          bgcolor: P.surface,
        },
      }}
    >
      <Toolbar>
        <Avatar sx={{ bgcolor: P.primary, mr: 1 }}>
          <Casino />
        </Avatar>
        <Box>
          <Typography fontWeight={800}>GM Rolls</Typography>
          <Typography variant="caption" color="text.secondary">
            Pathfinder 2e
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ p: 1.5 }}>
        {[
          ["checks", "Checks", <Casino />],
          ["characters", "Characters", <People />],
          ["history", "History", <History />],
        ].map(([id, l, i]) => (
          <ListItemButton
            key={id}
            selected={view === id}
            onClick={() => setView(id)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{i}</ListItemIcon>
            <ListItemText primary={l} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}