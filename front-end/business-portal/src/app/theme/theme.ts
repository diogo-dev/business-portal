"use client";

import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0e044b',
      light: '#3300cc',
      dark: '#050027',
    }
  }
})

export default theme;