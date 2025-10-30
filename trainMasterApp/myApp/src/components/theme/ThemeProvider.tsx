import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppTheme, darkTheme, lightTheme, ThemeMode } from "../../theme/theme";

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "@trainmaster:theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const effectiveScheme: "light" | "dark" =
    mode === "system" ? (systemScheme ?? "light") : mode;

  const theme = useMemo<AppTheme>(
    () => (effectiveScheme === "dark" ? darkTheme : lightTheme),
    [effectiveScheme]
  );

  const setMode = async (next: ThemeMode) => {
    setModeState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const value: ThemeContextValue = { theme, mode, setMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used inside ThemeProvider");
  return ctx;
}