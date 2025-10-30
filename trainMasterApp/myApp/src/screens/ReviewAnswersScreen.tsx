import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Modal } from "react-native";
import AppHeader from "../components/header/AppHeader";
import { useAppTheme } from "../components/theme/ThemeProvider";
import type { Question } from "../components/QuestionRunner/QuestionRunner";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";
import { useNavigation } from "@react-navigation/native";
import { ResultParams } from "./ResultScreen";


export type ReviewParams = {
    mode: string;
    title?: string;
    percent:number;
    correct:number;
    total:number;
    elapsedSec:number;
    passThreshold:number;
    questions: Question[];
    answers: Record<string, string[]>; // questionId -> opções escolhidas
};

type Nav = NativeStackNavigationProp<AprendizadoStackParamList, "Result">;

export default function ReviewAnswersScreen({ route, navigation }: any) {
    const nav = useNavigation<Nav>();
    const { mode, title, questions, answers } = route.params as ReviewParams;
    const { theme } = useAppTheme();
    const isDark = theme.name === "dark";
    const hardBg = isDark ? "#0B0B0B" : "#EFF4F3";
    const cardBg = isDark ? "#111" : "#FFFFFF";
    const text = isDark ? "#fff" : "#111827";
    const [successModal, setSuccessModal] = React.useState(false);

    const total = questions.length;
    // 👉 método que fecha o modal e navega

    // 👉 método que fecha o modal e navega
    const handleConfirm = () => {
        setSuccessModal(false);

        // simulação de dados; substitua pelos valores reais
        const mockResult: ResultParams= {
            mode: "exam",
            percent: 85,
            correct: 45,
            total: 50,
            elapsedSec: 1160,
            passThreshold: 70,
        };

        // navega para a tela de resultado
        nav.navigate("Result", mockResult);
    };

    const renderRow = ({ item, index }: { item: Question; index: number }) => {
        const selected = answers[item.id] ?? [];
        const label = selected.length
            ? selected.map((id) => item.options.find((o) => o.id === id)?.text).filter(Boolean).join(", ")
            : "Sem resposta";

        return (
            <Pressable
                style={[st.answerItem, { backgroundColor: cardBg }]}
                onPress={() => {
                    // opção: voltar para a questão selecionada para editar
                    navigation.goBack();              // volta para QuestionFlow
                }}
            >
                <Text style={[st.answerText, { color: text }]}>
                    {`Resposta ${index + 1}`}
                </Text>
                <Text style={[st.answerSub, { color: text }]} numberOfLines={2}>
                    {label || "Sem resposta"}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={[st.container, { backgroundColor: hardBg }]}>
            <AppHeader userName="Lydia" onLogout={() => { }} />

            <FlatList
                data={questions}
                keyExtractor={(q) => q.id}
                renderItem={renderRow}
                ListHeaderComponent={
                    <>
                        <Text style={[st.title, { color: text }]}>{title ?? (mode === "exam" ? "Prova" : "Questões")}</Text>

                        <View style={st.progressWrap}>
                            <Text style={[st.progressLabel, { color: text }]}>Progresso</Text>
                            <View style={st.progressBar}>
                                <View style={[st.progressFill, { width: "100%" }]} />
                            </View>
                            <Text style={[st.progressRight, { color: text }]}>{total}/{total}</Text>
                        </View>

                        <Text style={[st.section, { color: text }]}>Verifique suas respostas</Text>
                    </>
                }
                ListFooterComponent={
                    <Pressable
                        style={st.finalBtn}
                        onPress={() => {
                            setSuccessModal(true);
                        }}
                    >
                        <Text style={st.finalBtnText}>
                            {mode === "exam" ? "Finalizar – Prova" : "Finalizar – Exercícios"}
                        </Text>
                    </Pressable>
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={successModal}
                transparent
                animationType="fade"
                onRequestClose={() => setSuccessModal(false)}
            >
                <View style={st.modalContainer}>
                    <View style={st.modalBox}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={64}
                            color="#51C391"
                        />
                        <Text style={st.modalTitle}>Tem certeza que deseja finalizar?</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                            <Pressable
                                style={[
                                    st.secondaryButton,
                                    { backgroundColor: "gray", flex: 1, marginRight: 8 },
                                ]}
                                onPress={() => setSuccessModal(false)}
                            >
                                <Text style={st.secondaryButtonText}>Não</Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    st.primaryButton,
                                    { backgroundColor: "#50C2C9", flex: 1, marginLeft: 8 },
                                ]}
                                onPress={handleConfirm }
                            >
                                <Text style={st.primaryButtonText}>Sim</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const st = StyleSheet.create({
    container: { flex: 1 },
    title: { textAlign: "center", fontSize: 18, fontWeight: "800", marginTop: 8, marginBottom: 8 },
    progressWrap: { marginTop: 4, marginBottom: 12 },
    progressLabel: { fontWeight: "700", marginBottom: 6 },
    progressBar: { height: 8, borderRadius: 999, backgroundColor: "#f6e7a9", overflow: "hidden" },
    progressFill: { height: "100%", backgroundColor: "#f0c44c" },
    progressRight: { textAlign: "right", fontWeight: "700", marginTop: 4 },
    section: { fontSize: 18, fontWeight: "800", marginTop: 8, marginBottom: 12 },
    answerItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
    },
    answerText: { fontWeight: "800", marginBottom: 4 },
    answerSub: { fontWeight: "600" },
    finalBtn: {
        marginTop: 8,
        marginBottom: 80,
        backgroundColor: "#e9efff",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    finalBtnText: { color: "#2b2f6b", fontWeight: "800", textDecorationLine: "underline" },
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
    primaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
    },
    primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    secondaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    secondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
    },
});
