import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";

export type ChipItem = { id: string; label: string };

type Props = {
  title?: string;
  items: ChipItem[];
  selectedId?: string | null;
  onPress: (item: ChipItem) => void;
  containerStyle?: ViewStyle;
  chipStyle?: ViewStyle;
  chipTextStyle?: TextStyle;
};

export default function TrendingChips({
  title = "Principais pesquisas",
  items,
  selectedId,
  onPress,
  containerStyle,
  chipStyle,
  chipTextStyle
}: Props) {

      const { theme } = useAppTheme();
      const isDark = theme.name === "dark";
      const hardText = isDark ? "#FFFFFF" : "#000000";
  return (
    <View style={[s.container, containerStyle]}>
      <Text style={[s.title, { color: hardText}]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.row}
      >
        {items.map((it) => {
          const active = it.id === selectedId;
          return (
            <Pressable
              key={it.id}
              onPress={() => onPress(it)}
              style={({ pressed }) => [
                s.chip,
                active && s.chipActive,
                pressed && s.chipPressed,
                chipStyle
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Pesquisar por ${it.label}`}
            >
              <Text
                style={[
                  s.chipText,
                  active && s.chipTextActive,
                  chipTextStyle
                ]}
                numberOfLines={1}
              >
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const TURQUOISE = "#4EC7CC";
const s = StyleSheet.create({
  container: { marginTop: 12 },
  title: {
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a"
  },
  row: { paddingHorizontal: 16, gap: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#E6F6F7"
  },
  chipActive: {
    backgroundColor: TURQUOISE
  },
  chipPressed: {
    opacity: 0.9
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f766e"
  },
  chipTextActive: {
    color: "#ffffff"
  }
});
