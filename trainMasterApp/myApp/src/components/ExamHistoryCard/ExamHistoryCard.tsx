import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ExamHistoryItem } from "../../services";
import { secondsToReadableTime } from "../utils/formater";

// Rótulos esperados no app
export type ExamStatusText = "Aprovado" | "Reprovado" | "Aguardando";

// Mapa: número -> texto
const STATUS_LABEL: Record<number, ExamStatusText> = {
  1: "Aguardando",
  2: "Reprovado",
  3: "Aprovado",
};

// Estilo por status (texto)
const STATUS_STYLE: Record<ExamStatusText, { bg: string; text: string; chip: string }> = {
  Aprovado:   { bg: "#E8F7EE", text: "#0F172A", chip: "#16A34A" },
  Reprovado:  { bg: "#FDEBEC", text: "#0F172A", chip: "#EF4444" },
  Aguardando: { bg: "#FAF9E8", text: "#0F172A", chip: "#059669" },
};

type Props = { item: ExamHistoryItem };

export default function ExamHistoryCard({ item }: Props) {

  // 1) Converte o status numérico (1/2/3) para rótulo amigável
  const statusText: ExamStatusText = STATUS_LABEL[item.status] ?? "Aguardando";
  const s = STATUS_STYLE[statusText];

  // 2) Tempo em minutos (arredondado)
  const minutes = item.durationSeconds;

  // 3) Tenta inferir total de questões a partir do payload, se existir
  //const total = item.exam?.examQuestions?.length ?? 0;
  const total = item.score;
  // 4) Se o backend usa "score" de 0 a 10, estimamos “corretas” proporcionalmente (fallback).
  //    Se não houver como inferir, mostramos "—/—".
  let correctDisplay = "—/—";
  if (total > 0 && typeof item.score === "number") {
    const correct = Math.round((item.score / 10) * total);
    // Para “Reprovado” a UI deseja exibir “incorretas”; para “Aprovado”, “corretas”.
    const value = statusText === "Reprovado" ? total - correct : correct;
    correctDisplay = `${total}`;
  }


  return (
    <View style={[styles.card, { backgroundColor: s.bg }]}>
      {/* Linha: Status */}
      <View style={styles.rowTop}>
        <Text style={[styles.label, { color: s.text }]}>Status</Text>
        <Text style={[styles.status, { color: s.chip }]}>{statusText}</Text>
      </View>

      {/* Linha: Número de questões (corretas/incorretas) */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: s.text }]}>
         Nota 
        </Text>
        <Text style={[styles.value, { color: s.text }]}>{correctDisplay}</Text>
      </View>

      {/* Linha: Tempo */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: s.text }]}>Tempo</Text>
        <Text style={[styles.value, { color: s.text }]}>{secondsToReadableTime(minutes)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderWidth: 0,
    paddingBottom: 8,
  },
  status: { fontWeight: "800" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  label: { fontWeight: "600" },
  value: { fontWeight: "800" },
});
