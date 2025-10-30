import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';

const modes = [
  { key: 'light', label: 'Claro' },
  { key: 'dark', label: 'Escuro' },
] as const;

export default function ThemeToggle() {
  const { theme, mode, setMode } = useAppTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {modes.map(m => {
        const active = mode === m.key;
        return (
          <Pressable
            key={m.key}
            onPress={() => setMode(m.key)}
            style={[
              styles.btn,
              {
                backgroundColor: active ? theme.colors.primary : 'transparent',
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={{ color: active ? '#fff' : theme.colors.text }}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRightWidth: 1,
  },
});