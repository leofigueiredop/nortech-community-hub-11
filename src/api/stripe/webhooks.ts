import { Request, Response } from 'express';
import Stripe from 'stripe';
import StripeService from '@/services/StripeService';
import StripeRepository from '@/api/repositories/StripeRepository';

/**
 * POST /api/stripe/webhooks
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = StripeService.verifyWebhookSignature(req.body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    // Log webhook event
    await StripeRepository.createStripeWebhook({
      stripe_event_id: event.id,
      event_type: event.type,
      api_version: event.api_version || '',
      data: event.data as any,
      processed: false,
      processing_attempts: 0
    });

    // Process the event
    await processWebhookEvent(event);

    // Mark as processed
    const webhook = await StripeRepository.getStripeWebhookByEventId(event.id);
    if (webhook) {
      await StripeRepository.updateStripeWebhook(webhook.id, {
        processed: true,
        processed_at: new Date().toISOString()
      });
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Update webhook with error
    const webhook = await StripeRepository.getStripeWebhookByEventId(event.id);
    if (webhook) {
      await StripeRepository.updateStripeWebhook(webhook.id, {
        processing_attempts: webhook.processing_attempts + 1,
        last_processing_error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Process different types of Stripe webhook events
 */
async function processWebhookEvent(event: Stripe.Event) {
  console.log(`Processing webhook event: ${event.type}`);

  switch (event.type) {
    // Platform subscription events
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    // Connect account events
    case 'account.updated':
      await handleAccountUpdated(event.data.object as Stripe.Account);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { community_id, subscription_type } = session.metadata || {};
  
  if (!community_id || !subscription_type) {
    console.warn('Missing metadata in checkout session:', session.id);
    return;
  }

  if (subscription_type === 'platform' && session.subscription) {
    // This is a platform subscription - will be handled by subscription.created event
    console.log(`Platform subscription checkout completed for community ${community_id}`);
  } else if (subscription_type === 'member' && session.subscription) {
    // This is a member subscription - will be handled by subscription.created event
    console.log(`Member subscription checkout completed for community ${community_id}`);
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { community_id, subscription_type, user_id } = subscription.metadata || {};
  
  if (!community_id || !subscription_type) {
    console.warn('Missing metadata in subscription:', subscription.id);
    return;
  }

  if (subscription_type === 'platform') {
    // Create platform subscription record
    await StripeRepository.createPlatformSubscription({
      community_id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan_id: subscription.items.data[0]?.price.id || '',
      plan_name: subscription.items.data[0]?.price.nickname || 'Platform Plan',
      status: subscription.status as any,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.currency,
      interval_type: subscription.items.data[0]?.price.recurring?.interval as 'month' | 'year',
      metadata: subscription.metadata
    });

    console.log(`Platform subscription created for community ${community_id}`);

  } else if (subscription_type === 'member' && user_id) {
    // Find the subscription plan
    const planId = subscription.metadata.plan_id;
    if (!planId) {
      console.warn('Missing plan_id in member subscription metadata:', subscription.id);
      return;
    }

    // Create member subscription record
    await StripeRepository.createMemberSubscription({
      community_id,
      user_id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan_id: planId,
      stripe_price_id: subscription.items.data[0]?.price.id || '',
      status: subscription.status as any,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.currency,
      interval_type: subscription.items.data[0]?.price.recurring?.interval as 'month' | 'year',
      metadata: subscription.metadata
    });

    console.log(`Member subscription created for user ${user_id} in community ${community_id}`);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { community_id, subscription_type, user_id } = subscription.metadata || {};
  
  if (!community_id || !subscription_type) {
    console.warn('Missing metadata in subscription:', subscription.id);
    return;
  }

  if (subscription_type === 'platform') {
    // Update platform subscription
    const existingSubscription = await StripeRepository.getPlatformSubscriptionByCommunity(community_id);
    if (existingSubscription) {
      await StripeRepository.updatePlatformSubscription(existingSubscription.id, {
        status: subscription.status as any,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      });
    }

  } else if (subscription_type === 'member' && user_id) {
    // Update member subscription
    const existingSubscription = await StripeRepository.getMemberSubscription(community_id, user_id);
    if (existingSubscription) {
      await StripeRepository.updateMemberSubscription(existingSubscription.id, {
        status: subscription.status as any,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      });
    }
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { community_id, subscription_type, user_id } = subscription.metadata || {};
  
  if (!community_id || !subscription_type) {
    console.warn('Missing metadata in subscription:', subscription.id);
    return;
  }

  if (subscription_type === 'platform') {
    // Update platform subscription status
    const existingSubscription = await StripeRepository.getPlatformSubscriptionByCommunity(community_id);
    if (existingSubscription) {
      await StripeRepository.updatePlatformSubscription(existingSubscription.id, {
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      });
    }

  } else if (subscription_type === 'member' && user_id) {
    // Update member subscription status
    const existingSubscription = await StripeRepository.getMemberSubscription(community_id, user_id);
    if (existingSubscription) {
      await StripeRepository.updateMemberSubscription(existingSubscription.id, {
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      });
    }
  }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  // Create payment transaction record
  const subscription = invoice.subscription as string;
  const subscriptionData = await getSubscriptionFromStripe(subscription);
  
  if (subscriptionData?.metadata) {
    const { community_id, subscription_type } = subscriptionData.metadata;
    
    if (community_id) {
      await StripeRepository.createPaymentTransaction({
        community_id,
        stripe_payment_intent_id: invoice.payment_intent as string,
        subscription_id: subscription,
        subscription_type: subscription_type as 'platform' | 'member',
        transaction_type: 'payment',
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency,
        status: 'succeeded',
        processed_at: new Date().toISOString(),
        metadata: {
          invoice_id: invoice.id,
          period_start: invoice.period_start,
          period_end: invoice.period_end
        }
      });
    }
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  // Create failed payment transaction record
  const subscription = invoice.subscription as string;
  const subscriptionData = await getSubscriptionFromStripe(subscription);
  
  if (subscriptionData?.metadata) {
    const { community_id, subscription_type } = subscriptionData.metadata;
    
    if (community_id) {
      await StripeRepository.createPaymentTransaction({
        community_id,
        subscription_id: subscription,
        subscription_type: subscription_type as 'platform' | 'member',
        transaction_type: 'payment',
        amount: invoice.amount_due / 100, // Convert from cents
        currency: invoice.currency,
        status: 'failed',
        failure_reason: 'Payment failed',
        processed_at: new Date().toISOString(),
        metadata: {
          invoice_id: invoice.id,
          attempt_count: invoice.attempt_count
        }
      });
    }
  }
}

/**
 * Handle Stripe Connect account updates
 */
async function handleAccountUpdated(account: Stripe.Account) {
  const existingAccount = await StripeRepository.getStripeAccountByStripeId(account.id);
  
  if (existingAccount) {
    await StripeRepository.updateStripeAccount(existingAccount.id, {
      verification_status: getVerificationStatus(account),
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements || {},
      capabilities: account.capabilities || {}
    });

    // Update community onboarding status if account is now verified
    if (account.charges_enabled && account.payouts_enabled) {
      await StripeRepository.updateCommunityStripeFields(existingAccount.community_id, {
        stripe_onboarding_completed: true
      });
    }
  }
}

/**
 * Helper function to get verification status
 */
function getVerificationStatus(account: Stripe.Account): 'pending' | 'verified' | 'rejected' | 'restricted' {
  if (!account.charges_enabled || !account.payouts_enabled) {
    return 'pending';
  }

  if (account.requirements?.currently_due?.length || account.requirements?.past_due?.length) {
    return 'restricted';
  }

  return 'verified';
}

/**
 * Helper function to get subscription data from Stripe
 */
async function getSubscriptionFromStripe(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    const stripe = new (await import('stripe')).default(
      process.env.STRIPE_SECRET_KEY || '',
      { apiVersion: '2025-04-30.basil' }
    );
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error fetching subscription from Stripe:', error);
    return null;
  }
} 