import Stripe from 'stripe';
import { 
  StripeAccount, 
  PlatformSubscription, 
  MemberSubscription, 
  RevenueSplit,
  PaymentTransaction,
  StripeConnectOnboardingData,
  StripeAccountStatus,
  StripePlatformPlan,
  StripeCheckoutSession,
  CreatePlatformSubscriptionRequest,
  CreateMemberSubscriptionRequest,
  UpdateRevenueSplitRequest,
  StripeConnectOnboardingRequest
} from '@/types/stripe.types';

class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Stripe secret key is required');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil',
      typescript: true,
    });

    this.webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  // ============================================================================
  // STRIPE CONNECT METHODS
  // ============================================================================

  /**
   * Create a Stripe Connect Express account for a creator
   */
  async createConnectAccount(data: StripeConnectOnboardingRequest): Promise<StripeConnectOnboardingData> {
    try {
      // Create the Express account
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: data.country || 'BR',
        email: data.email,
        business_type: data.business_type as any,
        metadata: {
          community_id: data.community_id,
        },
      });

      // Create account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: data.refresh_url,
        return_url: data.return_url,
        type: 'account_onboarding',
      });

      return {
        account_id: account.id,
        onboarding_url: accountLink.url,
        refresh_url: data.refresh_url,
        return_url: data.return_url,
      };
    } catch (error) {
      console.error('Error creating Stripe Connect account:', error);
      throw new Error(`Failed to create Stripe Connect account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the status of a Stripe Connect account
   */
  async getAccountStatus(accountId: string): Promise<StripeAccountStatus> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);

      return {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        verification_status: this.getVerificationStatus(account),
        requirements: {
          currently_due: account.requirements?.currently_due || [],
          eventually_due: account.requirements?.eventually_due || [],
          past_due: account.requirements?.past_due || [],
          pending_verification: account.requirements?.pending_verification || [],
        },
        capabilities: account.capabilities || {},
      };
    } catch (error) {
      console.error('Error getting account status:', error);
      throw new Error(`Failed to get account status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new account link for re-onboarding
   */
  async createAccountLink(accountId: string, returnUrl: string, refreshUrl: string): Promise<string> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink.url;
    } catch (error) {
      console.error('Error creating account link:', error);
      throw new Error(`Failed to create account link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // PLATFORM SUBSCRIPTION METHODS (Platform → Creator)
  // ============================================================================

  /**
   * Create platform subscription plans in Stripe
   */
  async createPlatformPlans(): Promise<StripePlatformPlan[]> {
    const plans = [
      {
        name: 'Basic Creator',
        description: 'Para creators iniciantes',
        amount: 2900, // R$ 29.00
        interval: 'month' as const,
        trial_period_days: 7,
        features: ['Até 100 membros', 'Suporte básico', 'Dashboard básico'],
      },
      {
        name: 'Pro Creator',
        description: 'Para creators profissionais',
        amount: 9900, // R$ 99.00
        interval: 'month' as const,
        trial_period_days: 14,
        features: ['Até 1000 membros', 'Suporte prioritário', 'Analytics avançados', 'Integrações'],
      },
      {
        name: 'Enterprise Creator',
        description: 'Para creators enterprise',
        amount: 29900, // R$ 299.00
        interval: 'month' as const,
        trial_period_days: 30,
        features: ['Membros ilimitados', 'Suporte 24/7', 'Recursos customizados', 'Account manager'],
      },
    ];

    const createdPlans: StripePlatformPlan[] = [];

    for (const plan of plans) {
      try {
        // Create product
        const product = await this.stripe.products.create({
          name: plan.name,
          description: plan.description,
          metadata: {
            type: 'platform_subscription',
            features: JSON.stringify(plan.features),
          },
        });

        // Create price
        const price = await this.stripe.prices.create({
          product: product.id,
          unit_amount: plan.amount,
          currency: 'brl',
          recurring: {
            interval: plan.interval,
            trial_period_days: plan.trial_period_days,
          },
          metadata: {
            type: 'platform_subscription',
          },
        });

        createdPlans.push({
          id: price.id,
          product_id: product.id,
          name: plan.name,
          description: plan.description,
          amount: plan.amount,
          currency: 'brl',
          interval: plan.interval,
          trial_period_days: plan.trial_period_days,
          features: plan.features,
          metadata: {
            type: 'platform_subscription',
          },
        });
      } catch (error) {
        console.error(`Error creating platform plan ${plan.name}:`, error);
      }
    }

    return createdPlans;
  }

  /**
   * Create a platform subscription for a creator
   */
  async createPlatformSubscription(data: CreatePlatformSubscriptionRequest): Promise<StripeCheckoutSession> {
    try {
      // Get community info for customer creation
      const { default: StripeRepository } = await import('@/api/repositories/StripeRepository');
      const community = await StripeRepository.getCommunityWithStripe(data.community_id);
      
      if (!community) {
        throw new Error('Community not found');
      }

      // Create or retrieve customer using community creator email
      const customer = await this.createOrGetCustomer(data.community_id, community.creator_id);

      // Get base URL from environment
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Create checkout session
      const session = await this.stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: data.plan_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/settings/billing?canceled=true`,
        metadata: {
          community_id: data.community_id,
          subscription_type: 'platform',
        },
        subscription_data: {
          trial_period_days: data.trial_period_days,
          metadata: {
            community_id: data.community_id,
            subscription_type: 'platform',
          },
        },
      });

      return {
        id: session.id,
        url: session.url!,
        customer_id: customer.id,
        payment_status: session.payment_status,
        metadata: session.metadata || {},
      };
    } catch (error) {
      console.error('Error creating platform subscription:', error);
      throw new Error(`Failed to create platform subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // MEMBER SUBSCRIPTION METHODS (Creator → Members)
  // ============================================================================

  /**
   * Sync community subscription plans with Stripe
   */
  async syncCommunityPlansWithStripe(
    communityId: string, 
    stripeAccountId: string, 
    localPlans: any[]
  ): Promise<any[]> {
    const syncedPlans = [];

    for (const plan of localPlans) {
      try {
        // Skip if already has Stripe IDs
        if (plan.stripe_product_id && plan.stripe_price_id) {
          syncedPlans.push(plan);
          continue;
        }

        // Create product in Stripe Connect account
        const product = await this.stripe.products.create({
          name: plan.name,
          description: plan.description || '',
          metadata: {
            community_id: communityId,
            local_plan_id: plan.id,
          },
        }, {
          stripeAccount: stripeAccountId,
        });

        // Create price in Stripe Connect account
        const price = await this.stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(plan.price * 100), // Convert to cents
          currency: 'brl',
          recurring: {
            interval: plan.billing_interval === 'yearly' ? 'year' : 'month',
          },
          metadata: {
            community_id: communityId,
            local_plan_id: plan.id,
          },
        }, {
          stripeAccount: stripeAccountId,
        });

        // Update local plan with Stripe IDs
        const { default: StripeRepository } = await import('@/api/repositories/StripeRepository');
        await StripeRepository.updateSubscriptionPlanStripeFields(plan.id, {
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        });

        syncedPlans.push({
          ...plan,
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        });

      } catch (error) {
        console.error(`Error syncing plan ${plan.id}:`, error);
      }
    }

    return syncedPlans;
  }

  /**
   * Create a member subscription checkout session
   */
  async createMemberSubscription(data: CreateMemberSubscriptionRequest): Promise<StripeCheckoutSession> {
    try {
      // Get the community's Stripe account
      const communityAccount = await this.getCommunityStripeAccount(data.community_id);
      if (!communityAccount) {
        throw new Error('Community does not have a Stripe account configured');
      }

      // Get the subscription plan details
      const { default: StripeRepository } = await import('@/api/repositories/StripeRepository');
      const plans = await StripeRepository.getSubscriptionPlansWithStripe(data.community_id);
      const selectedPlan = plans.find(p => p.id === data.plan_id);
      
      if (!selectedPlan) {
        throw new Error('Subscription plan not found');
      }

      if (!selectedPlan.stripe_price_id) {
        throw new Error('Subscription plan is not synced with Stripe. Please sync plans first.');
      }

      // Create or retrieve customer in the Connect account
      const customer = await this.createOrGetCustomerInConnectAccount(
        data.user_id, 
        communityAccount.stripe_account_id
      );

      // Get revenue split configuration
      const revenueSplit = await this.getRevenueSplit(data.community_id);
      const applicationFeePercent = revenueSplit?.platform_percentage || 10;

      // Get base URL from environment
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Create checkout session with application fee
      const session = await this.stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: selectedPlan.stripe_price_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/community/${data.community_id}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/community/${data.community_id}/plans?canceled=true`,
        metadata: {
          community_id: data.community_id,
          user_id: data.user_id,
          subscription_type: 'member',
          plan_id: data.plan_id, // Local plan ID for webhook processing
        },
        subscription_data: {
          application_fee_percent: applicationFeePercent,
          trial_period_days: data.trial_period_days,
          metadata: {
            community_id: data.community_id,
            user_id: data.user_id,
            subscription_type: 'member',
            plan_id: data.plan_id, // Local plan ID for webhook processing
          },
        },
      }, {
        stripeAccount: communityAccount.stripe_account_id,
      });

      return {
        id: session.id,
        url: session.url!,
        customer_id: customer.id,
        payment_status: session.payment_status,
        metadata: session.metadata || {},
      };
    } catch (error) {
      console.error('Error creating member subscription:', error);
      throw new Error(`Failed to create member subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // WEBHOOK METHODS
  // ============================================================================

  /**
   * Verify and parse webhook event
   */
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Create or get existing customer
   */
  private async createOrGetCustomer(identifier: string, email?: string): Promise<Stripe.Customer> {
    try {
      // Try to find existing customer
      const existingCustomers = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      return await this.stripe.customers.create({
        email: email,
        metadata: {
          identifier: identifier,
        },
      });
    } catch (error) {
      console.error('Error creating/getting customer:', error);
      throw error;
    }
  }

  /**
   * Create or get existing customer in Connect account
   */
  private async createOrGetCustomerInConnectAccount(
    userId: string, 
    stripeAccountId: string
  ): Promise<Stripe.Customer> {
    try {
      // Try to find existing customer in Connect account
      const existingCustomers = await this.stripe.customers.list({
        limit: 1,
      }, {
        stripeAccount: stripeAccountId,
      });

      // Check if any customer has our user ID in metadata
      const existingCustomer = existingCustomers.data.find(
        customer => customer.metadata?.user_id === userId
      );

      if (existingCustomer) {
        return existingCustomer;
      }

      // Create new customer in Connect account
      return await this.stripe.customers.create({
        metadata: {
          user_id: userId,
        },
      }, {
        stripeAccount: stripeAccountId,
      });
    } catch (error) {
      console.error('Error creating/getting customer in Connect account:', error);
      throw error;
    }
  }

  /**
   * Get verification status from Stripe account
   */
  private getVerificationStatus(account: Stripe.Account): string {
    if (!account.charges_enabled || !account.payouts_enabled) {
      return 'pending';
    }

    if (account.requirements?.currently_due?.length || account.requirements?.past_due?.length) {
      return 'restricted';
    }

    return 'verified';
  }

  /**
   * Get community Stripe account
   */
  private async getCommunityStripeAccount(communityId: string): Promise<StripeAccount | null> {
    const { default: StripeRepository } = await import('@/api/repositories/StripeRepository');
    return await StripeRepository.getStripeAccountByCommunity(communityId);
  }

  /**
   * Get revenue split configuration
   */
  private async getRevenueSplit(communityId: string): Promise<RevenueSplit | null> {
    const { default: StripeRepository } = await import('@/api/repositories/StripeRepository');
    return await StripeRepository.getRevenueSplitByCommunity(communityId);
  }
}

export default new StripeService(); 