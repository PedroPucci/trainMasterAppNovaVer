import { View, Text, Pressable } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Inicio: "home",
  Perfil: "person",
  Aprendizado: "book",
  Buscar: "search",
  Menu: "menu",
};

export default function FooterMenu({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          (options.tabBarLabel as string) ??
          (options.title as string) ??
          route.name;
        const isFocused = state.index === index;
        const color = isFocused ? "#FFFFFF" : "rgba(255,255,255,0.85)";
        const onPress = () => {
          const ev = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !ev.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };
        const baseIcon = ICONS[route.name] ?? "ellipse";

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <Ionicons name={baseIcon} size={38} color={color} />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}