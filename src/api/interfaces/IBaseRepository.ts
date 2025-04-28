
export interface IBaseRepository {
  setCommunityContext(communityId: string | null): void;
  handleResponse<T>(response: any): Promise<T>;
}
