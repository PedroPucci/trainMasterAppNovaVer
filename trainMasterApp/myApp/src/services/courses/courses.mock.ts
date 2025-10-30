import type { Course } from "../types";

// Mock básico; você pode evoluir para JSON separado.
export const COURSES_MOCK: Course[] = [
  {
    id: "1",
    name: "Fundamentos de Java",
    description: "Aprenda os conceitos básicos da linguagem Java e sua aplicação em projetos reais.",
    startDate: "2025-10-01",
    endDate: "2025-10-01",
    isActive: true,
    userId: 1,
    createDate: "2025-10-01T00:00:00Z",
    modificationDate: "2025-10-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Java Avançado",
    description: "Aprofunde-se em tópicos avançados de Java, incluindo Streams, Lambdas e Spring Boot.",
    startDate: "2025-09-15",
    endDate: "2025-09-15",
    isActive: true,
    userId: 1,
    createDate: "2025-09-15T00:00:00Z",
    modificationDate: "2025-09-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Introdução à Gerência de Projetos",
    description: "Conceitos fundamentais de gestão de projetos, metodologias tradicionais e ágeis.",
    startDate: "2025-08-12",
    endDate: "2025-08-12",
    isActive: true,
    userId: 1,
    createDate: "2025-08-12T00:00:00Z",
    modificationDate: "2025-08-12T00:00:00Z",
  },
  {
    id: "4",
    name: "Scrum na Prática",
    description: "Aplicação prática de Scrum em equipes reais. Papéis, cerimônias e artefatos.",
    startDate: "2025-07-20",
    endDate: "2025-07-20",
    isActive: true,
    userId: 1,
    createDate: "2025-07-20T00:00:00Z",
    modificationDate: "2025-07-20T00:00:00Z",
  },
  {
    id: "5",
    name: "Fundamentos de C#",
    description: "Aprenda a linguagem C# do zero e desenvolva seus primeiros programas .NET.",
    startDate: "2025-06-10",
    endDate: "2025-06-10",
    isActive: true,
    userId: 1,
    createDate: "2025-06-10T00:00:00Z",
    modificationDate: "2025-06-10T00:00:00Z",
  },
  {
    id: "6",
    name: "C# Avançado com .NET",
    description: "Explore tópicos avançados de C#, LINQ, async/await e boas práticas em aplicações .NET.",
    startDate: "2025-05-28",
    endDate: "2025-05-28",
    isActive: true,
    userId: 1,
    createDate: "2025-05-28T00:00:00Z",
    modificationDate: "2025-05-28T00:00:00Z",
  },
  {
    id: "7",
    name: "Fundamentos de UI/UX Design",
    description: "Entenda princípios de design de interface e experiência do usuário.",
    startDate: "2025-04-02",
    endDate: "2025-04-02",
    isActive: true,
    userId: 1,
    createDate: "2025-04-02T00:00:00Z",
    modificationDate: "2025-04-02T00:00:00Z",
  },
  {
    id: "8",
    name: "UI Avançado com Figma",
    description: "Aprenda técnicas avançadas de prototipação e design no Figma.",
    startDate: "2025-03-10",
    endDate: "2025-03-10",
    isActive: true,
    userId: 1,
    createDate: "2025-03-10T00:00:00Z",
    modificationDate: "2025-03-10T00:00:00Z",
  },
];

export function mockFilterBySearch(q?: string) {
  if (!q?.trim()) return COURSES_MOCK;

  const s = q.toLowerCase();

  return COURSES_MOCK.filter(
    (c) =>
      c.name.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s)
  );
}

export function mockGetEnrolledCourses() {
  return COURSES_MOCK;
}
