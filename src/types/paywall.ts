// Types for the Paywall system

export type PaymentGatewayType = 'stripe' | 'paypal' | string;

export interface PaymentGatewayConfig {
  enabled: boolean;
  isDefault: boolean;
  // Fields specific to each gateway
  apiKey?: string;
  webhookSecret?: string;
  clientId?: string;
  clientSecret?: string;
  merchantId?: string;
  [key: string]: any; // For additional fields from new gateways
}

export interface PaywallMessageSettings {
  title: string;
  description: string;
  ctaText: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface PaywallSettings {
  activeTemplate: string;
  activeGateways: PaymentGatewayType[];
  gatewayConfigs: {
    [key in PaymentGatewayType]?: PaymentGatewayConfig;
  };
  messageSettings: PaywallMessageSettings;
}

export interface PaywallTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  layout: 'modal' | 'inline' | 'sidebar' | 'fullscreen';
  customCss?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
  gatewayProductIds?: {
    [key in PaymentGatewayType]?: string;
  };
}

export interface CheckoutOptions {
  planId: string;
  gatewayId?: PaymentGatewayType; // Allows user to choose gateway at checkout
  successRedirectUrl?: string;
  cancelRedirectUrl?: string;
}

export interface SubscriptionStatus {
  active: boolean;
  planId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  gateway?: PaymentGatewayType;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: Date;
  gateway: PaymentGatewayType;
  description: string;
  invoiceUrl?: string;
} 