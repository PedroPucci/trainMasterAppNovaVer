import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../components/header/AppHeader";
import type { CourseDetail, ModuleBlock, Lesson, CourseActivity, CourseActivityWithQuestions, ActivitiesAndExams } from "../services";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { goToExamFlow, goToExerciseFlow } from "../components/utils/questionsHelpers";
import { CoursesActivityService } from "../services/courseActivities/courseActivities";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";

// MOCK rápido (pode vir do seu service depois)
const MOCK: CourseDetail = {
  id: "1",
  title: "Fundamentos da Web",
  exam: {
    id: "exam-m1",
    title: "Módulo 1 – Introdução",
    lessons: [
      { id: "ex-1", title: "Prova 1", completed: true },
      { id: "ex-2", title: "Prova 2" },
    ],
  },
  exercises: [
    {
      id: "m1",
      title: "Módulo 1 – Introdução",
      lessons: [
        { id: "a1", title: "Aula 1: O que é Web?", completed: true },
        { id: "a2", title: "Aula 2: Cliente e Servidor", progressPercentage: 30 },
      ],
    },
    {
      id: "m2",
      title: "Módulo 2 – HTML Básico",
      lessons: [
        { id: "a3", title: "Aula 3: Estrutura HTML" },
        { id: "a4", title: "Aula 4: Tags principais" },
      ],
    },
    {
      id: "m3",
      title: "Módulo 3 – Exercícios práticos",
      lessons: [{ id: "q1", title: "Quiz 1: HTML Básico" }],
    },
  ],
  completedModules: 3,
  totalModules: 5,
};

type CourseDetailRouteProp = RouteProp<AprendizadoStackParamList, "CourseDetail">;

export default function CourseDetailScreen() {
  const nav = useNavigation();
  const course = MOCK;
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const route = useRoute<CourseDetailRouteProp>();
  const course2 = route.params.course;
  const [dataQuestion, setDataQuestion] = React.useState<ActivitiesAndExams>();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // função que realmente busca
  const fetchEnrolled = React.useCallback(
    async () => {
      if (!course2?.id) return;
      setError(null);
      setLoading(true);
      try {
        const items = await CoursesActivityService.getAllFilterById(+course2.id);
        setDataQuestion(items);
      } catch (e: any) {
        if (
          e?.name !== "CanceledError" &&
          e?.message !== "canceled" &&
          e?.code !== "ERR_CANCELED"
        ) {
          setError(e?.message || "Falha ao carregar Atividades.");
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

  return (
    <View style={{ flex: 1, backgroundColor: hardBg }}>
      <AppHeader userName="Lydia" onLogout={() => { }} />

      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 110, 120) }}>
        {/* Título */}
        <Text style={[s.title, { color: hardText }]}>{course2.name}</Text>

        {/* Prova */}
        <Text style={[s.sectionTitle, { color: hardText }]}>Prova</Text>
        <View style={[s.card, { backgroundColor: hardBg }]}>
          <View style={s.rowTop}>
            <Text style={[s.cardTitle, { color: hardText }]}>{dataQuestion?.exams[0].title}</Text>

            <Pressable style={s.cta} onPress={() => goToExamFlow(nav.navigate, "Prova",dataQuestion?.activities[0].questions||[])}>
              <Text style={s.ctaText}>Entrar</Text>
            </Pressable>
          </View>


          {/* {course.exam.lessons.map((l) => (
            <Row key={l.id} lesson={l} />
          ))} */}

        </View>

        {/* Exercícios */}
        <Text style={[s.sectionTitle, { marginTop: 16, color: hardText }]}>Exercícios</Text>
        <Text style={[s.subtitle, { color: hardText }]}>
          0 de {dataQuestion?.activities.length} módulos concluídos
        </Text>

        {dataQuestion?.activities.map((m, idx) => (
          <View key={m.id} style={[s.card, { backgroundColor: hardBg }, idx > 0 && s.cardSeparated]}>
            <View style={s.rowTop}>
              <Text style={[s.cardTitle, { color: hardText }]}>{m.title}</Text>
              <Pressable style={s.cta} onPress={() => goToExerciseFlow(nav.navigate, m.questions)}>
                <Text style={s.ctaText}>Entrar</Text>
              </Pressable>
            </View>
            {/* {m.questions.map((l) => (
              <Row key={l.id} lesson={l} />
            ))} */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Row({ lesson }: { lesson: Lesson }) {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const pct =
    typeof lesson.progressPercentage === "number" && !isNaN(lesson.progressPercentage)
      ? Math.min(100, Math.max(0, lesson.progressPercentage))
      : null;

  const inProgress = pct !== null && pct > 0 && pct < 100;

  return (
    <View style={s.row}>
      <Ionicons
        name="play-circle"
        size={16}
        color={lesson.completed ? "#22c55e" : "#64748b"}
        style={{ marginRight: 6 }}
      />
      <Text style={[s.rowText, { color: hardText }]}>
        {lesson.title}
        {lesson.completed ? " (✓)" : ""}
        {inProgress ? `  (${pct}%)` : ""}
      </Text>

      {/* {inProgress && (
        <View style={s.progressWrap}>
          <View style={[s.progressBar, pct !== null && { width: `${pct}%` }]} />
        </View>
      )} */}
    </View>
  );
}

const s = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1
  },
  cardSeparated: {
    borderTopWidth: 1,
    marginTop: 12,
  },
  cardTitle: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rowText: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
  },
  progressWrap: {
    height: 6,
    width: 70,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  cta: {
    alignSelf: "flex-end",
    backgroundColor: "#22c55e",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ctaText: { color: "#fff", fontWeight: "800" },
});