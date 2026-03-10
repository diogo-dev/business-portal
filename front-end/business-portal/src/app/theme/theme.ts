"use client";

import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(227, 227, 227)',
      light: '#6b7280',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0e044b',
      light: '#3300cc',
      dark: '#050027',
    },
    success: {
      main: '#00e599',
      light: '#00ffaf',
      dark: '#00ab6c',
    },
  }
})

export default theme;