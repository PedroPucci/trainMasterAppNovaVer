import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import AppHeader from "../components/header/AppHeader";
import ExamHistoryCard from "../components/ExamHistoryCard/ExamHistoryCard";
import { HistoryService } from "../services/history/history.service";
import { ExamHistoryItem } from "../services";
import { useAppTheme } from "../components/theme/ThemeProvider";


export default function ExamHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [historyItens, setItens] = useState<ExamHistoryItem[]>([])
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itens = await HistoryService.getAllByUserId();
        setItens(itens);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const EmptyState = React.useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: hardText }]}>Não existem cursos para o usuário</Text>
      </View>
    ),
    [hardText]
  );

  return (
    <View style={{ flex: 1, backgroundColor: hardBg }}>
      <AppHeader userName="Lydia" onLogout={() => { }} />

      <Text style={[styles.title, {color: hardText}]}>Histórico de provas</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (<>
        <Text style={[styles.course, {color: hardText}]}>Curso: {historyItens[0].exam.title}</Text>
        <FlatList
          data={historyItens}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => <ExamHistoryCard item={item} />}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
        />
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
    color: "#0F172A",
    textAlign: "center",
  },
  course: {
    marginLeft: 16,
    marginBottom: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  emptyText: { color: "#000000", fontSize: 14 },
});