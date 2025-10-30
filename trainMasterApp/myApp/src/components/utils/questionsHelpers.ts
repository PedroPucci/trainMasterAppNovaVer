// Tipos dos parâmetros aceitos pela tela QuestionFlow
export type QuestionFlowParams = {
  mode: "exercise" | "exam";
  title: string;
  questions: any[];    // troque para seu tipo Question[] se preferir
  startIndex?: number;  // opcional
};

// Assinatura mínima da função navigate (vinda do useNavigation)
export type NavigateFn = (name: string, params?: any) => void;

/** Genérico: leva para a QuestionFlow com os params dados */
export function goToQuestionFlow(navigate: NavigateFn, params: QuestionFlowParams) {
  // log opcional de debug:
  // console.log("[NAV] QuestionFlow →", params);
  navigate("QuestionFlow", params);
}

/** Caso 1: Exercícios (multiple choice) usando um mock interno via 'source' */
export function goToExerciseFlow(navigate: NavigateFn, questions: any[]) {
  goToQuestionFlow(navigate, {
    mode: "exercise",
    questions,
    title: `Questões`,
  });
}

/** Caso 2: Prova (single choice) com dataset já carregado */
export function goToExamFlow(
  navigate: NavigateFn,
  title: string,
  questions: any[] // troque para seu tipo Question[] se quiser
) {
  goToQuestionFlow(navigate, {
    mode: "exam",
    title,
    questions,
  });
}
