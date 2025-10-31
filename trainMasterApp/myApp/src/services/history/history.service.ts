import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { ExamHistoryItem } from "../types";


export const HistoryService = {
        async getAllByUserId(): Promise<ExamHistoryItem[]> {
          try {
            // Quando o endpoint real existir, basta trocar aqui
            const { data } = await routes.history.getAllByUserId();
            return data;
          } catch (e) {
            throw toApiError(e);
          }
        },
};
