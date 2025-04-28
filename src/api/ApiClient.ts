import { IAuthRepository } from './interfaces/IAuthRepository';
import { IContentRepository } from './interfaces/IContentRepository';
import { IEventsRepository } from './interfaces/IEventsRepository';
import { IDiscussionRepository } from './interfaces/IDiscussionRepository';
import { IPointsRepository } from './interfaces/IPointsRepository';
import { IMigrationRepository } from './interfaces/IMigrationRepository';
import { ICommunityRepository } from './interfaces/ICommunityRepository';
import { IPostRepository } from './interfaces/IPostRepository';
import { IBaseRepository } from './interfaces/IBaseRepository'; 
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';
import { SupabaseContentRepository } from './repositories/SupabaseContentRepository';
import { SupabaseEventsRepository } from './repositories/SupabaseEventsRepository';
import { SupabaseDiscussionRepository } from './repositories/SupabaseDiscussionRepository';
import { SupabasePointsRepository } from './repositories/SupabasePointsRepository';
import { SupabaseMigrationRepository } from './repositories/SupabaseMigrationRepository';
import { SupabaseCommunityRepository } from './repositories/SupabaseCommunityRepository';
import { SupabasePostRepository } from './repositories/SupabasePostRepository';
import { supabaseConfig } from './config';

export class ApiClient {
  private static instance: ApiClient;
  private _auth: IAuthRepository;
  private _content: IContentRepository;
  private _events: IEventsRepository;
  private _discussions: IDiscussionRepository;
  private _points: IPointsRepository;
  private _migration: IMigrationRepository;
  private _community: ICommunityRepository;
  private _posts: IPostRepository;
  private _currentCommunityId: string | null = null;

  private constructor() {
    this._auth = new SupabaseAuthRepository();
    this._content = new SupabaseContentRepository();
    this._events = new SupabaseEventsRepository();
    this._discussions = new SupabaseDiscussionRepository();
    this._points = new SupabasePointsRepository();
    this._migration = new SupabaseMigrationRepository();
    this._community = new SupabaseCommunityRepository();
    this._posts = new SupabasePostRepository();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setCurrentCommunity(communityId: string | null) {
    this._currentCommunityId = communityId;
    // Update context in all repositories
    (this._content as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._events as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._discussions as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._points as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._community as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._posts as unknown as IBaseRepository).setCommunityContext(communityId);
  }

  public getCurrentCommunityId(): string | null {
    return this._currentCommunityId;
  }

  get auth(): IAuthRepository {
    return this._auth;
  }

  get content(): IContentRepository {
    return this._content;
  }

  get events(): IEventsRepository {
    return this._events;
  }

  get discussions(): IDiscussionRepository {
    return this._discussions;
  }

  get points(): IPointsRepository {
    return this._points;
  }

  get migration(): IMigrationRepository {
    return this._migration;
  }
  
  get community(): ICommunityRepository {
    return this._community;
  }
  
  get posts(): IPostRepository {
    return this._posts;
  }
}

export const api = ApiClient.getInstance();
