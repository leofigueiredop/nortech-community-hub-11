import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  RefreshCw,
  CreditCard,
  Building,
  User,
  Mail
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStripeApi } from '@/hooks/useStripeApi';

interface StripeAccountStatus {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  verification_status: string;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
}

interface OnboardingData {
  account_id: string;
  onboarding_url: string;
}

const StripeOnboardingWizard: React.FC = () => {
  const { community } = useAuth();
  const { toast } = useToast();
  const stripeApi = useStripeApi();
  
  const [step, setStep] = useState<'form' | 'onboarding' | 'status'>('form');
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    business_type: 'individual',
    country: 'BR'
  });

  useEffect(() => {
    if (community?.id) {
      checkExistingAccount();
    }
  }, [community?.id]);

  const checkExistingAccount = async () => {
    if (!community?.id) return;

         try {
       const response = await stripeApi.get(`/stripe/connect/account/${community.id}`);
       if (response.success) {
                 const account = response.data;
         setAccountStatus(account.stripe_status);
         setOnboardingData({
           account_id: account.stripe_account_id,
           onboarding_url: account.stripe_onboarding_url || ''
         });
         
         if (account.stripe_onboarding_completed) {
           setStep('status');
         } else {
           setStep('onboarding');
         }
       }
     } catch (error) {
       // No existing account, stay on form step
       console.log('No existing Stripe account found');
     }
   };

   const handleStartOnboarding = async () => {
     if (!community?.id) {
       toast({
         title: 'Erro',
         description: 'ID da comunidade não encontrado',
         variant: 'destructive'
       });
       return;
     }

     try {
       const response = await stripeApi.post('/stripe/connect/onboard', {
        community_id: community.id,
        email: formData.email,
        business_type: formData.business_type,
        country: formData.country
      });

             if (response.success) {
         setOnboardingData(response.data);
         setStep('onboarding');
         
         toast({
           title: 'Sucesso',
           description: 'Conta Stripe criada! Redirecionando para o onboarding...'
         });

         // Redirect to Stripe onboarding
         window.open(response.data.onboarding_url, '_blank');
       }
     } catch (error: any) {
       toast({
         title: 'Erro',
         description: error.error || 'Falha ao iniciar onboarding',
         variant: 'destructive'
       });
     }
   };

   const handleRefreshStatus = async () => {
     if (!onboardingData?.account_id) return;

     try {
       const response = await stripeApi.get(`/stripe/connect/status/${onboardingData.account_id}`);
       if (response.success) {
         setAccountStatus(response.data);
         
         if (response.data.charges_enabled && response.data.payouts_enabled) {
           setStep('status');
           toast({
             title: 'Sucesso',
             description: 'Conta verificada com sucesso!'
           });
         }
       }
     } catch (error: any) {
       toast({
         title: 'Erro',
         description: 'Falha ao verificar status da conta',
         variant: 'destructive'
       });
     }
   };

   const handleRefreshOnboardingLink = async () => {
     if (!community?.id) return;

     try {
       const response = await stripeApi.post('/stripe/connect/refresh', {
        community_id: community.id
      });

             if (response.success) {
         setOnboardingData(response.data);
         window.open(response.data.onboarding_url, '_blank');
         
         toast({
           title: 'Sucesso',
           description: 'Novo link de onboarding gerado!'
         });
       }
     } catch (error: any) {
       toast({
         title: 'Erro',
         description: 'Falha ao gerar novo link',
         variant: 'destructive'
       });
     }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verificado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'restricted':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Restrito</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderFormStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Configurar Pagamentos
        </CardTitle>
        <CardDescription>
          Configure sua conta Stripe para receber pagamentos dos seus membros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type">Tipo de Conta</Label>
          <Select 
            value={formData.business_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pessoa Física
                </div>
              </SelectItem>
              <SelectItem value="company">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Pessoa Jurídica
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select 
            value={formData.country} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
              <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
              <SelectItem value="GB">🇬🇧 Reino Unido</SelectItem>
            </SelectContent>
          </Select>
        </div>

                 <Button 
           onClick={handleStartOnboarding} 
           disabled={stripeApi.loading || !formData.email}
           className="w-full"
         >
           {stripeApi.loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Iniciar Configuração'
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderOnboardingStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Verificação Pendente
        </CardTitle>
        <CardDescription>
          Complete a verificação da sua conta no Stripe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sua conta Stripe foi criada, mas ainda precisa ser verificada. 
            Complete o processo de onboarding para começar a receber pagamentos.
          </AlertDescription>
        </Alert>

        {accountStatus && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Status:</span>
              {getStatusBadge(accountStatus.verification_status)}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Pagamentos:</span>
              <Badge variant={accountStatus.charges_enabled ? "default" : "secondary"}>
                {accountStatus.charges_enabled ? 'Habilitado' : 'Desabilitado'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Saques:</span>
              <Badge variant={accountStatus.payouts_enabled ? "default" : "secondary"}>
                {accountStatus.payouts_enabled ? 'Habilitado' : 'Desabilitado'}
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
                     <Button 
             onClick={handleRefreshOnboardingLink}
             disabled={stripeApi.loading}
             className="w-full"
             variant="outline"
           >
             <ExternalLink className="w-4 h-4 mr-2" />
             Continuar Verificação
           </Button>
           
           <Button 
             onClick={handleRefreshStatus}
             disabled={stripeApi.loading}
             className="w-full"
             variant="secondary"
           >
             {stripeApi.loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Verificar Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatusStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Conta Verificada
        </CardTitle>
        <CardDescription>
          Sua conta Stripe está configurada e pronta para receber pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Parabéns! Sua conta foi verificada com sucesso. 
            Agora você pode criar planos de assinatura e receber pagamentos.
          </AlertDescription>
        </Alert>

        {accountStatus && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Status:</span>
              {getStatusBadge(accountStatus.verification_status)}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">ID da Conta:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {onboardingData?.account_id}
              </code>
            </div>
          </div>
        )}

                 <Button 
           onClick={handleRefreshStatus}
           disabled={stripeApi.loading}
           className="w-full"
           variant="outline"
         >
           {stripeApi.loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar Status
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {step === 'form' && renderFormStep()}
      {step === 'onboarding' && renderOnboardingStep()}
      {step === 'status' && renderStatusStep()}
    </div>
  );
};

export default StripeOnboardingWizard; 