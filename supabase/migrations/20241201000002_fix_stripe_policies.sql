-- Fix Stripe Integration Policies
-- Created: 2024-12-01
-- Purpose: Fix type casting issues in RLS policies

-- Drop existing policies that might have type issues
DROP POLICY IF EXISTS "Users can view stripe accounts for their communities" ON stripe_accounts;
DROP POLICY IF EXISTS "Community owners can manage stripe accounts" ON stripe_accounts;
DROP POLICY IF EXISTS "Community owners can view their platform subscriptions" ON platform_subscriptions;
DROP POLICY IF EXISTS "Users can view their own member subscriptions" ON member_subscriptions;
DROP POLICY IF EXISTS "Community owners can view member subscriptions for their communities" ON member_subscriptions;
DROP POLICY IF EXISTS "Community owners can manage revenue splits" ON revenue_splits;
DROP POLICY IF EXISTS "Community owners can view payment transactions" ON payment_transactions;

-- Recreate policies with proper type casting

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
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

-- Platform Subscriptions policies
CREATE POLICY "Community owners can view their platform subscriptions" ON platform_subscriptions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

CREATE POLICY "Community owners can manage their platform subscriptions" ON platform_subscriptions
  FOR ALL USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

-- Member Subscriptions policies
CREATE POLICY "Users can view their own member subscriptions" ON member_subscriptions
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Community owners can view member subscriptions for their communities" ON member_subscriptions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

-- Revenue Splits policies
CREATE POLICY "Community owners can manage revenue splits" ON revenue_splits
  FOR ALL USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

-- Payment Transactions policies
CREATE POLICY "Community owners can view payment transactions" ON payment_transactions
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE creator_id = auth.uid()::text OR owner_id = auth.uid()::text
    )
  );

-- Add policy for service role to manage all Stripe data
CREATE POLICY "Service role can manage all stripe data" ON stripe_accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all platform subscriptions" ON platform_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all member subscriptions" ON member_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all revenue splits" ON revenue_splits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all payment transactions" ON payment_transactions
  FOR ALL USING (auth.role() = 'service_role'); 