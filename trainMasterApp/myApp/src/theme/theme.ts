export type ThemeMode = "system" | "light" | "dark";

export type Colors = {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
};

export type AppTheme = {
  name: "light" | "dark";
  colors: Colors;
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    bg: "#FFFFFF",
    card: "#F7F7F7",
    text: "#111111",
    textMuted: "#666666",
    border: "#E5E5E5",
    primary: "#2563EB",
  },
};

export const darkTheme: AppTheme = {
  name: "dark",
  colors: {
    bg: "#0B0B0C",
    card: "#141416",
    text: "#F5F5F5",
    textMuted: "#A3A3A3",
    border: "#2A2A2E",
    primary: "#60A5FA",
  },
};