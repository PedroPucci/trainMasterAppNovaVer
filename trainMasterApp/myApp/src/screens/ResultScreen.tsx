// screens/ResultScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../components/header/AppHeader";

import { useAppTheme } from "../components/theme/ThemeProvider";
import ProgressRing from "../components/ProgressRing/ProgressRing";

// ===== Navegação / Params =====
export type ResultParams = {
    mode: "exam" | "exercise";     // define textos base
    percent: number;               // 0..100
    correct: number;               // acertos
    total: number;                 // total
    elapsedSec?: number;           // opcional: tempo em segundos
    passThreshold?: number;        // default 70
};

type R = RouteProp<Record<string, ResultParams>, string>;

// ===== Helpers =====
function fmtTime(sec?: number) {
    if (!sec && sec !== 0) return "--:--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ResultScreen() {
    const { theme } = useAppTheme();
    const hardBg = theme.name === "dark" ? "#000" : "#FFF";
    const hardText = theme.name === "dark" ? "#FFF" : "#000";

    const insets = useSafeAreaInsets();
    const route = useRoute<R>();
    const {
        mode,
        percent,
        correct,
        total,
        elapsedSec,
        passThreshold = 70,
    } = route.params ?? {
        mode: "exam",
        percent: 0,
        correct: 0,
        total: 0,
    };

    const passed = percent >= passThreshold;

    const headerTitle = mode === "exam" ? "Resultado" : "Questões";
    const topMessage =
        mode === "exam"
            ? passed
                ? "Parabéns!"
                : "Não Atingiu A Nota Mínima"
            : passed
                ? "Parabéns"
                : "Continue praticando";

    const bigMessage =
        mode === "exam"
            ? passed
                ? "Você Foi Aprovado!"
                : "Não Atingiu A Pontuação Mínima"
            : passed
                ? ""
                : "";

    const ringColor = passed ? "#8AD14A" : "#F29E2E"; // verde x laranja
    const percentTxt = `${Math.round(percent)}%`;

    return (
        <View style={{ flex: 1, backgroundColor: hardBg }}>
            <AppHeader userName="Lydia" onLogout={() => { }} />

            <View style={[st.wrap, { paddingBottom: Math.max(insets.bottom + 24, 24) }]}>
                <Text style={[st.title, { color: hardText }]}>{headerTitle}</Text>
                <Text style={[st.h2, { color: hardText, marginTop: 62 , marginBottom:12}]}>{topMessage}</Text>

                <View style={{ marginVertical: 12 }}>
                    <ProgressRing
                        size={165}
                        stroke={18}
                        percent={percent}
                        color={ringColor}
                        text={percentTxt}
                        textColor={hardText}
                    />
                </View>

                {!!bigMessage && (
                    <Text style={[st.h1, { color: hardText, marginTop: 8, textAlign: "center" }]}>
                        {bigMessage}
                    </Text>
                )}

                <View style={st.stats}>
                    <View style={st.stat}>
                        <Text style={[st.statValue, { color: hardText }]}>{`${correct}/${total}`}</Text>
                        <Text style={[st.statLabel, { color: hardText }]}>Resultado</Text>
                    </View>
                    <View style={st.stat}>
                        <Text style={[st.statValue, { color: hardText }]}>{fmtTime(elapsedSec)}</Text>
                        <Text style={[st.statLabel, { color: hardText }]}>Tempo</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const st = StyleSheet.create({
    title: { textAlign: "center", fontSize: 18, fontWeight: "700", marginTop: 8, marginBottom: 8 },
    wrap: { flex: 1, alignItems: "center" },
    h1: { fontSize: 20, fontWeight: "700" },
    h2: { fontSize: 18, fontWeight: "700" },
    stats: {
        width: "100%",
        marginTop: 24,
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stat: { alignItems: "center", flex: 1 },
    statValue: { fontSize: 18, fontWeight: "500" },
    statLabel: { marginTop: 4, color: "#6B7280" },
});
