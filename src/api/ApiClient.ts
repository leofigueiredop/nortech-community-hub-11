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
import { SupabaseInviteRepository } from './repositories/SupabaseInviteRepository';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Result } from '@/types/api';
import { ContentItem } from '@/types/content';
import { Profile } from '@/types/profile';
import { Event } from '@/types/events';
import { PaywallSettings, PaywallTemplate } from '@/types/paywall';

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
  private _invite: SupabaseInviteRepository;

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
    this._invite = new SupabaseInviteRepository(this.supabase);

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
    (this._invite as unknown as IBaseRepository).setCommunityContext(communityId);
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

  get invite(): SupabaseInviteRepository {
    return this._invite;
  }

  // Método para atualizar o contexto da instância
  setContext(userId?: string, communityId?: string) {
    if (userId) this.userId = userId;
    if (communityId) this.communityId = communityId;
  }

  // Temporary paywall methods to fix the hook error
  async getPaywallSettings(): Promise<PaywallSettings | null> {
    if (!this._currentCommunityId) return null;
    
    try {
      const { data, error } = await this.supabase
        .from('paywall_settings')
        .select('*')
        .eq('community_id', this._currentCommunityId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching paywall settings:', error);
        return null;
      }

      // Return default settings if none exist
      const defaultSettings: PaywallSettings = {
        activeTemplate: 'standard',
        activeGateways: ['stripe'],
        gatewayConfigs: {
          stripe: { 
            enabled: true,
            apiKey: '',
            webhookSecret: '',
            isDefault: true
          },
          paypal: {
            enabled: false,
            clientId: '',
            clientSecret: '',
            isDefault: false
          }
        },
        messageSettings: {
          title: 'Upgrade to Premium',
          description: 'Get access to exclusive content by becoming a premium member.',
          ctaText: 'Upgrade Now'
        }
      };

      return data ? {
        activeTemplate: data.active_template || defaultSettings.activeTemplate,
        activeGateways: data.active_gateways || defaultSettings.activeGateways,
        gatewayConfigs: data.gateway_configs || defaultSettings.gatewayConfigs,
        messageSettings: data.message_settings || defaultSettings.messageSettings
      } : defaultSettings;
    } catch (error) {
      console.error('Error fetching paywall settings:', error);
      return null;
    }
  }

  async updatePaywallSettings(settings: PaywallSettings): Promise<boolean> {
    if (!this._currentCommunityId) return false;
    
    try {
      const { error } = await this.supabase
        .from('paywall_settings')
        .upsert({
          community_id: this._currentCommunityId,
          active_template: settings.activeTemplate,
          active_gateways: settings.activeGateways,
          gateway_configs: settings.gatewayConfigs,
          message_settings: settings.messageSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating paywall settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating paywall settings:', error);
      return false;
    }
  }

  async getPaywallTemplates(): Promise<PaywallTemplate[]> {
    try {
      // Return hardcoded templates for now
      const templates: PaywallTemplate[] = [
        {
          id: 'standard',
          name: 'Standard',
          description: 'Clean and simple paywall design',
          layout: 'modal',
          previewImage: '/images/templates/standard.png'
        },
        {
          id: 'modern',
          name: 'Modern',
          description: 'Modern gradient design with animations',
          layout: 'inline',
          previewImage: '/images/templates/modern.png'
        },
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Minimalist design focused on content',
          layout: 'sidebar',
          previewImage: '/images/templates/minimal.png'
        }
      ];

      return templates;
    } catch (error) {
      console.error('Error fetching paywall templates:', error);
      return [];
    }
  }
}

export const api = ApiClient.getInstance();
