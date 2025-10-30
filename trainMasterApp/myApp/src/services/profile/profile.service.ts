// services/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toApiError } from "../errors";
import { routes } from "../route";
import { LoginData, LoginPayload, ProfilePayload } from "../types";

const STORAGE_KEY = "@app.profileName";

class ProfileService {
  private _name: string | null = null;
  private _loaded = false;

  /** Carrega userId do AsyncStorage (chame uma vez no app boot se quiser) */
  async loadFromStorage(): Promise<void> {
    if (this._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      this._name = raw;
      this._loaded = true;
    } catch {
      // se der erro, continua sem userId
      this._name = null;
      this._loaded = true;
    }
  }

  /** Login: chama API, salva userId (memória + storage) e retorna dados */
  async getLoggedProfile(): Promise<ProfilePayload> {
    try {
      const res = await routes.profile.getLoggedProfile();
      const {data} = res;

      if (!data.success) {
        throw new Error(data.message);
      }

      this._name = data.data.fullName;
      await AsyncStorage.setItem(STORAGE_KEY, String(data.id));
      return data.data;
    } catch (e) {
      throw toApiError(e);
    }
  }

  /** Logout: (opcional) chama API e limpa userId */
  async cleanProfile(): Promise<void> {
    try {
      // Se você tiver um endpoint de logout, chame aqui (ex.: routes.auth.logout())
      // await routes.auth.logout();

      this._name = null;
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      throw toApiError(e);
    }
  }

  /** Lê o userId atual (pode ser null) */
  getUserName(): string | null {
    return this._name;
  }

}

export const profileService = new ProfileService();