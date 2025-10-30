
import { api } from "./http";

export type ProfilePayload = {
  FullName: string;
  Email: string;
  DateOfBirth: string;
  Cpf: string;
  Marital: number;
  Gender: number;
  UserId: number;
};

export type LoginPayload = {
  cpf: string;
  password: string;
};

const PATHS = {
  profile: "/profile",
  login: "/login",
};

export const routes = {
  profile: {
    add: (payload: ProfilePayload) =>
      api.post(`${PATHS.profile}/adicionarPerfil`, payload),

    update: (id: number, payload: ProfilePayload) =>
      api.put(`${PATHS.profile}/${id}`, payload),

    getById: (id: number) => api.get(`${PATHS.profile}/${id}`),
  },

  auth: {
    login: (payload: LoginPayload) => api.post(`${PATHS.login}/login`, payload),
    forgotPassword: (payload: { email: string; newPassword: string }) =>
      api.post(`${PATHS.login}/ForgotPassword`, payload),
  },
};

export type Routes = typeof routes;
