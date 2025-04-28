
import { IAuthRepository } from './interfaces/IAuthRepository';
import { IContentRepository } from './interfaces/IContentRepository';
import { IEventsRepository } from './interfaces/IEventsRepository';
import { IDiscussionRepository } from './interfaces/IDiscussionRepository';
import { IPointsRepository } from './interfaces/IPointsRepository';
import { IMigrationRepository } from './interfaces/IMigrationRepository';
import { ICommunityRepository } from './interfaces/ICommunityRepository';
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';
import { SupabaseContentRepository } from './repositories/SupabaseContentRepository';
import { SupabaseEventsRepository } from './repositories/SupabaseEventsRepository';
import { SupabaseDiscussionRepository } from './repositories/SupabaseDiscussionRepository';
import { SupabasePointsRepository } from './repositories/SupabasePointsRepository';
import { SupabaseMigrationRepository } from './repositories/SupabaseMigrationRepository';
import { SupabaseCommunityRepository } from './repositories/SupabaseCommunityRepository';

// Supabase configuration
export const supabaseConfig = {
  url: "https://theslnawxkmheczpiokc.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZXNsbmF3eGttaGVjenBpb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDY0ODEsImV4cCI6MjA2MTM4MjQ4MX0.s3zC4dJi9ZtRJMZ4vutJteXFP71FJoNR2NkFb-2V6nA"
};

export class ApiClient {
  private static instance: ApiClient;
  private _auth: IAuthRepository;
  private _content: IContentRepository;
  private _events: IEventsRepository;
  private _discussions: IDiscussionRepository;
  private _points: IPointsRepository;
  private _migration: IMigrationRepository;
  private _community: ICommunityRepository;

  private constructor() {
    this._auth = new SupabaseAuthRepository();
    this._content = new SupabaseContentRepository();
    this._events = new SupabaseEventsRepository();
    this._discussions = new SupabaseDiscussionRepository();
    this._points = new SupabasePointsRepository();
    this._migration = new SupabaseMigrationRepository();
    this._community = new SupabaseCommunityRepository();
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
}

export const api = ApiClient.getInstance();
