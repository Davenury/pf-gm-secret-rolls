import { Card, CardContent, Stack, Avatar, Box, Typography, Chip, IconButton } from '@mui/material'
import { ArrowUpward, Psychology, DeleteOutline, Add, Adjust, Remove, InfoOutlined } from '@mui/icons-material'
import { skills } from '../data'
import { P } from '../theme'
import { char, mod } from '../utils'
import { showCharacterNotes } from './CharacterNotes'

export default function Aid({ characters, aid, onDelete }) {

  aid = aid ?? {}
  let t = characters[aid.targetId] ?? {}
  let h = characters[aid.aiderId] ?? {}
  return (
    <Card variant="outlined" sx={{height: "100%"}}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 }, flex: 1, overflowY: "auto" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems="center"
        >
          <Stack
            direction="column"
            alignItems="center"
            spacing={1}
            sx={{ flex: 1 }}
          >
            <Avatar sx={{ bgcolor: P.primary }} src={t.avatar}>
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Target
              </Typography>
              <Typography fontWeight={700}>{t.name}</Typography>
            </Box>
            <ArrowUpward color="disabled" />
            <Avatar sx={{ bgcolor: "#374151" }} src={h.avatar}>
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Aider
              </Typography>
              <Typography fontWeight={700}>{h.name}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} sx={{flex: 2}}>
            <Stack direction="column" spacing={1}>
              <Chip
                icon={<Adjust />}
                label={`DC: ${aid.dc}`}
                variant="outlined"
              />
              <Chip
                icon={<Psychology />}
                label={`Skill: ${aid.skill} +${mod(h, aid.skill)}`}
                variant="outlined"
              />
              {
                (h.notes ?? []).filter(it => it.boost.includes(aid.skill) || it.boost === "all").length > 0 && 
                  <Chip
                    icon={<InfoOutlined />}
                    label={`${(h.notes ?? []).filter(it => it.boost.includes(aid.skill) || it.boost === "all").length} notes`}
                    variant="outlined"
                    onClick={() => showCharacterNotes(h, null, aid.skill)}
                  />
              }
            </Stack>
            <Stack direction="column" spacing={1}>
              <Chip
                icon={<Add />}
                label={`Crit Success: ${aid.bonuses.critSuccess}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                icon={<Add />}
                label={`Success: ${aid.bonuses.success}`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<Remove />}
                label={`Fail: ${aid.bonuses.fail}`}
                color="error"
                variant="outlined"
              />
              <Chip
                icon={<Remove />}
                label={`Crit Fail: ${aid.bonuses.critFail}`}
                color="error"
                variant="outlined"
              />
            </Stack>
          </Stack>
          <IconButton onClick={onDelete}>
            <DeleteOutline />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}