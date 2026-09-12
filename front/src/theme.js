import { createTheme } from '@mui/material'

export const P = {
  bg: "#0d1117",
  surface: "#151b24",
  surface2: "#1b2330",
  border: "#2a3442",
  text: "#f4f6fa",
  muted: "#9aa7b8",
  primary: "#8b5cf6",
  success: "#39c26b",
  warning: "#eab308",
  error: "#ef5350",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: P.primary },
    background: { default: P.bg, paper: P.surface },
    success: { main: P.success },
    warning: { main: P.warning },
    error: { main: P.error },
  },
  typography: { fontFamily: "Inter,system-ui,sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none", border: `1px solid ${P.border}` },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
