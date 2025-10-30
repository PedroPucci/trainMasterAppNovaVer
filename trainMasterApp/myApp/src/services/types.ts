// Tipos genéricos de API e modelos compartilhados

export type ApiPagination = {
  page?: number;
  pageSize?: number;
  total?: number;
};

export type ApiErrorShape = {
  message: string;
  status?: number;
  code?: string;
  details?: any;
};

// ===== Domínio Courses =====
export type Course = {
  id: string;                 // → "Id" (PK)
  name: string;               // → "Name"
  description: string;        // → "Description"
  author: string;              // -> nome do author
  startDate: string;          // → "StartDate" (ISO string)
  endDate: string;            // → "EndDate" (ISO string)
  isActive: boolean;          // → "IsActive"
  userId: number;             // → "UserId" (sempre 1 no mock)
  createDate: string;         // → "CreateDate" (ISO string)
  modificationDate: string;   // → "ModificationDate" (ISO string)
  thumbnailUrl: string;
  duration: string;
};

export type ProfilePayload = {
  FullName: string;
  Email: string;
  DateOfBirth: string;
  Cpf: string;
  Marital: number;
  Gender: number;
  UserId: number;
};

export type LoginPayload = { cpf: string; password: string };

export type LoginData = { cpf: string; id: number };

export type Lesson = {
  id: string;
  title: string;
  completed?: boolean; // ✔️
  progressPercentage?: number; // 0–100 (p/ aulas em andamento)
};

export type ModuleBlock = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type CourseDetail = {
  id: string;
  title: string;
  exam: ModuleBlock;      // “Prova”
  exercises: ModuleBlock[]; // “Exercícios”
  completedModules: number;
  totalModules: number;
};

export type CourseActivity = {
  id: number;
  title: string;
  description: string;
  startDate: string; // ISO string
  dueDate: string;   // ISO string
  maxScore: number;
  courseId: number;
}

export type QuestionOption = {
  text: string;
  isCorrect: boolean;
};

export type CourseActivityQuestion = {
  id?: number;
  statement: string;
  order: number;
  points: number;
  courseActivitieId: number;
  options: QuestionOption[];
};

export type Exam = {
  title: string;
  instructions: string;
  startAt: string;   // ISO 8601, ex: "2025-10-20T12:00:00.000Z"
  endAt: string;     // ISO 8601, ex: "2025-10-20T14:00:00.000Z"
  isPublished: boolean;
  courseId: number;
}

export interface CourseActivityWithQuestions extends CourseActivity {
  questions: CourseActivityQuestion[];
  exams?: Exam[];
}
export interface ActivitiesAndExams {
  activities: CourseActivityWithQuestions[];
  exams: Exam[];
}