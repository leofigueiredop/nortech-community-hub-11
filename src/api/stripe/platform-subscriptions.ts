import { Request, Response } from 'express';
import StripeService from '@/services/StripeService';
import StripeRepository from '@/api/repositories/StripeRepository';
import { CreatePlatformSubscriptionRequest } from '@/types/stripe.types';

/**
 * GET /api/stripe/platform/plans
 * Get available platform subscription plans
 */
export async function getPlatformPlans(req: Request, res: Response) {
  try {
    // Get platform plans from Stripe
    const plans = await StripeService.createPlatformPlans();
    
    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Error fetching platform plans:', error);
    res.status(500).json({ 
      error: 'Failed to fetch platform plans',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * POST /api/stripe/platform/subscribe
 * Create a platform subscription for a creator
 */
export async function createPlatformSubscription(req: Request, res: Response) {
  try {
    const { community_id, plan_id, trial_period_days } = req.body as CreatePlatformSubscriptionRequest;

    if (!community_id || !plan_id) {
      return res.status(400).json({ error: 'Community ID and plan ID are required' });
    }

    // Check if community already has an active platform subscription
    const existingSubscription = await StripeRepository.getPlatformSubscriptionByCommunity(community_id);
    if (existingSubscription) {
      return res.status(400).json({ 
        error: 'Community already has an active platform subscription',
        subscription_id: existingSubscription.stripe_subscription_id 
      });
    }

    // Create checkout session
    const checkoutSession = await StripeService.createPlatformSubscription({
      community_id,
      plan_id,
      trial_period_days
    });

    res.json({
      success: true,
      data: checkoutSession
    });

  } catch (error) {
    console.error('Error creating platform subscription:', error);
    res.status(500).json({ 
      error: 'Failed to create platform subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/stripe/platform/subscription/:communityId
 * Get platform subscription status for a community
 */
export async function getPlatformSubscription(req: Request, res: Response) {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    const subscription = await StripeRepository.getPlatformSubscriptionByCommunity(communityId);
    
    if (!subscription) {
      return res.status(404).json({ error: 'No platform subscription found for this community' });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error getting platform subscription:', error);
    res.status(500).json({ 
      error: 'Failed to get platform subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * PUT /api/stripe/platform/subscription/:subscriptionId/change
 * Change platform subscription plan
 */
export async function changePlatformSubscription(req: Request, res: Response) {
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
      message: 'Plan change functionality will be implemented'
    });

  } catch (error) {
    console.error('Error changing platform subscription:', error);
    res.status(500).json({ 
      error: 'Failed to change platform subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * DELETE /api/stripe/platform/subscription/:subscriptionId/cancel
 * Cancel platform subscription
 */
export async function cancelPlatformSubscription(req: Request, res: Response) {
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
      message: 'Subscription cancellation functionality will be implemented'
    });

  } catch (error) {
    console.error('Error canceling platform subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel platform subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 