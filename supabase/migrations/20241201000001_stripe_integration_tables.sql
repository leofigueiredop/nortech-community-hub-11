-- Stripe Integration Tables Migration
-- Created: 2024-12-01
-- Purpose: Add tables for Stripe Connect, subscriptions, and revenue splits

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Stripe Accounts table (for Stripe Connect accounts)
CREATE TABLE IF NOT EXISTS stripe_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'express' CHECK (account_type IN ('express', 'standard', 'custom')),
  country TEXT NOT NULL DEFAULT 'BR',
  email TEXT,
  business_type TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'restricted')),
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  requirements JSONB DEFAULT '{}',
  capabilities JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Platform Subscriptions table (creators paying the platform)
CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL, -- Stripe price ID
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  interval_type TEXT NOT NULL CHECK (interval_type IN ('month', 'year')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Member Subscriptions table (members paying creators)
CREATE TABLE IF NOT EXISTS member_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  interval_type TEXT NOT NULL CHECK (interval_type IN ('month', 'year')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 4. Revenue Splits table (configuration for platform percentage)
CREATE TABLE IF NOT EXISTS revenue_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE UNIQUE,
  platform_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00 CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  creator_percentage DECIMAL(5,2) GENERATED ALWAYS AS (100.00 - platform_percentage) STORED,
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Payment Transactions table (transaction history)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  subscription_id UUID, -- Can reference either platform_subscriptions or member_subscriptions
  subscription_type TEXT CHECK (subscription_type IN ('platform', 'member')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'chargeback', 'split')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  platform_amount DECIMAL(10,2),
  creator_amount DECIMAL(10,2),
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Stripe Webhooks table (webhook event logging)
CREATE TABLE IF NOT EXISTS stripe_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  api_version TEXT,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_attempts INTEGER DEFAULT 0,
  last_processing_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Update existing tables with Stripe fields

-- Add Stripe fields to communities table
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_onboarding_url TEXT;

-- Add Stripe fields to subscription_plans table
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

-- Add Stripe fields to community_members table
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_community_id ON stripe_accounts(community_id);
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_stripe_account_id ON stripe_accounts(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_community_id ON platform_subscriptions(community_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_stripe_subscription_id ON platform_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_community_id ON member_subscriptions(community_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_user_id ON member_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_stripe_subscription_id ON member_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_community_id ON payment_transactions(community_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_payment_intent_id ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_stripe_event_id ON stripe_webhooks(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_event_type ON stripe_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_processed ON stripe_webhooks(processed);

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stripe_accounts_updated_at BEFORE UPDATE ON stripe_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_subscriptions_updated_at BEFORE UPDATE ON platform_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_member_subscriptions_updated_at BEFORE UPDATE ON member_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenue_splits_updated_at BEFORE UPDATE ON revenue_splits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Stripe Accounts policies
CREATE POLICY "Users can view stripe accounts for their communities" ON stripe_accounts
  FOR SELECT USING (
    community_id IN (
      SELECT community_id FROM community_members 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Community owners can manage stripe accounts" ON stripe_accounts
  FOR ALL USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE owner_id = auth.uid()::text
    )
  );

-- Platform Subscriptions policies
CREATE POLICY "Community owners can view their platform subscriptions" ON platform_subscriptions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE owner_id = auth.uid()::text
    )
  );

-- Member Subscriptions policies
CREATE POLICY "Users can view their own member subscriptions" ON member_subscriptions
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Community owners can view member subscriptions for their communities" ON member_subscriptions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE owner_id = auth.uid()::text
    )
  );

-- Revenue Splits policies
CREATE POLICY "Community owners can manage revenue splits" ON revenue_splits
  FOR ALL USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE owner_id = auth.uid()::text
    )
  );

-- Payment Transactions policies
CREATE POLICY "Community owners can view payment transactions" ON payment_transactions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE owner_id = auth.uid()::text
    )
  );

-- Stripe Webhooks policies (admin only)
CREATE POLICY "Service role can manage webhooks" ON stripe_webhooks
  FOR ALL USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE stripe_accounts IS 'Stores Stripe Connect account information for creators';
COMMENT ON TABLE platform_subscriptions IS 'Tracks creator subscriptions to the platform';
COMMENT ON TABLE member_subscriptions IS 'Tracks member subscriptions to creator communities';
COMMENT ON TABLE revenue_splits IS 'Configuration for revenue split percentages';
COMMENT ON TABLE payment_transactions IS 'Complete transaction history and splits';
COMMENT ON TABLE stripe_webhooks IS 'Webhook event logging for debugging and reliability'; 