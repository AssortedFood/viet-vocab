// app/theme-provider.js
"use client";

import { ThemeProvider, createTheme, GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";

/** ——— EASY‑TO‑EDIT COLOUR DEFINITIONS ——— */
const COLOR_TOKENS = {
  light: {
    primary:    "#3D3A4B",
    secondary:  "#6B6575",
    success:    "#66bb6a",
    background: "#F5F3E7",
    paper:      "#E8E6D5",
    text:       "#2E2B3E",
    textSubtle: "#5C596B",
  },
  dark: {
    primary:    "#6C6490",
    secondary:  "#908CA6",
    success:    "#81c784",
    background: "#2E2B3E",
    paper:      "#3D3A4B",
    text:       "#F5F3E7",
    textSubtle: "#E8E6D5",
  },
};
/** ————— END COLOUR TOKENS ————— */

export default function AppThemeProvider({ children }) {
  // 1) detect user’s preference
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDark ? "dark" : "light";
  const tokens = COLOR_TOKENS[mode];

  // 2) build the MUI theme from those handful of values
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary:   { main: tokens.primary },
        secondary: { main: tokens.secondary },
        success:   { main: tokens.success },
        background: {
          default: tokens.background,
          paper:   tokens.paper,
        },
        text: {
          primary:   tokens.text,
          secondary: tokens.textSubtle,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius:  8,
              fontWeight:    "bold",
              fontFamily:    "var(--font-geist-sans), Arial, sans-serif",
            },
            containedPrimary: {
              // ensure good contrast automatically
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.primary.main),
            },
            containedSuccess: {
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.success.main),
            },
          },
        },
        // …any other component overrides
      },
    });
  }, [mode, tokens]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 3) expose simple CSS vars for non‑MUI code, and inform the browser */}
      <GlobalStyles
        styles={{
          ":root": {
            "--app-bg": tokens.background,
            "--app-fg": tokens.text,
            colorScheme: mode,
          },
          html: { colorScheme: mode },
          body: {
            background: "var(--app-bg)",
            color:      "var(--app-fg)",
          },
        }}
      />

      {children}
    </ThemeProvider>
  );
}
