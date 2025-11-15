import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  LayoutAnimation, Platform, UIManager, Modal, TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { faq } from "../services";
import { FaqService } from "../services/faq/faq";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";

  const hardBg = isDark ? "#000000" : "#E9F1F0";
  const hardCard = isDark ? "#111111" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#0F1E25";
  const hardMuted = isDark ? "#B3B3B3" : "#647077";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<faq[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itens = await FaqService.getAll();
        setFaqs(itens);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  const toggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(prev => (prev === id ? null : id));
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

        <View style={[style.card, { backgroundColor: hardCard, borderColor: hardBorder }]}>
          {loading ? (
            <View style={style.loader}>
              <ActivityIndicator size="large" />
            </View>
          ) : (<>
            {faqs.map((item, idx) => {
              const open = openId === +item.id;
              return (
                <View key={item.id}>
                  <Pressable
                    onPress={() => toggle(+item.id)}
                    style={style.row}
                    android_ripple={{ color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                  >
                    <Ionicons
                      name={open ? "chevron-down" : "chevron-forward"}
                      size={18}
                      color={hardMuted}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[style.question, { color: hardText }]} numberOfLines={2}>
                      {item.question}
                    </Text>
                  </Pressable>

                  {open && (
                    <View style={style.answerBox}>
                      <Text style={{ color: hardMuted, lineHeight: 20 }}>{item.answer}</Text>
                    </View>
                  )}

                  {idx < faqs.length - 1 && <View style={[style.divider, { backgroundColor: hardBorder }]} />}

                </View>
              );
            })}
          </>)}
        </View>
      </ScrollView>

  
    </View>
  );
}

const style = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: { paddingHorizontal: 14, paddingVertical: 16, flexDirection: "row", alignItems: "center" },
  question: { fontSize: 15, fontWeight: "700", flex: 1 },
  answerBox: { paddingHorizontal: 14, paddingBottom: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },
});
