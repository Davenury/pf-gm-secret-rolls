import { Stack, Box, Typography } from '@mui/material'

export default function Header({ title, eyebrow, action }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2.5 }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={700}>
          {eyebrow}
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          {title}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}