// Centraliza rotas do backend
export const PATHS = {
  profile: "/profile",
  login: "/auth/login",
  courses: "/courses",
  coursesSearch: "/courses/GetByName",
  courseEnrolled:"/courses/GetByUserId",
  coursesActivities:"/course-activities",
  exams:"/exams",
  history:"exam-histories/user",
  faq:"/faqs",
} as const;