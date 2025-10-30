import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../components/theme/ThemeProvider";
import CourseCard from "../components/CourseCard/CourseCard";
import TrendingChips, {
  ChipItem,
} from "../components/TrendingChips/TrendingChips";
import { Course,coursesService } from "../services";


export default function SearchScreen() {
  const [selectedChip, setSelectedChip] = React.useState<string | null>(null);
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardBorder = isDark ? "#FFFFFF 0px 0px 1px" : "#000000 0px 0px 0px";


  const [q, setQ] = React.useState("");
  const [data, setData] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const TOP_SEARCHES: ChipItem[] = [
    { id: "java", label: "Java" },
    { id: "pm", label: "Gerência de projeto" },
    { id: "csharp", label: "C#" },
    { id: "uiux", label: "UI/UX" },
  ];

  const load = React.useCallback(async (query?: string) => {
    setError(null);
    setLoading(true);

    // AbortController (evita race em buscas rápidas)
    const controller = new AbortController();
    try {
      const items = query?.trim()
        ? await coursesService.getBySearch(query)
        : await coursesService.getAll();
console.log("SearchScreen - load - items:", items);
      setData(items);
    } catch (e: any) {
      if (e?.name !== "CanceledError" && e?.message !== "canceled") {
        setError(e?.message || "Falha ao carregar cursos.");
        setData([]); // ou mantenha o último resultado
      }
    } finally {
      setLoading(false);
    }

    // return para permitir cancelamento externo (debounce effect)
    return () => controller.abort();
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);
  // debounce simples de 350ms para busca
  React.useEffect(() => {
    const t = setTimeout(() => load(q), 350);
    return () => clearTimeout(t);
  }, [q, load]);

const renderItem = React.useCallback(
  ({ item }: { item: Course }) => (
    <CourseCard item={{ ...item }} showbutton={false} progress={0} />
  ),
  []
);

  const keyExtractor = React.useCallback((item: Course) => item.id, []);

  const EmptyState = React.useMemo(
    () => (
      <View style={ss.empty}>
        <Text style={[ss.emptyText, { color: hardText }]}>Não existem cursos cadastrados</Text>
      </View>
    ),
    [hardText]
  );

  return (
    <View style={[ss.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <View style={ss.content}>
        <View
          style={[
            ss.searchBox,
            { backgroundColor: hardBg, boxShadow: hardBorder },
          ]}
        >
          <Text style={[ss.searchIcon, { color: hardBg }]}>
            <Ionicons name="search" size={24} color="#6b7280" />
          </Text>
          <TextInput
            placeholder="Pesquisar cursos"
            placeholderTextColor={hardText}
            value={q}
            onChangeText={(text) => {
              setQ(text);
              setSelectedChip(null); // digitou manual, limpa chip ativo
            }}
            style={[ss.searchInput, { color: hardText }]}
            returnKeyType="search"
          />
        </View>

        <TrendingChips
          items={TOP_SEARCHES}
          selectedId={selectedChip}
          onPress={(item) => {
            setSelectedChip(item.id);
            setQ(item.label); // preencher input e acionar debounce existente
          }}
        />

        {loading ? (
          <View style={ss.loader}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={ss.empty}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={EmptyState}
            contentContainerStyle={
              data.length === 0
                ? { flexGrow: 1, marginTop: 12 }
                : { flexGrow: 1, marginTop: 24, marginBottom: 100 }
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  await load(q);
                  setRefreshing(false);
                }}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const BG = "#626464ff";

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { flex: 1, marginTop: 24 },
  searchBox: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  emptyText: { color: "#000000", fontSize: 14 },
  errorText: { color: "#ef4444", fontSize: 14 },
});
