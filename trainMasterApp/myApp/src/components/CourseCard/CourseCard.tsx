import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";
import { Course } from "../../services";
import { useNavigation } from "@react-navigation/native";


type Props = { item: Course, showbutton: boolean, progress: number };

export default function CourseCard({ item, showbutton, progress }: Props) {
  const dateBR = new Date(item.startDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const formatCourseProgress = (progress?: number | null): string | null => {
    // Se o valor for null, undefined ou não for número
    if (progress === null || progress === undefined || isNaN(progress)) {
      return null;
    }

    // Garante que o valor fique entre 0 e 100
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    if (safeProgress === 0) {
      return "Iniciar Curso";
    }

    if (safeProgress === 100) {
      return "Concluído";
    }

    return `${safeProgress}%`;
  }

  const { theme } = useAppTheme();
  console.log("CourseCard - item:", item);
  const navigation = useNavigation<any>();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "white 1px" : "#000000";
  const progressTxt = formatCourseProgress(showbutton ? progress : null);

  function handlePress() {
    if (!showbutton) navigation.navigate("Aprendizado", { screen: "CourseOverview", params: { courseId: item.id } });
    else navigation.navigate("CourseContent", { course: item })
  }

  function handlePressDetail(mode: string) {
    if (mode == "left") navigation.navigate("CourseContent", { course: item })
    else navigation.navigate("CourseDetail", { course: item })
  }


  return (
    <Pressable style={[s.card, { backgroundColor: hardBg }]} onPress={handlePress}>
      <Text style={[s.title, { color: hardText }]}>{item.name}</Text>
      <Text style={s.date}>{dateBR}</Text>

      <View style={s.row}>
        <View style={s.thumbWrapper}>
          <Image
            source={{ uri: item.thumbnailUrl || "https://placehold.co/280x160" }}
            style={s.thumb}
            resizeMode="cover"
          />
          {item.duration ? (
            <View style={s.durationPill}>
              <Text style={s.durationText}>{item.duration}</Text>
            </View>
          ) : null}
        </View>

        <View style={s.info}>
          <Text style={[s.author, { color: hardText }]}>{item.author}</Text>
          <Text numberOfLines={3} style={[s.desc, { color: hardText }]}>
            {item.description}
          </Text>
        </View>
      </View>
      {showbutton ? (<>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Pressable
            onPress={()=>handlePressDetail("left")}
            style={{ flex: 1, paddingVertical: 10 }}
          >
            <Text style={[s.progress, { color: hardText, textAlign: 'left' }]}>{progressTxt}</Text>
          </Pressable>

          <Pressable
             onPress={()=>handlePressDetail("right")}
            style={{ flex: 1, paddingVertical: 10 }}
          >
            <Text style={[s.progress, { color: hardText, textAlign: 'right' }]}>Ver atividades</Text>
          </Pressable>
        </View>
      </>
      ) : null
      }
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937"
  },
  date: {
    marginTop: 2,
    fontSize: 12,
    color: "#9ca3af"
  },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  thumbWrapper: { width: 140, height: 80, borderRadius: 8, overflow: "hidden" },
  thumb: { width: "100%", height: "100%" },
  durationPill: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  durationText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  info: { flex: 1, justifyContent: "center" },
  author: { fontSize: 12, color: "#000000", marginBottom: 4, fontWeight: "400" },
  progress: { fontSize: 14, color: "#000000", marginBottom: 0, marginTop: 8, fontWeight: "400" },
  desc: { fontSize: 13, color: "#000000", fontWeight: "600" }
});
