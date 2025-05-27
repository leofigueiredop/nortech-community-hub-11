import { IAuthRepository } from './interfaces/IAuthRepository';
import { IContentRepository } from './interfaces/IContentRepository';
import { IEventsRepository } from './interfaces/IEventsRepository';
import { IDiscussionRepository } from './interfaces/IDiscussionRepository';
import { IPointsRepository } from './interfaces/IPointsRepository';
import { IMigrationRepository } from './interfaces/IMigrationRepository';
import { ICommunityRepository } from './interfaces/ICommunityRepository';
import { IBaseRepository } from './interfaces/IBaseRepository';
import { IMembersRepository } from './interfaces/IMembersRepository';
import { IPostRepository } from './interfaces/IPostRepository';
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';
import { SupabaseContentRepository } from './repositories/SupabaseContentRepository';
import { SupabaseEventsRepository } from './repositories/SupabaseEventsRepository';
import { SupabaseDiscussionRepository } from './repositories/SupabaseDiscussionRepository';
import { SupabasePointsRepository } from './repositories/SupabasePointsRepository';
import { SupabaseMigrationRepository } from './repositories/SupabaseMigrationRepository';
import { SupabaseCommunityRepository } from './repositories/SupabaseCommunityRepository';
import { SupabaseMembersRepository } from './repositories/SupabaseMembersRepository';
import { SupabasePostRepository } from './repositories/SupabasePostRepository';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Result } from '@/types/api';
import { ContentItem } from '@/types/content';
import { Profile } from '@/types/profile';
import { Event } from '@/types/events';

export class ApiClient {
  private static instance: ApiClient;
  private _auth: IAuthRepository;
  private _content: IContentRepository;
  private _events: IEventsRepository;
  private _discussions: IDiscussionRepository;
  private _points: IPointsRepository;
  private _migration: IMigrationRepository;
  private _community: ICommunityRepository;
  private _members: IMembersRepository;
  private _posts: IPostRepository;
  private _currentCommunityId: string | null = null;
  public supabase: SupabaseClient;
  private userId: string | null = null;
  private communityId: string | null = null;

  private constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    this._auth = new SupabaseAuthRepository();
    this._content = new SupabaseContentRepository(this.supabase);
    this._events = new SupabaseEventsRepository(this.supabase);
    this._discussions = new SupabaseDiscussionRepository(this.supabase) as unknown as IDiscussionRepository;
    this._points = new SupabasePointsRepository(this.supabase);
    this._migration = new SupabaseMigrationRepository(this.supabase);
    this._community = new SupabaseCommunityRepository(this.supabase);
    this._members = new SupabaseMembersRepository(this.supabase);
    this._posts = new SupabasePostRepository(this.supabase);

    try {
      // Tenta obter o communityId de um lugar central
      const communityIdFromStorage = localStorage.getItem('communityId');
      this.communityId = communityIdFromStorage;
    } catch (error) {
      console.error('Error initializing ApiClient:', error);
    }
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(supabase);
    }
    return ApiClient.instance;
  }

  public setCurrentCommunity(communityId: string | null) {
    this._currentCommunityId = communityId;
    
    // Update community context in all repositories
    (this._content as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._events as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._discussions as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._points as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._community as unknown as IBaseRepository).setCommunityContext(communityId);
    (this._members as unknown as IBaseRepository).setCommunityContext(communityId);
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
  
  get members(): IMembersRepository {
    return this._members;
  }

  get posts(): IPostRepository {
    return this._posts;
  }

  // Método para atualizar o contexto da instância
  setContext(userId?: string, communityId?: string) {
    if (userId) this.userId = userId;
    if (communityId) this.communityId = communityId;
  }
}

export const api = ApiClient.getInstance();
