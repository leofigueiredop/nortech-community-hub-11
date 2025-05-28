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
  Star,
  Zap,
  Crown,
  RefreshCw,
  Users,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStripeApi } from '@/hooks/useStripeApi';
import { SubscriptionPlanWithStripe, MemberSubscription } from '@/types/stripe.types';

interface MemberSubscriptionPlansProps {
  communityId: string;
  communityName?: string;
}

const MemberSubscriptionPlans: React.FC<MemberSubscriptionPlansProps> = ({ 
  communityId, 
  communityName 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const stripeApi = useStripeApi();
  
  const [plans, setPlans] = useState<SubscriptionPlanWithStripe[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<MemberSubscription | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [syncingPlans, setSyncingPlans] = useState(false);

  useEffect(() => {
    if (communityId && user?.id) {
      loadCommunityPlans();
      loadCurrentSubscription();
    }
  }, [communityId, user?.id]);

  const loadCommunityPlans = async () => {
    try {
      const response = await stripeApi.get(`/stripe/member/plans/${communityId}`);
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error loading community plans:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar planos da comunidade',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadCurrentSubscription = async () => {
    if (!user?.id) return;

    try {
      const response = await stripeApi.get(`/stripe/member/subscription/${communityId}/${user.id}`);
      if (response.success) {
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      // No subscription found - this is normal for new members
      console.log('No member subscription found');
    }
  };

  const handleSyncPlans = async () => {
    setSyncingPlans(true);
    try {
      const response = await stripeApi.post(`/stripe/member/plans/${communityId}/sync`);
      if (response.success) {
        setPlans(response.data);
        toast({
          title: 'Sucesso',
          description: response.message || 'Planos sincronizados com sucesso!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.error || 'Falha ao sincronizar planos',
        variant: 'destructive'
      });
    } finally {
      setSyncingPlans(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para assinar um plano',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await stripeApi.post('/stripe/member/subscribe', {
        community_id: communityId,
        user_id: user.id,
        plan_id: planId,
        trial_period_days: 0 // No trial for member subscriptions by default
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
    if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('starter')) {
      return <Star className="w-5 h-5" />;
    } else if (planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('premium')) {
      return <Zap className="w-5 h-5" />;
    } else if (planName.toLowerCase().includes('enterprise') || planName.toLowerCase().includes('vip')) {
      return <Crown className="w-5 h-5" />;
    }
    return <CreditCard className="w-5 h-5" />;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId;
  };

  const hasUnsyncedPlans = plans.some(plan => !plan.stripe_price_id);

  if (loadingPlans) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando planos...</span>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum plano disponível</h3>
          <p className="text-muted-foreground">
            Esta comunidade ainda não configurou planos de assinatura.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Planos de Assinatura {communityName && `- ${communityName}`}
        </h1>
        <p className="text-muted-foreground">
          Escolha o plano que melhor se adapta às suas necessidades
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Sua Assinatura Atual
            </CardTitle>
            <CardDescription>
              Status da sua assinatura nesta comunidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {plans.find(p => p.id === currentSubscription.plan_id)?.name || 'Plano Desconhecido'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(currentSubscription.amount)} / {currentSubscription.interval_type === 'month' ? 'mês' : 'ano'}
                </p>
              </div>
              {getStatusBadge(currentSubscription.status)}
            </div>

            {currentSubscription.current_period_end && (
              <p className="text-sm text-muted-foreground">
                Próxima cobrança: {new Date(currentSubscription.current_period_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sync Plans Alert */}
      {hasUnsyncedPlans && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Alguns planos precisam ser sincronizados com o Stripe para permitir assinaturas.</span>
            <Button 
              onClick={handleSyncPlans} 
              disabled={syncingPlans}
              size="sm"
              variant="outline"
            >
              {syncingPlans ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                'Sincronizar Planos'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${isCurrentPlan(plan.id) ? 'border-primary ring-2 ring-primary/20' : ''}`}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {getPlanIcon(plan.name)}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-muted-foreground">
                  /{plan.interval === 'yearly' ? 'ano' : 'mês'}
                </span>
              </div>
              {plan.description && (
                <CardDescription>{plan.description}</CardDescription>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Plan Features */}
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Plan Limits */}
                <div className="text-sm text-muted-foreground space-y-1">
                  {plan.max_members && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Até {plan.max_members} membros</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Cobrança {plan.interval === 'yearly' ? 'anual' : 'mensal'}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={stripeApi.loading || isCurrentPlan(plan.id) || !plan.stripe_price_id}
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
                  ) : !plan.stripe_price_id ? (
                    'Plano não disponível'
                  ) : currentSubscription ? (
                    'Alterar para este Plano'
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>
              </div>
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
            Tem dúvidas sobre os planos ou precisa de suporte? Entre em contato com a comunidade!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberSubscriptionPlans; 