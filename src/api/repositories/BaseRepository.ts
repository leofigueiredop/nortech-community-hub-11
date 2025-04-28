
export class BaseRepository {
  protected currentCommunityId: string | null = null;

  public setCommunityContext(communityId: string | null) {
    this.currentCommunityId = communityId;
  }

  protected async setTenantContext() {
    if (this.currentCommunityId) {
      await this.supabase.rpc('set_tenant_context', {
        community_uuid: this.currentCommunityId
      });
    }
  }

  protected async handleResponse<T>(response: any): Promise<T> {
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data;
  }
}
