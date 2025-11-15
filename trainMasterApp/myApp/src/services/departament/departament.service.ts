import { AxiosError } from "axios";
import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { DepartmentProps } from "../types";


export const DepartamentService = {
        async getByUserId(): Promise<DepartmentProps[]> {
          try {
            // Quando o endpoint real existir, basta trocar aqui
            const { data } = await routes.department.getByUserId();
            return data;
          } catch (e : any | AxiosError ) {
            throw toApiError(e);
          }
        },
};
