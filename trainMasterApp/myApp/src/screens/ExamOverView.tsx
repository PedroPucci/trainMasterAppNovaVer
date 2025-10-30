import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigatorScreenParams } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type ExamItem = { label: string; done?: boolean; note?: string };
type ModuleItem = { label: string; done?: boolean; note?: string };
type Module = { title: string; items: ModuleItem[] };

type TabParamList = {
  Inicio: undefined;
  Perfil: undefined;
  Aprendizado: undefined;
  Buscar: undefined;
  Menu: undefined;
};
type DrawerParamList = {
  HomeTabs: NavigatorScreenParams<TabParamList>;
  FaqScreen: undefined;
};

const EXAM_LIST: { title: string; items: ExamItem[] } = {
  title: "Módulo 1 – Introdução",
  items: [
    { label: "Prova 1", done: true },
    { label: "Prova 2" },
  ],
};

const MODULES: Module[] = [
  {
    title: "Módulo 1 – Introdução",
    items: [
      { label: "Aula 1: O que é Web?", done: true },
      { label: "Aula 2: Cliente e Servidor", note: "30%" },
    ],
  },
  {
    title: "Módulo 2 – HTML Básico",
    items: [
      { label: "Aula 3: Estrutura HTML" },
      { label: "Aula 4: Tags principais" },
    ],
  },
  {
    title: "Módulo 3 – Exercícios práticos",
    items: [{ label: "Quiz 1: HTML Básico" }],
  },
];

