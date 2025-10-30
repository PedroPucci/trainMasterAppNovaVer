import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Pressable, // 👈 adicionado
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 adicionado
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import { useAppTheme } from "../components/theme/ThemeProvider";
import CourseCard from "../components/CourseCard/CourseCard";
import { Course, coursesService } from "../services";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";

export default function EnrolledCoursesScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";

  const [data, setData] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);



  type Nav = NativeStackNavigationProp<AprendizadoStackParamList, "AprendizadoHome">;
  const nav = useNavigation<Nav>();


  // função que realmente busca
  const fetchEnrolled = React.useCallback(
    async () => {
      setError(null);
      setLoading(true);
      try {
        const items = await coursesService.getEnrolled();
        setData(items);
      } catch (e: any) {
        if (
          e?.name !== "CanceledError" &&
          e?.message !== "canceled" &&
          e?.code !== "ERR_CANCELED"
        ) {
          setError(e?.message || "Falha ao carregar cursos.");
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  React.useEffect(() => {
    const controller = new AbortController();
    fetchEnrolled();
    return () => controller.abort();
  }, [fetchEnrolled]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchEnrolled();
    } finally {
      setRefreshing(false);
    }
  }, [fetchEnrolled]);

  // ✅ navegação para detalhes ao tocar no card
  const renderItem = React.useCallback(

    
    ({ item }: { item: Course }) => (
      <Pressable onPress={() => nav.navigate("CourseDetail", { course: item})}>
       <CourseCard item={item} showbutton={true} progress={0} />
      </Pressable>
    ),
    [nav]
  );

  const keyExtractor = React.useCallback((item: Course) => item.id, []);

  const EmptyState = React.useMemo(
    () => (
      <View style={ss.empty}>
        <Text style={[ss.emptyText, { color: hardText }]}>Não existem cursos para o usuário</Text>
      </View>
    ),
    [hardText]
  );

  return (
    <View style={[ss.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <Text style={[s.sectionTitle, { color: hardText, marginTop: 12 }]}>
        Meus Cursos
      </Text>

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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const BG = "#626464ff";

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
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
