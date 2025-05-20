import { SupabaseClient } from '@supabase/supabase-js';
import { IPaywallRepository } from '../interfaces/IPaywallRepository';
import { 
  PaywallSettings, 
  PaywallTemplate, 
  PaymentPlan,
  CheckoutOptions,
  SubscriptionStatus,
  PaymentMethod,
  PaymentHistory
} from '../../types/paywall';

export class SupabasePaywallRepository implements IPaywallRepository {
  private supabase: SupabaseClient;
  private communityId: string;

  constructor(supabase: SupabaseClient, communityId: string) {
    this.supabase = supabase;
    this.communityId = communityId;
  }

  // Paywall Settings
  async getSettings(): Promise<PaywallSettings | null> {
    try {
      const { data, error } = await this.supabase
        .from('paywall_settings')
        .select('*')
        .eq('community_id', this.communityId)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return this.mapDbSettingsToModel(data);
    } catch (error) {
      console.error('Error fetching paywall settings:', error);
      return null;
    }
  }

  async updateSettings(settings: PaywallSettings): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('paywall_settings')
        .upsert({
          community_id: this.communityId,
          active_template: settings.activeTemplate,
          active_gateways: settings.activeGateways,
          gateway_configs: settings.gatewayConfigs,
          message_settings: settings.messageSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating paywall settings:', error);
      throw error;
    }
  }

  // Paywall Templates
  async getTemplates(): Promise<PaywallTemplate[]> {
    try {
      const { data, error } = await this.supabase
        .from('paywall_templates')
        .select('*')
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(this.mapDbTemplateToModel);
    } catch (error) {
      console.error('Error fetching paywall templates:', error);
      return [];
    }
  }

  async createTemplate(template: Omit<PaywallTemplate, 'id'>): Promise<PaywallTemplate> {
    try {
      const { data, error } = await this.supabase
        .from('paywall_templates')
        .insert({
          community_id: this.communityId,
          name: template.name,
          description: template.description,
          preview_image: template.previewImage,
          layout: template.layout,
          custom_css: template.customCss,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      return this.mapDbTemplateToModel(data);
    } catch (error) {
      console.error('Error creating paywall template:', error);
      throw error;
    }
  }

  async updateTemplate(id: string, template: Partial<PaywallTemplate>): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (template.name) updateData.name = template.name;
      if (template.description) updateData.description = template.description;
      if (template.previewImage) updateData.preview_image = template.previewImage;
      if (template.layout) updateData.layout = template.layout;
      if (template.customCss) updateData.custom_css = template.customCss;

      const { error } = await this.supabase
        .from('paywall_templates')
        .update(updateData)
        .eq('id', id)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating paywall template:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('paywall_templates')
        .delete()
        .eq('id', id)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting paywall template:', error);
      throw error;
    }
  }

  // Payment Plans
  async getPlans(): Promise<PaymentPlan[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_plans')
        .select('*')
        .eq('community_id', this.communityId)
        .order('price', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(this.mapDbPlanToModel);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      return [];
    }
  }

