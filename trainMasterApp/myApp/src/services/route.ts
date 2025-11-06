import { api } from "./api";
import { authService } from "./auth/auth.service";
import { PATHS } from "./paths";
import type { Course, CourseActivity, Exam, ExamHistoryItem, faq, LoginPayload, ProfilePayload } from "./types";



export const routes = {
  profile: {
    add: (payload: ProfilePayload) =>
      api.post(`${PATHS.profile}/adicionarPerfil`, payload),
    update: (id: number, payload: ProfilePayload) =>
      api.put(`${PATHS.profile}/${id}`, payload),
    getById: (id: number) => api.get(`${PATHS.profile}/${id}`),
    getLoggedProfile: () => {
      const userId = authService.requireUserId().toString();
      return api.get(`${PATHS.profile}/${userId}`)
    }
  },

  auth: {
    login: (payload: LoginPayload) => api.post(`${PATHS.login}`, payload),
    forgotPassword: (payload: { email: string; newPassword: string }) =>
      api.post(`${PATHS.login}/ForgotPassword`, payload),
  },
  courseActivities: {
    getAll: () => api.get<CourseActivity[]>(`${PATHS.coursesActivities}/all`),
    getAllQuestionsFromCourse: (id: number) => api.get(`${PATHS.coursesActivities}/${id}/questions`),
    getAllExams: () => api.get<Exam[]>(`${PATHS.exams}/all`),
  },
  history: {
    getAllByUserId: () => {
      const userId = authService.requireUserId().toString();
      return api.get<ExamHistoryItem[]>(`${PATHS.history}/${userId}`);
    }
  },
  faq: {
    getAll: () => api.get<faq[]>(PATHS.faq),
  },
  courses: {
    getAll: () => api.get<Course[]>(PATHS.courses),
    getBySearch: (search: string) => {
      const qs = new URLSearchParams({ name: search }).toString();
      return api.get<Course[]>(`${PATHS.coursesSearch}?${qs}`);
    },
    getEnrolled: () => {
      const userId = authService.requireUserId().toString();
      const qs = new URLSearchParams({ userId: userId }).toString();// tem que vir do auth
      return api.get<Course[]>(`${PATHS.courseEnrolled}?${qs}`);
    }
  },
};

export type Routes = typeof routes;
