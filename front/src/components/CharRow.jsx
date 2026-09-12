import { P } from '../theme'
import { Paper, Stack, Checkbox, Avatar, Box, Typography, IconButton } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { showCharacterNotes } from './CharacterNotes';

export default function CharRow({ character, selected, onToggle, skill }) {

  return (
    <Paper
      variant="outlined"
      onClick={onToggle}
      sx={{
        p: 1.2,
        cursor: "pointer",
        bgcolor: selected ? "rgba(139,92,246,.08)" : P.surface,
        borderColor: selected ? P.primary : P.border,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.4}>
        <Checkbox checked={selected} onChange={onToggle} />
        <Avatar sx={{ bgcolor: selected ? P.primary : P.surface2}} src={character.avatar}>
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={700}>{character.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {character.type}
          </Typography>
        </Box>
        { (character.notes ?? []).filter(it => it.boost.includes(skill) || it.boost === "all").length > 0 && <IconButton onClick={() => showCharacterNotes(character, null, skill)}>
              <InfoOutlined sx={{ color: "#a995ff;" }} />
            </IconButton> }
        <Box textAlign="right">
          <Stack direction="row">
            <Box>
              <Typography variant="caption" color="text.secondary">
                {skill}
              </Typography>
              <Typography fontWeight={800}>{(character.skills[skill] ?? 0) >= 0 ? "+" : ""}{character.skills[skill] ?? 0}</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}