  async getPlan(id: string): Promise<PaymentPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('payment_plans')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.communityId)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return this.mapDbPlanToModel(data);
    } catch (error) {
      console.error('Error fetching payment plan:', error);
      return null;
    }
  }

  async createPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    try {
      const { data, error } = await this.supabase
        .from('payment_plans')
        .insert({
          community_id: this.communityId,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          currency: plan.currency,
          interval: plan.interval,
          features: plan.features,
          is_popular: plan.isPopular || false,
          trial_days: plan.trialDays || 0,
          gateway_product_ids: plan.gatewayProductIds || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      return this.mapDbPlanToModel(data);
    } catch (error) {
      console.error('Error creating payment plan:', error);
      throw error;
    }
  }

  async updatePlan(id: string, plan: Partial<PaymentPlan>): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (plan.name) updateData.name = plan.name;
      if (plan.description) updateData.description = plan.description;
      if (plan.price !== undefined) updateData.price = plan.price;
      if (plan.currency) updateData.currency = plan.currency;
      if (plan.interval) updateData.interval = plan.interval;
      if (plan.features) updateData.features = plan.features;
      if (plan.isPopular !== undefined) updateData.is_popular = plan.isPopular;
      if (plan.trialDays !== undefined) updateData.trial_days = plan.trialDays;
      if (plan.gatewayProductIds) updateData.gateway_product_ids = plan.gatewayProductIds;

      const { error } = await this.supabase
        .from('payment_plans')
        .update(updateData)
        .eq('id', id)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment plan:', error);
      throw error;
    }
  }

  async deletePlan(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('payment_plans')
        .delete()
        .eq('id', id)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      throw error;
    }
  }

  // Checkout and Subscriptions
  async createCheckoutSession(options: CheckoutOptions): Promise<{ url: string, sessionId: string }> {
    try {
      // This would typically call a serverless function or API endpoint to create a checkout session
      // For now, we'll simulate it by making a request to a Supabase Edge Function
      const { data, error } = await this.supabase.functions.invoke('create-checkout-session', {
        body: {
          communityId: this.communityId,
          planId: options.planId,
          gatewayId: options.gatewayId,
          successUrl: options.successRedirectUrl,
          cancelUrl: options.cancelRedirectUrl
        }
      });

      if (error) throw error;
      
      return {
        url: data.url,
        sessionId: data.sessionId
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const { data, error } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .single();

      if (error) throw error;
      
      if (!data) {
        return { active: false };
      }
      
      return {
        active: data.status === 'active',
        planId: data.plan_id,
        currentPeriodEnd: new Date(data.current_period_end),
        cancelAtPeriodEnd: data.cancel_at_period_end,
        gateway: data.gateway
      };
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return { active: false };
    }
  }

  async cancelSubscription(userId: string, immediately: boolean = false): Promise<void> {
    try {
      // This would typically call a serverless function or API endpoint to cancel a subscription
      const { error } = await this.supabase.functions.invoke('cancel-subscription', {
        body: {
          communityId: this.communityId,
          userId,
          immediately
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async resumeSubscription(userId: string): Promise<void> {
    try {
      // This would typically call a serverless function or API endpoint to resume a subscription
      const { error } = await this.supabase.functions.invoke('resume-subscription', {
        body: {
          communityId: this.communityId,
          userId
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  // Payment Methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.communityId);

      if (error) throw error;
      
      return (data || []).map(method => ({
        id: method.id,
        type: method.type,
        last4: method.last4,
        brand: method.brand,
        expiryMonth: method.expiry_month,
        expiryYear: method.expiry_year,
        isDefault: method.is_default
      }));
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      // First, set all to false
      await this.supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('community_id', this.communityId);
      
      // Then set the selected one to true
      const { error } = await this.supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      // This might need to call a server function to also delete from the payment provider
      const { error } = await this.supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .eq('community_id', this.communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Payment History
  async getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        date: new Date(payment.created_at),
        gateway: payment.gateway,
        description: payment.description,
        invoiceUrl: payment.invoice_url
      }));
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  // Helper methods for mapping DB data to models
  private mapDbSettingsToModel(data: any): PaywallSettings {
    return {
      activeTemplate: data.active_template,
      activeGateways: data.active_gateways || [],
      gatewayConfigs: data.gateway_configs || {},
      messageSettings: data.message_settings || {
        title: 'Upgrade to Premium',
        description: 'Get access to exclusive content by becoming a premium member.',
        ctaText: 'Upgrade Now'
      }
    };
  }

  private mapDbTemplateToModel(data: any): PaywallTemplate {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      previewImage: data.preview_image,
      layout: data.layout,
      customCss: data.custom_css
    };
  }

  private mapDbPlanToModel(data: any): PaymentPlan {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      interval: data.interval,
      features: data.features || [],
      isPopular: data.is_popular,
      trialDays: data.trial_days,
      gatewayProductIds: data.gateway_product_ids || {}
    };
  }
} 