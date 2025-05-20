import { IAuthRepository } from './interfaces/IAuthRepository';
import { IContentRepository } from './interfaces/IContentRepository';
import { IEventsRepository } from './interfaces/IEventsRepository';
import { IDiscussionRepository } from './interfaces/IDiscussionRepository';
import { IPointsRepository } from './interfaces/IPointsRepository';
import { IMigrationRepository } from './interfaces/IMigrationRepository';
import { ICommunityRepository } from './interfaces/ICommunityRepository';
import { IPostRepository } from './interfaces/IPostRepository';
import { IPostReactionsRepository } from './interfaces/IPostReactionsRepository';
import { IPostCommentsRepository } from './interfaces/IPostCommentsRepository';
import { IBaseRepository } from './interfaces/IBaseRepository'; 
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';
import { SupabaseContentRepository } from './repositories/SupabaseContentRepository';
import { SupabaseEventsRepository } from './repositories/SupabaseEventsRepository';
import { SupabaseDiscussionRepository } from './repositories/SupabaseDiscussionRepository';
import { SupabasePointsRepository } from './repositories/SupabasePointsRepository';
import { SupabaseMigrationRepository } from './repositories/SupabaseMigrationRepository';
import { SupabaseCommunityRepository } from './repositories/SupabaseCommunityRepository';
import { SupabasePostRepository } from './repositories/SupabasePostRepository';
import { SupabasePostReactionsRepository } from './repositories/SupabasePostReactionsRepository';
import { SupabasePostCommentsRepository } from './repositories/SupabasePostCommentsRepository';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseCommunitySettingsRepository } from './repositories/SupabaseCommunitySettingsRepository';
import { SupabasePaywallRepository } from './repositories/SupabasePaywallRepository';
import { EventData } from '../types/events';
import { ContentItem, ContentFilter } from '../types/content';
import { AuthUser } from '../types/auth';
import { UpdateProfileParams } from '../types/profile';
import { CommunitySettings } from '../types/settings';
import { 
  PaywallSettings, 
  PaywallTemplate, 
  PaymentPlan,
  CheckoutOptions,
  SubscriptionStatus,
  PaymentMethod,
  PaymentHistory 
} from '../types/paywall';

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
  private _reactions: IPostReactionsRepository;
  private _comments: IPostCommentsRepository;
  private _currentCommunityId: string | null = null;
  public supabase: SupabaseClient;
  private userId: string | null = null;
  private communityId: string | null = null;

  private constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    this._auth = new SupabaseAuthRepository(this.supabase);
    this._content = new SupabaseContentRepository(this.supabase);
    this._events = new SupabaseEventsRepository(this.supabase);
    this._discussions = new SupabaseDiscussionRepository(this.supabase);
    this._points = new SupabasePointsRepository(this.supabase);
    this._migration = new SupabaseMigrationRepository(this.supabase);
    this._community = new SupabaseCommunityRepository(this.supabase);
    this._posts = new SupabasePostRepository(this.supabase);
    this._reactions = new SupabasePostReactionsRepository(this.supabase);
    this._comments = new SupabasePostCommentsRepository(this.supabase);

    try {
      const session = this.supabase.auth.session();
      this.userId = session?.user?.id || null;
      
      // Tenta obter o communityId de um lugar central
      // Este valor pode ser atualizado depois pelo setContext
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
    (this._posts as unknown as IBaseRepository).setCommunityContext(communityId);
    this._reactions.setCurrentCommunity(communityId || '');
    this._comments.setCurrentCommunity(communityId || '');
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
  
  get reactions(): IPostReactionsRepository {
    return this._reactions;
  }

  get comments(): IPostCommentsRepository {
    return this._comments;
  }

  // Método para atualizar o contexto da instância
  setContext(userId?: string, communityId?: string) {
    if (userId) this.userId = userId;
    if (communityId) this.communityId = communityId;
  }

  // MÉTODOS DE AUTH
  async login(email: string, password: string): Promise<AuthUser | null> {
    const authRepo = new SupabaseAuthRepository(this.supabase);
    return authRepo.login(email, password);
  }

  async register(email: string, password: string, username: string): Promise<AuthUser | null> {
    const authRepo = new SupabaseAuthRepository(this.supabase);
    return authRepo.register(email, password, username);
  }

  async logout(): Promise<void> {
    const authRepo = new SupabaseAuthRepository(this.supabase);
    return authRepo.logout();
  }

  async getProfile(userId?: string): Promise<any> {
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    const authRepo = new SupabaseAuthRepository(this.supabase);
    return authRepo.getProfile(targetUserId);
  }

  async updateProfile(params: UpdateProfileParams): Promise<any> {
    if (!this.userId) throw new Error('User is not authenticated');
    const authRepo = new SupabaseAuthRepository(this.supabase);
    return authRepo.updateProfile(this.userId, params);
  }

  // MÉTODOS DE POINTS
  async getUserPoints(userId?: string): Promise<number> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const pointsRepo = new SupabasePointsRepository(this.supabase, this.communityId);
    return pointsRepo.getUserPoints(targetUserId);
  }

  async getLeaderboard(limit: number = 10, offset: number = 0): Promise<any[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const pointsRepo = new SupabasePointsRepository(this.supabase, this.communityId);
    return pointsRepo.getLeaderboard(limit, offset);
  }

  // MÉTODOS DE EVENTOS
  async registerEvent(eventData: EventData): Promise<boolean> {
    if (!this.communityId) throw new Error('Community ID is required');
    if (!this.userId) throw new Error('User is not authenticated');
    
    const eventsRepo = new SupabaseEventsRepository(this.supabase, this.communityId);
    return eventsRepo.register({
      ...eventData,
      userId: this.userId
    });
  }

  // MÉTODOS DE CONTEÚDO
  async getContentItems(filter?: ContentFilter): Promise<ContentItem[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const contentRepo = new SupabaseContentRepository(this.supabase, this.communityId);
    return contentRepo.getItems(filter);
  }

  async getContentItem(id: string): Promise<ContentItem | null> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const contentRepo = new SupabaseContentRepository(this.supabase, this.communityId);
    return contentRepo.getItem(id);
  }

  // MÉTODOS DE CONFIGURAÇÕES DA COMUNIDADE
  async getCommunitySettings(): Promise<CommunitySettings | null> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const settingsRepo = new SupabaseCommunitySettingsRepository(this.supabase, this.communityId);
    return settingsRepo.getSettings();
  }

  async updateCommunitySettings(settings: CommunitySettings): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const settingsRepo = new SupabaseCommunitySettingsRepository(this.supabase, this.communityId);
    return settingsRepo.updateSettings(settings);
  }

  // MÉTODOS DE PAYWALL
  async getPaywallSettings(): Promise<PaywallSettings | null> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getSettings();
  }

  async updatePaywallSettings(settings: PaywallSettings): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.updateSettings(settings);
  }

  async getPaywallTemplates(): Promise<PaywallTemplate[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getTemplates();
  }

  async createPaywallTemplate(template: Omit<PaywallTemplate, 'id'>): Promise<PaywallTemplate> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.createTemplate(template);
  }

  async updatePaywallTemplate(id: string, template: Partial<PaywallTemplate>): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.updateTemplate(id, template);
  }

  async deletePaywallTemplate(id: string): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.deleteTemplate(id);
  }

  // Planos de pagamento
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getPlans();
  }

  async getPaymentPlan(id: string): Promise<PaymentPlan | null> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getPlan(id);
  }

  async createPaymentPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.createPlan(plan);
  }

  async updatePaymentPlan(id: string, plan: Partial<PaymentPlan>): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.updatePlan(id, plan);
  }

  async deletePaymentPlan(id: string): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.deletePlan(id);
  }

  // Checkout e assinaturas
  async createCheckoutSession(options: CheckoutOptions): Promise<{ url: string, sessionId: string }> {
    if (!this.communityId) throw new Error('Community ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.createCheckoutSession(options);
  }

  async getSubscriptionStatus(userId?: string): Promise<SubscriptionStatus> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getSubscriptionStatus(targetUserId);
  }

  async cancelSubscription(userId?: string, immediately: boolean = false): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.cancelSubscription(targetUserId, immediately);
  }

  async resumeSubscription(userId?: string): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.resumeSubscription(targetUserId);
  }

  // Métodos de pagamento
  async getPaymentMethods(userId?: string): Promise<PaymentMethod[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getPaymentMethods(targetUserId);
  }

  async setDefaultPaymentMethod(paymentMethodId: string, userId?: string): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.setDefaultPaymentMethod(targetUserId, paymentMethodId);
  }

  async deletePaymentMethod(paymentMethodId: string, userId?: string): Promise<void> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.deletePaymentMethod(targetUserId, paymentMethodId);
  }

  // Histórico de pagamentos
  async getPaymentHistory(userId?: string): Promise<PaymentHistory[]> {
    if (!this.communityId) throw new Error('Community ID is required');
    const targetUserId = userId || this.userId;
    if (!targetUserId) throw new Error('User ID is required');
    
    const paywallRepo = new SupabasePaywallRepository(this.supabase, this.communityId);
    return paywallRepo.getPaymentHistory(targetUserId);
  }
}

export const api = ApiClient.getInstance();
