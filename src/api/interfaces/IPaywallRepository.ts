import { 
  PaywallSettings, 
  PaywallTemplate, 
  PaymentPlan,
  CheckoutOptions,
  SubscriptionStatus,
  PaymentMethod,
  PaymentHistory
} from '../../types/paywall';

export interface IPaywallRepository {
  // Paywall Settings
  getSettings(): Promise<PaywallSettings | null>;
  updateSettings(settings: PaywallSettings): Promise<void>;
  
  // Paywall Templates
  getTemplates(): Promise<PaywallTemplate[]>;
  createTemplate(template: Omit<PaywallTemplate, 'id'>): Promise<PaywallTemplate>;
  updateTemplate(id: string, template: Partial<PaywallTemplate>): Promise<void>;
  deleteTemplate(id: string): Promise<void>;
  
  // Payment Plans
  getPlans(): Promise<PaymentPlan[]>;
  getPlan(id: string): Promise<PaymentPlan | null>;
  createPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan>;
  updatePlan(id: string, plan: Partial<PaymentPlan>): Promise<void>;
  deletePlan(id: string): Promise<void>;
  
  // Checkout and Subscriptions
  createCheckoutSession(options: CheckoutOptions): Promise<{ url: string, sessionId: string }>;
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;
  cancelSubscription(userId: string, immediately?: boolean): Promise<void>;
  resumeSubscription(userId: string): Promise<void>;
  
  // Payment Methods
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  
  // Payment History
  getPaymentHistory(userId: string): Promise<PaymentHistory[]>;
} 