export default function ExamOverView() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const insets = useSafeAreaInsets();
  const drawerNav = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [menuOpen, setMenuOpen] = useState(false);

  const hardBg = isDark ? "#000000" : "#E9F1F0";
  const hardCard = isDark ? "#111111" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#0F1E25";
  const hardMuted = isDark ? "#B3B3B3" : "#647077";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  const goTab = (screen: keyof TabParamList) => {
    setMenuOpen(false);
    drawerNav.navigate("HomeTabs", { screen });
  };

  return (
    <View style={[s.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => {}} />

      <ScrollView
        contentContainerStyle={[
          s.body,
          { paddingBottom: Math.max(insets.bottom + 110, 120) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[local.title, { color: hardText }]}>Fundamentos da Web</Text>

        <Text style={[local.section, { color: hardText }]}>Prova</Text>
        <View
          style={[
            s.card,
            local.cardTight,
            {
              backgroundColor: hardCard,
              borderColor: hardBorder,
              shadowOpacity: isDark ? 0 : 0.08,
              elevation: isDark ? 0 : 6,
            },
          ]}
        >
          <View style={local.rowTop}>
            <Text style={[local.cardTitle, { color: hardText }]}>
              {EXAM_LIST.title}
            </Text>

            <Pressable style={[local.cta, { backgroundColor: "#51C391" }]}>
              <Text style={local.ctaText}>Entrar</Text>
            </Pressable>
          </View>

          <View style={local.list}>
            {EXAM_LIST.items.map((it, idx) => (
              <Line
                key={`exam-${idx}`}
                textColor={hardText}
                muted={hardMuted}
                {...it}
              />
            ))}
          </View>
        </View>

        <Text style={[local.section, { color: hardText, marginTop: 8 }]}>
          Exercícios
        </Text>
        <Text style={{ color: hardMuted, fontWeight: "700", marginBottom: 8 }}>
          3 de 5 módulos concluídos
        </Text>

        {MODULES.map((m) => (
          <View
            key={m.title}
            style={[
              s.card,
              local.cardTight,
              {
                backgroundColor: hardCard,
                borderColor: hardBorder,
                shadowOpacity: isDark ? 0 : 0.08,
                elevation: isDark ? 0 : 6,
              },
            ]}
          >
            <View
              style={[
                local.moduleHeader,
                { borderColor: isDark ? "#2A2A2A" : "#EAEAEA" },
              ]}
            >
              <Text style={[local.cardTitle, { color: hardText }]}>{m.title}</Text>
            </View>

            <View style={local.list}>
              {m.items.map((it, idx) => (
                <Line
                  key={`${m.title}-${idx}`}
                  textColor={hardText}
                  muted={hardMuted}
                  {...it}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={[local.legend, { borderColor: hardBorder }]}>
          <Dot />
          <Text style={[local.legendText, { color: hardText }]}>
            Prazo final para avaliação
          </Text>
          <Dot color="#E9C46A" />
          <Text style={[local.legendText, { color: hardText }]}>
            Prazo final para atividades
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          footer.wrapper,
          { paddingBottom: Math.max(insets.bottom + 8, 14) },
        ]}
      >
        <FooterItem icon="home" label="Início" onPress={() => goTab("Inicio")} />
        <FooterItem icon="person" label="Perfil" onPress={() => goTab("Perfil")} />
        <FooterItem
          icon="book"
          label="Meu aprendizado"
          onPress={() => goTab("Aprendizado")}
        />
        <FooterItem icon="search" label="Buscar" onPress={() => goTab("Buscar")} />
        <FooterItem icon="menu" label="Menu" onPress={() => setMenuOpen(true)} />
      </View>

      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={sheet.container}>
          <Pressable style={sheet.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={sheet.sheet}>
            <View style={sheet.handle} />
            <Text style={sheet.title}>Menu</Text>

            <View>
              <MenuRow
                icon="home-outline"
                label="Home"
                onPress={() => goTab("Inicio")}
              />
              <MenuRow
                icon="person-outline"
                label="Perfil"
                onPress={() => goTab("Perfil")}
              />
              <MenuRow
                icon="book-outline"
                label="Meu aprendizado"
                onPress={() => goTab("Aprendizado")}
              />
              <MenuRow
                icon="search-outline"
                label="Buscar"
                onPress={() => goTab("Buscar")}
              />
              <MenuRow
                icon="help-circle-outline"
                label="Perguntas frequentes"
                onPress={() => setMenuOpen(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Line({
  label,
  done,
  note,
  textColor,
  muted,
}: {
  label: string;
  done?: boolean;
  note?: string;
  textColor: string;
  muted: string;
}) {
  return (
    <View style={local.line}>
      <Ionicons
        name={done ? "checkbox" : "stop-outline"}
        size={18}
        color={done ? "#51C391" : muted}
        style={{ marginRight: 8 }}
      />
      <Text
        style={[
          local.lineText,
          { color: textColor, opacity: done ? 1 : 0.95 },
        ]}
        numberOfLines={2}
      >
        {label}
        {done ? " (✓)" : ""}
        {note ? `  (${note})` : ""}
      </Text>
    </View>
  );
}

function Dot({ color = "#E76F51" }: { color?: string }) {
  return <View style={[local.dot, { backgroundColor: color }]} />;
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <>
      <TouchableOpacity style={sheet.row} onPress={onPress}>
        <Ionicons name={icon} size={22} style={sheet.rowIcon} />
        <Text style={sheet.rowLabel}>{label}</Text>
      </TouchableOpacity>
      <View style={sheet.divider} />
    </>
  );
}

function FooterItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={footer.item}
      android_ripple={{ color: "rgba(255,255,255,0.15)" }}
    >
      <Ionicons name={icon} size={38} color="#FFFFFF" />
      <Text style={footer.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const local = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  section: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cta: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "800" },
  cardTight: { paddingVertical: 14, paddingHorizontal: 16 },
  cardTitle: { fontSize: 15, fontWeight: "800", marginBottom: 8 },
  list: { marginTop: 2 },
  line: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  lineText: { fontSize: 14, fontWeight: "600", flex: 1 },
  moduleHeader: {
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    marginTop: 6,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: "700", marginRight: 12 },
});

const footer = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#50C2C9",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  item: { alignItems: "center", justifyContent: "center", flex: 1 },
  label: { color: "#FFFFFF", fontSize: 12, marginTop: 2, fontWeight: "700" },
});

const sheet = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    minHeight: 360,
    maxHeight: "70%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginBottom: 8,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowIcon: { color: "rgba(255,255,255,0.9)", width: 28 },
  rowLabel: { color: "#fff", fontSize: 16, marginLeft: 6 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
