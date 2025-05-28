import { supabase } from '@/lib/supabase';
import {
  StripeAccount,
  PlatformSubscription,
  MemberSubscription,
  RevenueSplit,
  PaymentTransaction,
  StripeWebhook,
  CommunityWithStripe,
  SubscriptionPlanWithStripe,
  CommunityMemberWithStripe
} from '@/types/stripe.types';

export class StripeRepository {
  // ============================================================================
  // STRIPE ACCOUNTS METHODS
  // ============================================================================

  async createStripeAccount(data: Omit<StripeAccount, 'id' | 'created_at' | 'updated_at'>): Promise<StripeAccount> {
    const { data: result, error } = await supabase
      .from('stripe_accounts')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating stripe account:', error);
      throw new Error(`Failed to create stripe account: ${error.message}`);
    }

    return result;
  }

  async getStripeAccountByCommunity(communityId: string): Promise<StripeAccount | null> {
    const { data, error } = await supabase
      .from('stripe_accounts')
      .select('*')
      .eq('community_id', communityId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching stripe account:', error);
      throw new Error(`Failed to fetch stripe account: ${error.message}`);
    }

    return data;
  }

  async getStripeAccountByStripeId(stripeAccountId: string): Promise<StripeAccount | null> {
    const { data, error } = await supabase
      .from('stripe_accounts')
      .select('*')
      .eq('stripe_account_id', stripeAccountId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching stripe account by stripe ID:', error);
      throw new Error(`Failed to fetch stripe account: ${error.message}`);
    }

    return data;
  }

  async updateStripeAccount(id: string, updates: Partial<StripeAccount>): Promise<StripeAccount> {
    const { data, error } = await supabase
      .from('stripe_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating stripe account:', error);
      throw new Error(`Failed to update stripe account: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // PLATFORM SUBSCRIPTIONS METHODS
  // ============================================================================

  async createPlatformSubscription(data: Omit<PlatformSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<PlatformSubscription> {
    const { data: result, error } = await supabase
      .from('platform_subscriptions')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating platform subscription:', error);
      throw new Error(`Failed to create platform subscription: ${error.message}`);
    }

    return result;
  }

  async getPlatformSubscriptionByCommunity(communityId: string): Promise<PlatformSubscription | null> {
    const { data, error } = await supabase
      .from('platform_subscriptions')
      .select('*')
      .eq('community_id', communityId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching platform subscription:', error);
      throw new Error(`Failed to fetch platform subscription: ${error.message}`);
    }

    return data;
  }

  async updatePlatformSubscription(id: string, updates: Partial<PlatformSubscription>): Promise<PlatformSubscription> {
    const { data, error } = await supabase
      .from('platform_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating platform subscription:', error);
      throw new Error(`Failed to update platform subscription: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // MEMBER SUBSCRIPTIONS METHODS
  // ============================================================================

  async createMemberSubscription(data: Omit<MemberSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<MemberSubscription> {
    const { data: result, error } = await supabase
      .from('member_subscriptions')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating member subscription:', error);
      throw new Error(`Failed to create member subscription: ${error.message}`);
    }

    return result;
  }

  async getMemberSubscription(communityId: string, userId: string): Promise<MemberSubscription | null> {
    const { data, error } = await supabase
      .from('member_subscriptions')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching member subscription:', error);
      throw new Error(`Failed to fetch member subscription: ${error.message}`);
    }

    return data;
  }

  async getMemberSubscriptionsByStripeId(stripeSubscriptionId: string): Promise<MemberSubscription | null> {
    const { data, error } = await supabase
      .from('member_subscriptions')
      .select('*')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching member subscription by stripe ID:', error);
      throw new Error(`Failed to fetch member subscription: ${error.message}`);
    }

    return data;
  }

  async updateMemberSubscription(id: string, updates: Partial<MemberSubscription>): Promise<MemberSubscription> {
    const { data, error } = await supabase
      .from('member_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating member subscription:', error);
      throw new Error(`Failed to update member subscription: ${error.message}`);
    }

    return data;
  }

  async getMemberSubscriptionsByCommunity(communityId: string): Promise<MemberSubscription[]> {
    const { data, error } = await supabase
      .from('member_subscriptions')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching member subscriptions:', error);
      throw new Error(`Failed to fetch member subscriptions: ${error.message}`);
    }

    return data || [];
  }

  // ============================================================================
  // REVENUE SPLITS METHODS
  // ============================================================================

  async createRevenueSplit(data: Omit<RevenueSplit, 'id' | 'creator_percentage' | 'created_at' | 'updated_at'>): Promise<RevenueSplit> {
    const { data: result, error } = await supabase
      .from('revenue_splits')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating revenue split:', error);
      throw new Error(`Failed to create revenue split: ${error.message}`);
    }

    return result;
  }

  async getRevenueSplitByCommunity(communityId: string): Promise<RevenueSplit | null> {
    const { data, error } = await supabase
      .from('revenue_splits')
      .select('*')
      .eq('community_id', communityId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching revenue split:', error);
      throw new Error(`Failed to fetch revenue split: ${error.message}`);
    }

    return data;
  }

  async updateRevenueSplit(id: string, updates: Partial<RevenueSplit>): Promise<RevenueSplit> {
    const { data, error } = await supabase
      .from('revenue_splits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating revenue split:', error);
      throw new Error(`Failed to update revenue split: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // PAYMENT TRANSACTIONS METHODS
  // ============================================================================

  async createPaymentTransaction(data: Omit<PaymentTransaction, 'id' | 'created_at'>): Promise<PaymentTransaction> {
    const { data: result, error } = await supabase
      .from('payment_transactions')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment transaction:', error);
      throw new Error(`Failed to create payment transaction: ${error.message}`);
    }

    return result;
  }

  async getPaymentTransactionsByCommunity(communityId: string, limit = 50): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching payment transactions:', error);
      throw new Error(`Failed to fetch payment transactions: ${error.message}`);
    }

    return data || [];
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment transaction:', error);
      throw new Error(`Failed to update payment transaction: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // STRIPE WEBHOOKS METHODS
  // ============================================================================

  async createStripeWebhook(data: Omit<StripeWebhook, 'id' | 'created_at'>): Promise<StripeWebhook> {
    const { data: result, error } = await supabase
      .from('stripe_webhooks')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating stripe webhook:', error);
      throw new Error(`Failed to create stripe webhook: ${error.message}`);
    }

    return result;
  }

  async getStripeWebhookByEventId(eventId: string): Promise<StripeWebhook | null> {
    const { data, error } = await supabase
      .from('stripe_webhooks')
      .select('*')
      .eq('stripe_event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching stripe webhook:', error);
      throw new Error(`Failed to fetch stripe webhook: ${error.message}`);
    }

    return data;
  }

  async updateStripeWebhook(id: string, updates: Partial<StripeWebhook>): Promise<StripeWebhook> {
    const { data, error } = await supabase
      .from('stripe_webhooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating stripe webhook:', error);
      throw new Error(`Failed to update stripe webhook: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // COMMUNITY METHODS WITH STRIPE FIELDS
  // ============================================================================

  async updateCommunityStripeFields(communityId: string, updates: {
    stripe_account_id?: string;
    stripe_onboarding_completed?: boolean;
    stripe_onboarding_url?: string;
  }): Promise<CommunityWithStripe> {
    const { data, error } = await supabase
      .from('communities')
      .update(updates)
      .eq('id', communityId)
      .select()
      .single();

    if (error) {
      console.error('Error updating community stripe fields:', error);
      throw new Error(`Failed to update community stripe fields: ${error.message}`);
    }

    return data;
  }

  async getCommunityWithStripe(communityId: string): Promise<CommunityWithStripe | null> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching community with stripe:', error);
      throw new Error(`Failed to fetch community: ${error.message}`);
    }

    return data;
  }

  // ============================================================================
  // SUBSCRIPTION PLANS METHODS WITH STRIPE FIELDS
  // ============================================================================

  async updateSubscriptionPlanStripeFields(planId: string, updates: {
    stripe_price_id?: string;
    stripe_product_id?: string;
  }): Promise<SubscriptionPlanWithStripe> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription plan stripe fields:', error);
      throw new Error(`Failed to update subscription plan stripe fields: ${error.message}`);
    }

    return data;
  }

  async getSubscriptionPlansWithStripe(communityId: string): Promise<SubscriptionPlanWithStripe[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('community_id', communityId)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching subscription plans with stripe:', error);
      throw new Error(`Failed to fetch subscription plans: ${error.message}`);
    }

    return data || [];
  }

  // ============================================================================
  // ANALYTICS METHODS
  // ============================================================================

  async getRevenueAnalytics(communityId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('community_id', communityId)
      .eq('status', 'succeeded')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      console.error('Error fetching revenue analytics:', error);
      throw new Error(`Failed to fetch revenue analytics: ${error.message}`);
    }

    const transactions = data || [];
    
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const platformRevenue = transactions.reduce((sum, t) => sum + (t.platform_amount || 0), 0);
    const creatorRevenue = transactions.reduce((sum, t) => sum + (t.creator_amount || 0), 0);

    return {
      total_revenue: totalRevenue,
      platform_revenue: platformRevenue,
      creator_revenue: creatorRevenue,
      transaction_count: transactions.length,
      period_start: startDate,
      period_end: endDate,
      currency: 'brl'
    };
  }
}

export default new StripeRepository(); 