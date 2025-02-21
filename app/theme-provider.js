// app/theme-provider.js
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";

export default function AppThemeProvider({ children }) {
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: "light",
        primary: {
          main: "#3D3A4B",
        },
        secondary: {
          main: "#6B6575",
        },
        background: {
          default: "#F5F3E7", // Ensure this is properly applied
          paper: "#E8E6D5",
        },
        text: {
          primary: "#2E2B3E",
          secondary: "#5C596B",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            "html, body": {
              backgroundColor: "#F5F3E7 !important", // Force MUI background globally
              height: "100%",
            },
          },
        },
      },
    }), []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
