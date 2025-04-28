
import { IAuthRepository } from './interfaces/IAuthRepository';
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';

export class ApiClient {
  private static instance: ApiClient;
  private _auth: IAuthRepository;

  private constructor() {
    this._auth = new SupabaseAuthRepository();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  get auth(): IAuthRepository {
    return this._auth;
  }

  // No futuro, você pode adicionar mais repositórios aqui:
  // get content(): IContentRepository
  // get events(): IEventsRepository
  // etc...
}

// Export a singleton instance
export const api = ApiClient.getInstance();
