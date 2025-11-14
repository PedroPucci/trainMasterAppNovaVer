import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../components/header/AppHeader";
import type { CourseDetail, ModuleBlock, Lesson, CourseActivity, CourseActivityWithQuestions, ActivitiesAndExams } from "../services";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { goToExamFlow, goToExerciseFlow } from "../components/utils/questionsHelpers";
import { CoursesActivityService } from "../services/courseActivities/courseActivities";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";


type CourseDetailRouteProp = RouteProp<AprendizadoStackParamList, "CourseContent">;
const TABS = ["Visão Geral", "Recursos", "Anotações", "Discussões"];

export default function CourseContentScreen() {
    const nav = useNavigation();
    const course = [];
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
    const [activeTab, setActiveTab] = React.useState<string>("");

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

                {/* PLAYER (placeholder) */}
                <View style={styles.videoContainer}>
                    <View style={styles.playButtonOuter}>
                        
                            <Text style={styles.playIcon}>▶</Text>
                        
                    </View>
                </View>

                
      {/* TABS */}
      <View style={[styles.tabRow, { backgroundColor: hardBg }]}>
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

                {/* Exercícios */}
                <Text style={[s.sectionTitle, { marginTop: 16, color: hardText }]}></Text>
                <Text style={[s.subtitle, { color: hardText }]}>
                    0 de {dataQuestion?.activities.length} módulos concluídos
                </Text>

                {dataQuestion?.activities.map((m, idx) => (
                    <View key={m.id} style={[s.card, { backgroundColor: hardBg }, idx > 0 && s.cardSeparated]}>
                        <View style={s.rowTop}>
                            <Text style={[s.cardTitle, { color: hardText }]}>{m.title}</Text>
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

const PRIMARY = "#41C3C8";
const PRIMARY_LIGHT = "#E7F9FA";
const GRAY_TAB = "#A9A9AA";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  // TÍTULO
  courseTitleContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  courseTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  // PLAYER
  videoContainer: {
    backgroundColor: "#000",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#444",
    fontSize: 32,
    marginLeft: 4,
  },

  // TABS
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  tabItem: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: GRAY_TAB,
  },
  tabItemActive: {
    backgroundColor: PRIMARY,
  },
  tabText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  tabTextActive: {
    fontWeight: "700",
  },

  // LISTA DE MÓDULOS
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  progressText: {
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 10,
  },
  moduleCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_LIGHT,
  },
  moduleTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
  },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  lessonBullet: {
    width: 18,
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },
  lessonText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },
});