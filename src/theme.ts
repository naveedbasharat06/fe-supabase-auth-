'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primary: {
      main: "#54d219",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export default theme;
