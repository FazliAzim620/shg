import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: {
            main: "rgba( 55, 125, 255)",
          },
          secondary: {
            main: "rgba(108.89062, 116.15, 123.40937)",
          },
          background: {
            online_clr: "#00C9A7",
            default: "#fff",
            paper: "#ffffff",
            btn_blue: "#007BFF",
            navbar_bg: "#fff",
            page_bg: "#F0F2F5",
            success: "#00c9a7",
            event: "#b1f1fb",
          },
          text: {
            btn_theme: "#007BFF",
            btn_blue: "#007BFF",
            main: "#007BFF",
            black: "#1e2022",
            primary: "#677788",
            secondary: "#677788",
            //link:'#1976d2',
            link: "#377dff",
            success: "#4caf50",
            error: "#d32f2f",
            input_text: "#121212",
            or_color: "#8c98a4",
            form_input: "#71869d",
          },
          border: {
            primary: "#ffffff",
            secondary: "#fffd",
            gray: "#666666",
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: "#1e2022",
          },
          secondary: {
            main: "#f48fb1",
          },
          background: {
            online_clr: "#00C9A7",
            default: "#121212",
            paper: "#25282a  ",
            btn_blue: "#007BFF",
            navbar_bg: "#25282A",
            page_bg: "#121212",
            event: "#b1f1fb",
          },

          text: {
            btn_theme: "#007BFF",
            form_input: "#71869d",
            or_color: "#8C98A4",
            black: "#fff",
            primary: "#fff",
            secondary: "rgba(196.88125, 200.3, 203.71875)",
            link: "rgba(196.88125, 200.3, 203.71875)",
            success: "#4caf50",
            error: "#d32f2f",
            input_text: "#121212",
            form_input: "#6D747B",
          },
          border: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
          },
        }),
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});
const getProviderDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: {
            main: "#6d4a96",
          },
          secondary: {
            main: "rgba(108.89062, 116.15, 123.40937)",
          },
          background: {
            online_clr: "#00C9A7",
            default: "#fff",
            paper: "#ffffff",
            btn_blue: "#007BFF",
            navbar_bg: "#fff",
            page_bg: "#F0F2F5",
            success: "#00c9a7",
            main: "#6d4a96",
            event: "#EAF1FF",
          },
          text: {
            btn_theme: "#6d4a96",
            form_input: "#71869d",
            btn_blue: "#007BFF",
            black: "#1e2022",
            main: "#6d4a96",
            primary: "#1e2022",
            secondary: "#677788",
            //link:'#1976d2',
            link: "#377dff",
            success: "#4caf50",
            error: "#d32f2f",
            input_text: "#121212",
            or_color: "#8c98a4",
            form_input: "#71869d",
          },
          border: {
            primary: "#ffffff",
            secondary: "#fffd",
            gray: "#666666",
            lightGray: "#eef0f7",
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: "rgba( 55, 125, 255)",
          },
          secondary: {
            main: "#f48fb1",
          },
          background: {
            online_clr: "#00C9A7",
            default: "#121212",
            paper: "#1E2022  ",
            btn_blue: "#007BFF",
            navbar_bg: "#25282A",
            page_bg: "#121212",
            event: "##EAF1FF",
          },

          text: {
            btn_theme: "#6d4a96",
            or_color: "#8C98A4",
            black: "#fff",
            primary: "#fff",
            secondary: "rgba(196.88125, 200.3, 203.71875)",
            link: "rgba(196.88125, 200.3, 203.71875)",
            success: "#4caf50",
            error: "#d32f2f",
            input_text: "#121212",
            form_input: "#6D747B",
          },
          border: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
            lightGray: "#eef0f7",
          },
        }),
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export const getTheme = (mode, provider) =>
  createTheme(provider ? getProviderDesignTokens(mode) : getDesignTokens(mode));
