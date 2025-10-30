import React, { useState } from "react";
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  LayoutAnimation, Platform, UIManager, Modal, TouchableOpacity
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigatorScreenParams } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabParamList = {
  Inicio: undefined; Perfil: undefined; Aprendizado: undefined; Buscar: undefined; Menu: undefined;
};
type DrawerParamList = {
  HomeTabs: NavigatorScreenParams<TabParamList>;
  FaqScreen: undefined;
};

type QA = { id: number; q: string; a: string };
const DATA: QA[] = [
  { id: 1, q: "Como encontro e entro nos cursos?", a: "Vá em Buscar (lupa) e digite o tema. Toque no curso para abrir a página e depois em “Iniciar curso”." },
  { id: 2, q: "Onde vejo meu progresso?", a: "Na tela Início você tem os lembretes de progresso. Dentro de cada curso, a barra no topo mostra percentuais de aulas e atividades concluídas." },
  { id: 3, q: "Consigo emitir certificado?", a: "Sim. Ao concluir 100% do curso, o botão “Gerar certificado” aparece na página do curso. O PDF também fica salvo no seu perfil em Certificados." },
  { id: 4, q: "Como altero meus dados (nome, e-mail, CPF)?", a: "Abra a aba Perfil, edite os campos e toque em Atualizar. Alguns dados podem exigir validação adicional." },
  { id: 5, q: "Calendário e prazos das atividades", a: "Na tela Início, seção “Atenção às datas”, você vê as marcações do mês. Toque em um dia para ver detalhes das entregas." },
  { id: 6, q: "Não estou conseguindo entrar", a: "Verifique CPF e senha. Se precisar, toque em “Esqueceu sua senha?” na tela de login para redefinir por e-mail." },
  { id: 7, q: "Notificações", a: "O app envia lembretes de prazos, novas aulas e atualizações de curso. Você pode ajustar no Perfil > Preferências." },
  { id: 8, q: "Suporte", a: "Fale com a gente pelo Perfil > Ajuda e suporte ou envie e-mail para suporte@trainingmaster.app informando CPF e descrição do problema." },
];

export default function FaqScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const insets = useSafeAreaInsets();
  const drawerNav = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const hardBg     = isDark ? "#000000" : "#E9F1F0";
  const hardCard   = isDark ? "#111111" : "#FFFFFF";
  const hardText   = isDark ? "#FFFFFF" : "#0F1E25";
  const hardMuted  = isDark ? "#B3B3B3" : "#647077";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  const [openId, setOpenId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(prev => (prev === id ? null : id));
  };

  const goTab = (screen: keyof TabParamList) => {
    setMenuOpen(false);
    drawerNav.navigate("HomeTabs", { screen });
  };

  return (
    <View style={[s.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView
        contentContainerStyle={[s.body, { paddingBottom: 120 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.sectionTitle, { color: hardText }]}>Perguntas frequentes</Text>
        <Text style={{ color: hardMuted, lineHeight: 20, marginBottom: 12 }}>
          Reunimos abaixo as principais dúvidas de quem está começando no Training Master.
          Toque em uma pergunta para ver a resposta.
        </Text>

        <View style={[faq.card, { backgroundColor: hardCard, borderColor: hardBorder }]}>
          {DATA.map((item, idx) => {
            const open = openId === item.id;
            return (
              <View key={item.id}>
                <Pressable
                  onPress={() => toggle(item.id)}
                  style={faq.row}
                  android_ripple={{ color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                >
                  <Ionicons
                    name={open ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color={hardMuted}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[faq.question, { color: hardText }]} numberOfLines={2}>
                    {item.q}
                  </Text>
                </Pressable>

                {open && (
                  <View style={faq.answerBox}>
                    <Text style={{ color: hardMuted, lineHeight: 20 }}>{item.a}</Text>
                  </View>
                )}

                {idx < DATA.length - 1 && <View style={[faq.divider, { backgroundColor: hardBorder }]} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[footer.wrapper, { paddingBottom: Math.max(insets.bottom + 8, 14) }]}>
        <FooterItem icon="home"   label="Início"          onPress={() => goTab("Inicio")} />
        <FooterItem icon="person" label="Perfil"          onPress={() => goTab("Perfil")} />
        <FooterItem icon="book"   label="Meu aprendizado" onPress={() => goTab("Aprendizado")} />
        <FooterItem icon="search" label="Buscar"          onPress={() => goTab("Buscar")} />
        <FooterItem icon="menu"   label="Menu"            onPress={() => setMenuOpen(true)} />
      </View>

      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <View style={sheet.container}>
          <Pressable style={sheet.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={sheet.sheet}>
            <View style={sheet.handle} />
            <Text style={sheet.title}>Menu</Text>

            <View>
              <MenuRow icon="home-outline"        label="Home"                 onPress={() => goTab("Inicio")} />
              <MenuRow icon="person-outline"      label="Perfil"               onPress={() => goTab("Perfil")} />
              <MenuRow icon="book-outline"        label="Meu aprendizado"      onPress={() => goTab("Aprendizado")} />
              <MenuRow icon="search-outline"      label="Buscar"               onPress={() => goTab("Buscar")} />
              <MenuRow icon="help-circle-outline" label="Perguntas frequentes" onPress={() => setMenuOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MenuRow({ icon, label, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void; }) {
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

function FooterItem({ icon, label, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void; }) {
  return (
    <Pressable onPress={onPress} style={footer.item} android_ripple={{ color: "rgba(255,255,255,0.15)" }}>
      <Ionicons name={icon} size={38} color="#FFFFFF" />
      <Text style={footer.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const faq = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: { paddingHorizontal: 14, paddingVertical: 16, flexDirection: "row", alignItems: "center" },
  question: { fontSize: 15, fontWeight: "700", flex: 1 },
  answerBox: { paddingHorizontal: 14, paddingBottom: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },
});

const footer = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingTop: 8, paddingBottom: 24, paddingHorizontal: 16,
    minHeight: 360, maxHeight: "70%",
  },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.4)", marginBottom: 8 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowIcon: { color: "rgba(255,255,255,0.9)", width: 28 },
  rowLabel: { color: "#fff", fontSize: 16, marginLeft: 6 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(255,255,255,0.15)" },
});
