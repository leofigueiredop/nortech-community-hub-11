import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard,
  Crown,
  Zap,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStripeApi } from '@/hooks/useStripeApi';
import { StripePlatformPlan, PlatformSubscription } from '@/types/stripe.types';

const PlatformBilling: React.FC = () => {
  const { community } = useAuth();
  const { toast } = useToast();
  const stripeApi = useStripeApi();
  
  const [plans, setPlans] = useState<StripePlatformPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<PlatformSubscription | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    if (community?.id) {
      loadPlatformPlans();
      loadCurrentSubscription();
    }
  }, [community?.id]);

  const loadPlatformPlans = async () => {
    try {
      const response = await stripeApi.get('/stripe/platform/plans');
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error loading platform plans:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar planos da plataforma',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadCurrentSubscription = async () => {
    if (!community?.id) return;

    try {
      const response = await stripeApi.get(`/stripe/platform/subscription/${community.id}`);
      if (response.success) {
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      // No subscription found - this is normal for new communities
      console.log('No platform subscription found');
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!community?.id) {
      toast({
        title: 'Erro',
        description: 'ID da comunidade não encontrado',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await stripeApi.post('/stripe/platform/subscribe', {
        community_id: community.id,
        plan_id: planId,
        trial_period_days: 7 // 7 days trial for all plans
      });

      if (response.success) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.error || 'Falha ao iniciar assinatura',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Vencido</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) {
      return <Building className="w-5 h-5" />;
    } else if (planName.toLowerCase().includes('pro')) {
      return <Zap className="w-5 h-5" />;
    } else if (planName.toLowerCase().includes('enterprise')) {
      return <Crown className="w-5 h-5" />;
    }
    return <CreditCard className="w-5 h-5" />;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId;
  };

  if (loadingPlans) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando planos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Assinatura Atual
            </CardTitle>
            <CardDescription>
              Status da sua assinatura da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{currentSubscription.plan_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(currentSubscription.amount)} / {currentSubscription.interval_type === 'month' ? 'mês' : 'ano'}
                </p>
              </div>
              {getStatusBadge(currentSubscription.status)}
            </div>

            {currentSubscription.status === 'trialing' && currentSubscription.trial_end && (
              <Alert className="mb-4">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Seu período de teste termina em {new Date(currentSubscription.trial_end).toLocaleDateString('pt-BR')}
                </AlertDescription>
              </Alert>
            )}

            {currentSubscription.current_period_end && (
              <p className="text-sm text-muted-foreground">
                Próxima cobrança: {new Date(currentSubscription.current_period_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {currentSubscription ? 'Alterar Plano' : 'Escolha seu Plano'}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${isCurrentPlan(plan.id) ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getPlanIcon(plan.name)}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatPrice(plan.amount)}</span>
                  <span className="text-muted-foreground">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.trial_period_days && !currentSubscription && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      🎉 {plan.trial_period_days} dias grátis para testar!
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={stripeApi.loading || isCurrentPlan(plan.id)}
                  className="w-full"
                  variant={isCurrentPlan(plan.id) ? "outline" : "default"}
                >
                  {stripeApi.loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan(plan.id) ? (
                    'Plano Atual'
                  ) : currentSubscription ? (
                    'Alterar para este Plano'
                  ) : (
                    'Começar Teste Grátis'
                  )}
                </Button>
              </CardContent>

              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Plano Atual
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Precisa de Ajuda?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tem dúvidas sobre os planos ou precisa de suporte? Estamos aqui para ajudar!
          </p>
          <Button variant="outline" className="w-full sm:w-auto">
            <ExternalLink className="w-4 h-4 mr-2" />
            Falar com Suporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformBilling; 