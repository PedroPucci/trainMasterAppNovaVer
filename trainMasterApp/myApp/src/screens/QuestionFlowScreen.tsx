import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import QuestionRunner, { Question } from "../components/QuestionRunner/QuestionRunner";
import { ReviewParams } from "./ReviewAnswersScreen";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

/** ===========================
 * Params aceitos pela tela
 * =========================== */
export type QuestionFlowParams = {
  mode: "exam" | "exercise";     // define comportamento (single x multiple)
  title?: string;                // título da tela
  questions: Question[];        // opcional: pode passar dataset pronto por navegação
  startIndex?: number;           // índice inicial (default 0)
};



/** Resolve dataset final: por 'source' ou por 'questions' */
function resolveQuestions(override: Question[]) {
  return override;
}
type Nav = NativeStackNavigationProp<AprendizadoStackParamList, "QuestionFlow">;
export default function QuestionFlowScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<Record<string, QuestionFlowParams>, string>>();
  const {
    mode = "exam",
    title,
    questions: override,
    startIndex = 0,
  } = route.params ?? {};

  const QUESTIONS = React.useMemo(() => resolveQuestions(override), [override]);
  const [index, setIndex] = React.useState(Math.max(0, Math.min(startIndex, QUESTIONS.length - 1)));
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const selected = answers[question.id] ?? [];

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const setSelectedForCurrent = (ids: string[]) => {
    setAnswers(prev => ({ ...prev, [question.id]: ids }));
  };

  const onPrev = () => setIndex(i => Math.max(0, i - 1));
  const onNext = () => {
    if (isLast) {
      nav.navigate("ReviewAnswers", {
        mode,
        title: title ?? (mode === "exam" ? "Prova" : "Questões"),
        questions: QUESTIONS,
        answers,
      } satisfies ReviewParams);
      return;
    }
    setIndex(i => Math.min(total - 1, i + 1));
  };

  const nextDisabled = selected.length === 0;

  return (
    <QuestionRunner
      mode={mode}
      title={title ?? (mode === "exam" ? "Prova" : "Questões")}
      progress={{ current: index + 1, total }}
      question={question}
      selected={selected}
      onChangeSelected={setSelectedForCurrent}
      onPrev={onPrev}
      onNext={onNext}
      prevDisabled={isFirst}
      nextDisabled={nextDisabled}
      nextLabel={isLast ? "Verificar" : "Próximo"}
      hidePrev={false} // mude para isFirst se quiser esconder o Anterior na primeira
    />
  );
}
