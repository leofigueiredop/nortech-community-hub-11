import { Request, Response } from 'express';
import StripeService from '@/services/StripeService';
import StripeRepository from '@/api/repositories/StripeRepository';
import { StripeConnectOnboardingRequest } from '@/types/stripe.types';

/**
 * POST /api/stripe/connect/onboard
 * Start Stripe Connect onboarding for a creator
 */
export async function startOnboarding(req: Request, res: Response) {
  try {
    const { community_id, country, business_type, email } = req.body as StripeConnectOnboardingRequest;

    if (!community_id) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    // Check if community already has a Stripe account
    const existingAccount = await StripeRepository.getStripeAccountByCommunity(community_id);
    if (existingAccount) {
      return res.status(400).json({ 
        error: 'Community already has a Stripe account',
        account_id: existingAccount.stripe_account_id 
      });
    }

    // Create return and refresh URLs
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const return_url = `${baseUrl}/settings/billing/stripe/return?community_id=${community_id}`;
    const refresh_url = `${baseUrl}/settings/billing/stripe/refresh?community_id=${community_id}`;

    // Create Stripe Connect account
    const onboardingData = await StripeService.createConnectAccount({
      community_id,
      country: country || 'BR',
      business_type,
      email,
      return_url,
      refresh_url
    });

    // Save account to database
    await StripeRepository.createStripeAccount({
      community_id,
      stripe_account_id: onboardingData.account_id,
      account_type: 'express',
      country: country || 'BR',
      email,
      business_type,
      verification_status: 'pending',
      charges_enabled: false,
      payouts_enabled: false,
      requirements: {},
      capabilities: {},
      metadata: {}
    });

    // Update community with onboarding URL
    await StripeRepository.updateCommunityStripeFields(community_id, {
      stripe_account_id: onboardingData.account_id,
      stripe_onboarding_url: onboardingData.onboarding_url,
      stripe_onboarding_completed: false
    });

    res.json({
      success: true,
      data: onboardingData
    });

  } catch (error) {
    console.error('Error starting Stripe onboarding:', error);
    res.status(500).json({ 
      error: 'Failed to start onboarding',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/stripe/connect/status/:accountId
 * Get the status of a Stripe Connect account
 */
export async function getAccountStatus(req: Request, res: Response) {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

    // Get status from Stripe
    const status = await StripeService.getAccountStatus(accountId);

    // Update local database with latest status
    const localAccount = await StripeRepository.getStripeAccountByStripeId(accountId);
    if (localAccount) {
      await StripeRepository.updateStripeAccount(localAccount.id, {
        verification_status: status.verification_status as 'pending' | 'verified' | 'rejected' | 'restricted',
        charges_enabled: status.charges_enabled,
        payouts_enabled: status.payouts_enabled,
        requirements: status.requirements,
        capabilities: status.capabilities
      });

      // Update community onboarding status if account is verified
      if (status.charges_enabled && status.payouts_enabled) {
        await StripeRepository.updateCommunityStripeFields(localAccount.community_id, {
          stripe_onboarding_completed: true
        });
      }
    }

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error getting account status:', error);
    res.status(500).json({ 
      error: 'Failed to get account status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * POST /api/stripe/connect/refresh
 * Create a new onboarding link for an existing account
 */
export async function refreshOnboardingLink(req: Request, res: Response) {
  try {
    const { community_id } = req.body;

    if (!community_id) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    // Get existing Stripe account
    const account = await StripeRepository.getStripeAccountByCommunity(community_id);
    if (!account) {
      return res.status(404).json({ error: 'No Stripe account found for this community' });
    }

    // Create new onboarding link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const return_url = `${baseUrl}/settings/billing/stripe/return?community_id=${community_id}`;
    const refresh_url = `${baseUrl}/settings/billing/stripe/refresh?community_id=${community_id}`;

    const onboarding_url = await StripeService.createAccountLink(
      account.stripe_account_id,
      return_url,
      refresh_url
    );

    // Update community with new onboarding URL
    await StripeRepository.updateCommunityStripeFields(community_id, {
      stripe_onboarding_url: onboarding_url
    });

    res.json({
      success: true,
      data: {
        onboarding_url,
        account_id: account.stripe_account_id
      }
    });

  } catch (error) {
    console.error('Error refreshing onboarding link:', error);
    res.status(500).json({ 
      error: 'Failed to refresh onboarding link',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/stripe/connect/account/:communityId
 * Get Stripe account information for a community
 */
export async function getCommunityAccount(req: Request, res: Response) {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    const account = await StripeRepository.getStripeAccountByCommunity(communityId);
    
    if (!account) {
      return res.status(404).json({ error: 'No Stripe account found for this community' });
    }

    // Get fresh status from Stripe if account exists
    let stripeStatus = null;
    try {
      stripeStatus = await StripeService.getAccountStatus(account.stripe_account_id);
    } catch (error) {
      console.warn('Could not fetch fresh Stripe status:', error);
    }

    res.json({
      success: true,
      data: {
        ...account,
        stripe_status: stripeStatus
      }
    });

  } catch (error) {
    console.error('Error getting community account:', error);
    res.status(500).json({ 
      error: 'Failed to get community account',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 