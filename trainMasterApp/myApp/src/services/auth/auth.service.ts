// services/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toApiError } from "../errors";
import { routes } from "../route";
import { LoginData, LoginPayload } from "../types";
import { profileService } from "../profile/profile.service";

const STORAGE_KEY = "@app.userId";

class AuthService {
  private _userId: number | null = null;
  private _loaded = false;

  /** Carrega userId do AsyncStorage (chame uma vez no app boot se quiser) */
  async loadFromStorage(): Promise<void> {
    if (this._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      this._userId = raw ? Number(raw) : null;
      this._loaded = true;
    } catch {
      // se der erro, continua sem userId
      this._userId = null;
      this._loaded = true;
    }
  }

  /** Login: chama API, salva userId (memória + storage) e retorna dados */
  async login(payload: LoginPayload): Promise<LoginData> {
    try {
      const res = await routes.auth.login(payload);
      const {data} = res;

      if (!data.success) {
        throw new Error(data.message);
      }

      this._userId = data.data.id;
      await profileService.getLoggedProfile();
      await AsyncStorage.setItem(STORAGE_KEY, String(data.id));
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  }

  /** Logout: (opcional) chama API e limpa userId */
  async logout(): Promise<void> {
    try {
      // Se você tiver um endpoint de logout, chame aqui (ex.: routes.auth.logout())
      // await routes.auth.logout();

      this._userId = null;
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      throw toApiError(e);
    }
  }

  /** Lê o userId atual (pode ser null) */
  getUserId(): number | null {
    return this._userId;
  }

  /** Garante userId (lança erro se não estiver logado) */
  requireUserId(): number {
    if (this._userId == null) {
      throw new Error("Usuário não autenticado (userId indisponível).");
    }
    return this._userId;
  }

  /** Conveniência */
  isLoggedIn(): boolean {
    return this._userId != null;
  }
}

export const authService = new AuthService();