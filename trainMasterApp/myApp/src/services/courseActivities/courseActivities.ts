import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { ActivitiesAndExams, CourseActivity, CourseActivityQuestion, CourseActivityWithQuestions, Exam } from "../types";


export const CoursesActivityService = {
    async getAllFilterById(courseId: number): Promise<ActivitiesAndExams> {
        try {
            // 1) Atividades do curso
            const { data: allActivities } = await routes.courseActivities.getAll();
            const activities: CourseActivity[] = (allActivities ?? []).filter(
                (a: CourseActivity) => a.courseId === courseId
            );

            // 2) Questões do curso (uma chamada só)
            const { data: allQuestions } = await routes.courseActivities.getAllQuestionsFromCourse(courseId);
            const questions: CourseActivityQuestion[] = allQuestions ?? [];
            // 3) Agrupar questões por activityId
            const byActivity = new Map<number, CourseActivityQuestion[]>();
            for (const q of questions) {
                if (!byActivity.has(q.courseActivitieId)) byActivity.set(q.courseActivitieId, []);
                byActivity.get(q.courseActivitieId)!.push(q);
            }

            // 4) Cria atividades com suas questões (ordena por order)
            const activitiesWithQuestions: CourseActivityWithQuestions[] = activities.map((act) => ({
                ...act,
                questions: (byActivity.get(act.id) ?? []).sort((a, b) => a.order - b.order), // 👈 fixa em 1
            }));

            // 5) Busca provas do curso (mantém normal)
            const { data: allExams } = await routes.courseActivities.getAllExams();
            const exams: Exam[] = (allExams ?? []).filter((e) => e.courseId === courseId);

            // 6) Retorna tudo em vetores separados
           return {
        activities: activitiesWithQuestions,
        exams,
      };
        } catch (e) {
            throw toApiError(e);
        }
    },

    async getAll(): Promise<CourseActivity[]> {
        try {
            const response = await routes.courseActivities.getAll();
            const activities = response.data;
            return activities;
        } catch (e) {
            throw toApiError(e); // converte erros HTTP em formato amigável
        }
    },

    async getAllQuestionsFromCourse(id: number): Promise<CourseActivityQuestion[]> {
        try {
            const response = await routes.courseActivities.getAllQuestionsFromCourse(id);
            return response.data;
        } catch (e) {
            throw toApiError(e);
        }
    },
};
