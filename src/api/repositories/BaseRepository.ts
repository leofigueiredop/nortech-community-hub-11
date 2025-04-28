
import { ApiResponse } from '@/types/api';

export abstract class BaseRepository {
  protected async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as T;
  }

  protected handleError(error: any): never {
    console.error('API Error:', error);
    throw error;
  }
}
