import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";

export type CourseOverviewParams = {
  courseId: number;
};

type Feedback = {
  id: number;
  studentId: string;
  date: string;
  comment: string;
  rating: number;
};

type Course = {
  name: string;
  description: string;
  author: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  userId: number;
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 4 }}>
      {Array.from({ length: 5 }).map((item, i) => (
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
  );
}

function FeedbackCard({ studentId, date, comment, rating }: Feedback) {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardBorder = isDark ? "#FFFFFF 0px 0px 1px" : "#000000 0px 0px 0px";

  return (
    <View style={[local.card, {
      backgroundColor: hardBg,
    }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="person-circle" size={40} color="#4F7CAC" />
        <View style={{ marginLeft: 8 }}>
          <Text style={[local.cardUser, {color: hardText}]}>{`Estudante ${studentId}`}</Text>
          <Text style={[local.cardDate, {color: hardText}]}>{date}</Text> 
        </View>
      </View>
      <Text style={[local.cardComment, {color: hardText}]}>{comment}</Text>
      <RatingStars rating={rating} />
    </View>
  );
}

export default function CourseOverviewScreen() {
  const route =
    useRoute<RouteProp<Record<string, CourseOverviewParams>, string>>();
  var { courseId } = route.params ?? {};
  console.log("CourseOverviewScreen - route:", route);
  const navigate = useNavigation<any>();
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardBorder = isDark ? "#FFFFFF 0px 0px 1px" : "#000000 0px 0px 0px";
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  

  const handleMatricula = () => setSuccessModal(true);

  useEffect(() => {
    if (!courseId) {
      console.warn("CourseOverviewScreen: courseId não fornecido nos params");
      courseId = 1;
    }

    const fetchData = async () => {
      try {
        const [courseRes, feedbackRes] = await Promise.all([
          fetchComTimeout(`${BASE_URL}/courses/${courseId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetchComTimeout(`${BASE_URL}/course-feedback`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!courseRes.ok || !feedbackRes.ok) {
          throw new Error("Erro ao buscar dados do curso ou feedbacks");
        }

        const courseData = await courseRes.json();
        const feedbackData = await feedbackRes.json();

        setCourse(courseData);
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <View
        style={[
          s.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#50C2C9" />
        <Text style={{color: hardText}}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: hardBg, flex: 1 }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView
        contentContainerStyle={[s.body, s.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.overviewTitle, {color: hardText}]}>{course?.name ?? "Curso"}</Text>
        <Text style={[s.overviewSubtitle, {color: hardText}]}>
          Instrutor(a): {course?.author ?? "Desconhecido"}
        </Text>

        <Text style={[s.overviewDescription, {color: hardText}]}>
          {course?.description ?? "Descrição não disponível no momento."}
        </Text>

        <Text style={[s.sectionTitle, { marginTop: 8, color: hardText }]}>
          Período:
        </Text>
        <Text style={{ color: hardText, fontSize: 13 }}>
          {new Date(course?.startDate ?? "").toLocaleDateString("pt-BR")} até{" "}
          {new Date(course?.endDate ?? "").toLocaleDateString("pt-BR")}
        </Text>

        <TouchableOpacity
          style={[s.overviewButton, { backgroundColor: "#50C2C9" }]}
          onPress={handleMatricula}
        >
          <Text style={s.overviewButtonText}>Matricular-se</Text>
        </TouchableOpacity>

        <Text style={[s.sectionTitle, { color: hardText }]}>Feedbacks:</Text>
        {feedbacks.length > 0 ? (
          feedbacks.map((fb) => <FeedbackCard key={fb.date} {...fb} />)
        ) : (
          <Text style={{ color: hardText, marginTop: 8 }}>
            Nenhum feedback disponível ainda.
          </Text>
        )}
      </ScrollView>

      {/* Modal de sucesso */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={local.modalContainer}>
          <View style={local.modalBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color="#51C391"
            />
            <Text style={local.modalTitle}>Matrícula realizada!</Text>
            <Pressable
              style={[
                local.primaryButton,
                { backgroundColor: "#50C2C9", marginTop: 16 },
              ]}
              onPress={() => {
                setSuccessModal(false);
                navigate.navigate("AprendizadoHome");
              }}
            >
              <Text style={local.primaryButtonText}>Ir para meus cursos</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const local = StyleSheet.create({
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1
  },
  cardUser: { fontWeight: "bold", fontSize: 14 },
  cardDate: { fontSize: 12, color: "#777" },
  cardComment: { marginTop: 6, fontSize: 13, color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: { marginTop: 12, fontSize: 18, fontWeight: "600", color: "#333" },
});
