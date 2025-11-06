import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { faq } from "../types";



export const FaqService = {
        async getAll(): Promise<faq[]> {
          try {
            // Quando o endpoint real existir, basta trocar aqui
            const { data } = await routes.faq.getAll();
            return data;
          } catch (e) {
            throw toApiError(e);
          }
        },
};