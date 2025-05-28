// Stripe Integration Types
// Generated from database schema

export interface StripeAccount {
  id: string;
  community_id: string;
  stripe_account_id: string;
  account_type: 'express' | 'standard' | 'custom';
  country: string;
  email?: string;
  business_type?: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'restricted';
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: Record<string, any>;
  capabilities: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PlatformSubscription {
  id: string;
  community_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_id: string; // Stripe price ID
  plan_name: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  amount: number;
  currency: string;
  interval_type: 'month' | 'year';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MemberSubscription {
  id: string;
  community_id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_id: string; // References subscription_plans.id
  stripe_price_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  amount: number;
  currency: string;
  interval_type: 'month' | 'year';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RevenueSplit {
  id: string;
  community_id: string;
  platform_percentage: number;
  creator_percentage: number; // Generated column
  is_active: boolean;
  effective_from: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  community_id: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  subscription_id?: string;
  subscription_type?: 'platform' | 'member';
  transaction_type: 'payment' | 'refund' | 'chargeback' | 'split';
  amount: number;
  currency: string;
  platform_amount?: number;
  creator_amount?: number;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  failure_reason?: string;
  metadata: Record<string, any>;
  processed_at?: string;
  created_at: string;
}

export interface StripeWebhook {
  id: string;
  stripe_event_id: string;
  event_type: string;
  api_version?: string;
  data: Record<string, any>;
  processed: boolean;
  processing_attempts: number;
  last_processing_error?: string;
  created_at: string;
  processed_at?: string;
}

// Extended types for existing tables with Stripe fields
export interface CommunityWithStripe {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  domain?: string;
  creator_id: string;
  owner_id: string;
  stripe_account_id?: string;
  stripe_onboarding_completed: boolean;
  stripe_onboarding_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanWithStripe {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  price: number;
  interval: string;
  features: string[];
  is_active: boolean;
  trial_days?: number;
  max_members?: number;
  stripe_price_id?: string;
  stripe_product_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMemberWithStripe {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  status: string;
  subscription_plan_id?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// Stripe API related types
export interface StripeConnectOnboardingData {
  account_id: string;
  onboarding_url: string;
  refresh_url?: string;
  return_url?: string;
}

export interface StripeAccountStatus {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  verification_status: string;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
  capabilities: Record<string, any>;
}

export interface StripePlatformPlan {
  id: string; // Stripe price ID
  product_id: string; // Stripe product ID
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  trial_period_days?: number;
  features: string[];
  metadata: Record<string, any>;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  customer_id?: string;
  subscription_id?: string;
  payment_status: string;
  metadata: Record<string, any>;
}

export interface RevenueAnalytics {
  total_revenue: number;
  platform_revenue: number;
  creator_revenue: number;
  transaction_count: number;
  active_subscriptions: number;
  period_start: string;
  period_end: string;
  currency: string;
}

// Webhook event types
export type StripeWebhookEventType = 
  | 'account.updated'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.succeeded'
  | 'charge.failed'
  | 'charge.dispute.created';

export interface StripeWebhookEvent {
  id: string;
  type: StripeWebhookEventType;
  api_version: string;
  created: number;
  data: {
    object: any;
    previous_attributes?: any;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key?: string;
  };
}

// Form types for UI
export interface CreatePlatformSubscriptionRequest {
  community_id: string;
  plan_id: string;
  payment_method_id?: string;
  trial_period_days?: number;
}

export interface CreateMemberSubscriptionRequest {
  community_id: string;
  plan_id: string;
  user_id: string;
  payment_method_id?: string;
  trial_period_days?: number;
}

export interface UpdateRevenueSplitRequest {
  community_id: string;
  platform_percentage: number;
}

export interface StripeConnectOnboardingRequest {
  community_id: string;
  country?: string;
  business_type?: string;
  email?: string;
  return_url: string;
  refresh_url: string;
} 