import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { Course } from "../types";      // Tipo (interface) usada para tipar os objetos de cursos
import {
  COURSES_MOCK,
  mockFilterBySearch,
  mockGetEnrolledCourses
} from "./courses.mock";               // Funções e dados mockados (modo offline / dev)

/**
 * =======================================
 * ⚙️ Alternância entre MOCKS e API real
 * =======================================
 * O app pode trabalhar em dois modos:
 *   - MODO MOCK (sem backend): usa dados locais para testes
 *   - MODO REAL (com backend): faz chamadas HTTP
 *
 * A variável de ambiente EXPO_PUBLIC_USE_MOCKS define qual modo usar.
 * Por padrão, está como "true" para facilitar desenvolvimento offline.
 */
const USE_MOCKS = (process.env.EXPO_PUBLIC_USE_MOCKS ?? "true").toLowerCase() === "true";

/**
 * Pequeno delay artificial (em milissegundos).
 * Serve para simular tempo de resposta real da API nos mocks,
 * evitando telas "piscando" instantaneamente.
 */
const sleep = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/**
 * =======================================
 * 📡 coursesService
 * =======================================
 * Camada de abstração para operações relacionadas a "Cursos".
 *
 * Em vez de chamar `api.get(...)` diretamente nas telas,
 * usamos este service para:
 *   - Centralizar lógica de API
 *   - Facilitar troca de mocks por backend real
 *   - Manter tipagem consistente (Course[])
 *   - Fazer tratamento de erros padronizado
 */
export const coursesService = {
  /**
   * 🔸 Lista todos os cursos disponíveis
   */
  async getAll(): Promise<Course[]> {
    if (USE_MOCKS) {
      await sleep(); // simula latência
      return COURSES_MOCK;
    }
    try {
      const res = await routes.courses.getAll();
      return res.data;
    } catch (e) {
      throw toApiError(e); // converte erros HTTP em formato amigável
    }
  },

  /**
   * 🔸 Busca cursos pelo termo digitado (nome, autor, descrição)
   */
  async getBySearch(search: string): Promise<Course[]> {
    if (USE_MOCKS) {
      await sleep();
      return mockFilterBySearch(search);
    }
    try {
      const res = await routes.courses.getBySearch(search);
      return res.data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  /**
   * 🔸 Obtém os cursos em que o usuário está matriculado
   *
   * No modo MOCK → retorna um subconjunto de COURSES_MOCK com progressos
   * No modo REAL → chamará o endpoint real assim que disponível
   */
  async getEnrolled(): Promise<Course[]> {
    if (USE_MOCKS) {
      await sleep();
      return mockGetEnrolledCourses();
    }
    try {
      // Quando o endpoint real existir, basta trocar aqui
      const { data } = await routes.courses.getEnrolled();
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },
};
