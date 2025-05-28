import { Request, Response } from 'express';
import StripeService from '@/services/StripeService';
import StripeRepository from '@/api/repositories/StripeRepository';
import { CreateMemberSubscriptionRequest } from '@/types/stripe.types';

/**
 * GET /api/stripe/member/plans/:communityId
 * Get subscription plans for a community
 */
export async function getCommunityPlans(req: Request, res: Response) {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    // Get subscription plans with Stripe data
    const plans = await StripeRepository.getSubscriptionPlansWithStripe(communityId);
    
    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Error fetching community plans:', error);
    res.status(500).json({ 
      error: 'Failed to fetch community plans',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * POST /api/stripe/member/subscribe
 * Create a member subscription checkout session
 */
export async function createMemberSubscription(req: Request, res: Response) {
  try {
    const { community_id, user_id, plan_id, trial_period_days } = req.body as CreateMemberSubscriptionRequest;

    if (!community_id || !user_id || !plan_id) {
      return res.status(400).json({ error: 'Community ID, user ID, and plan ID are required' });
    }

    // Check if user already has an active subscription to this community
    const existingSubscription = await StripeRepository.getMemberSubscription(community_id, user_id);
    if (existingSubscription && existingSubscription.status === 'active') {
      return res.status(400).json({ 
        error: 'User already has an active subscription to this community',
        subscription_id: existingSubscription.stripe_subscription_id 
      });
    }

    // Verify community has Stripe Connect account
    const stripeAccount = await StripeRepository.getStripeAccountByCommunity(community_id);
    if (!stripeAccount || !stripeAccount.charges_enabled) {
      return res.status(400).json({ 
        error: 'Community payment processing is not set up or not verified' 
      });
    }

    // Create checkout session
    const checkoutSession = await StripeService.createMemberSubscription({
      community_id,
      user_id,
      plan_id,
      trial_period_days
    });

    res.json({
      success: true,
      data: checkoutSession
    });

  } catch (error) {
    console.error('Error creating member subscription:', error);
    res.status(500).json({ 
      error: 'Failed to create member subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/stripe/member/subscription/:communityId/:userId
 * Get member subscription status
 */
export async function getMemberSubscription(req: Request, res: Response) {
  try {
    const { communityId, userId } = req.params;

    if (!communityId || !userId) {
      return res.status(400).json({ error: 'Community ID and user ID are required' });
    }

    const subscription = await StripeRepository.getMemberSubscription(communityId, userId);
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found for this user in this community' });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error getting member subscription:', error);
    res.status(500).json({ 
      error: 'Failed to get member subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/stripe/member/subscriptions/:communityId
 * Get all member subscriptions for a community (creator view)
 */
export async function getCommunitySubscriptions(req: Request, res: Response) {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    const subscriptions = await StripeRepository.getMemberSubscriptionsByCommunity(communityId);
    
    res.json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error('Error getting community subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to get community subscriptions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * PUT /api/stripe/member/subscription/:subscriptionId/change
 * Change member subscription plan
 */
export async function changeMemberSubscription(req: Request, res: Response) {
  try {
    const { subscriptionId } = req.params;
    const { new_plan_id } = req.body;

    if (!subscriptionId || !new_plan_id) {
      return res.status(400).json({ error: 'Subscription ID and new plan ID are required' });
    }

    // TODO: Implement plan change logic with Stripe
    // This would involve updating the subscription in Stripe and our database
    
    res.json({
      success: true,
      message: 'Member subscription plan change functionality will be implemented'
    });

  } catch (error) {
    console.error('Error changing member subscription:', error);
    res.status(500).json({ 
      error: 'Failed to change member subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * DELETE /api/stripe/member/subscription/:subscriptionId/cancel
 * Cancel member subscription
 */
export async function cancelMemberSubscription(req: Request, res: Response) {
  try {
    const { subscriptionId } = req.params;
    const { cancel_at_period_end = true } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    // TODO: Implement cancellation logic with Stripe
    // This would involve canceling the subscription in Stripe and updating our database
    
    res.json({
      success: true,
      message: 'Member subscription cancellation functionality will be implemented'
    });

  } catch (error) {
    console.error('Error canceling member subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel member subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * POST /api/stripe/member/plans/:communityId/sync
 * Sync community subscription plans with Stripe
 */
export async function syncCommunityPlansWithStripe(req: Request, res: Response) {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    // Get community Stripe account
    const stripeAccount = await StripeRepository.getStripeAccountByCommunity(communityId);
    if (!stripeAccount) {
      return res.status(400).json({ error: 'Community does not have a Stripe account' });
    }

    // Get local subscription plans
    const localPlans = await StripeRepository.getSubscriptionPlansWithStripe(communityId);
    
    // Sync each plan with Stripe
    const syncedPlans = await StripeService.syncCommunityPlansWithStripe(
      communityId, 
      stripeAccount.stripe_account_id, 
      localPlans
    );

    res.json({
      success: true,
      data: syncedPlans,
      message: `Synced ${syncedPlans.length} plans with Stripe`
    });

  } catch (error) {
    console.error('Error syncing plans with Stripe:', error);
    res.status(500).json({ 
      error: 'Failed to sync plans with Stripe',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 