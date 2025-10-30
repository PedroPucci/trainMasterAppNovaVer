import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useAppTheme } from "../components/theme/ThemeProvider";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro"
  ],
  monthNamesShort: [
    "jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"
  ],
  dayNames: [
    "domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"
  ],
  dayNamesShort: ["dom","seg","ter","qua","qui","sex","sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const reminders = [
  { title: "Progresso: 65% das atividades feitas", subtitle: "Curso: Fundamentos de React" },
  { title: "Progresso: 65% do curso", subtitle: "Curso: Fundamentos de React" },
];

type BadgeItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
};

const badges: BadgeItem[] = [
  { icon: "ribbon",                title: "Concluiu 10 cursos",        color: "#D9A520" },
  { icon: "flame",                 title: "Sequência de 14 dias",      color: "#FF6B3D" },
  { icon: "trophy",                title: "Top 3% da turma",           color: "#FFB020" },
  { icon: "checkmark-done-circle", title: "120 atividades feitas",     color: "#34C759" },
  { icon: "school",                title: "3 certificações",           color: "#4F7CAC" },
];

function BadgeCell({ icon, title, color }: BadgeItem) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={s.badgeCell}>
      <View
        onTouchStart={() => setVisible(true)}
        onTouchEnd={() => setVisible(false)}
        style={s.badgePressable}
      >
        <View style={s.badgeMedal}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
      </View>

      {visible && (
        <View style={s.tooltip} pointerEvents="none">
          <Text style={s.tooltipText}>{title}</Text>
          <View style={s.tooltipCaret} />
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [selected, setSelected] = React.useState<string>(today);
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";
  const primary = theme.colors.primary;

  return (
    <View style={[s.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView
        contentContainerStyle={[s.body, s.scrollContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[s.sectionTitle, { color: hardText }]}>Lembretes</Text>
        {reminders.map((r, i) => (
          <View
            key={i}
            style={[
              s.card,
              { backgroundColor: hardBg, borderColor: hardBorder },
            ]}
          >
            <Text style={[s.cardTitle, { color: hardText }]}>{r.title}</Text>
            <Text style={[s.cardSubtitle, { color: hardMuted }]}>{r.subtitle}</Text>
          </View>
        ))}

        <Text style={[s.sectionTitle, { marginTop: 8, color: hardText }]}>
          Conquistas
        </Text>
        <View style={s.badgesGrid}>
          {badges.map((b, i) => (
            <BadgeCell key={`${b.title}-${i}`} {...b} />
          ))}
        </View>

        <Text style={[s.sectionTitle, { marginTop: 8, color: hardText }]}>
          Atenção às datas
        </Text>
        <View
          style={[
            s.calendarCard,
            {
              backgroundColor: isDark ? "#000000" : "#FFFFFF",
              borderColor: isDark ? "#222222" : "#E5E5E5",
            },
          ]}
        >
          <Calendar
            key={isDark ? "cal-dark" : "cal-light"}
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: primary,
                selectedTextColor: "#ffffff",
              },
            }}
            theme={
              isDark
                ? {
                    calendarBackground: "#000000",
                    monthTextColor: "#FFFFFF",
                    textSectionTitleColor: "#A3A3A3",
                    dayTextColor: "#FFFFFF",
                    textDisabledColor: "#A3A3A3",
                    arrowColor: primary,
                    indicatorColor: primary,
                    todayTextColor: primary,
                    todayBackgroundColor: "rgba(96,165,250,0.12)",
                    textMonthFontWeight: "800",
                    textDayFontWeight: "600",
                    textDayHeaderFontWeight: "700",
                    dotColor: primary,
                    selectedDotColor: "#ffffff",
                  }
                : {
                    calendarBackground: "#FFFFFF",
                    monthTextColor: "#000000",
                    textSectionTitleColor: "#666666",
                    dayTextColor: "#000000",
                    textDisabledColor: "#666666",
                    arrowColor: primary,
                    indicatorColor: primary,
                    todayTextColor: primary,
                    textMonthFontWeight: "800",
                    textDayFontWeight: "600",
                    textDayHeaderFontWeight: "700",
                    dotColor: primary,
                    selectedDotColor: "#ffffff",
                  }
            }
            style={[s.calendar, { backgroundColor: isDark ? "#000000" : "#FFFFFF" }]}
          />
        </View>

        <View style={s.legendRow}>
          <View style={s.legendItem}>
            <View style={[s.colorDot, { backgroundColor: "red" }]} />
            <Text style={[s.legendText, { color: hardText }]}>
              Prazo final para avaliação
            </Text>
            <View style={[s.colorDot, { backgroundColor: "gold" }]} />
            <Text style={[s.legendText, { color: hardText }]}>
              Prazo final para atividades
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}