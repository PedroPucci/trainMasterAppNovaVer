import { AxiosError } from "axios";
import { ApiErrorShape } from "./types";

export function toApiError(err: unknown): ApiErrorShape {
  const ax = err as AxiosError<any>;
  if (ax?.isAxiosError) {
    return {
      message: ax.response?.data?.message || ax.message || "Erro de rede",
      status: ax.response?.status,
      code: ax.response?.data?.code,
      details: ax.response?.data,
    };
  }
  return { message: (err as any)?.message ?? "Erro desconhecido" };
}