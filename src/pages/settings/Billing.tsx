import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import PlatformBilling from '@/components/stripe/PlatformBilling';
import StripeOnboardingWizard from '@/components/stripe/StripeOnboardingWizard';
import MemberSubscriptionsDashboard from '@/components/stripe/MemberSubscriptionsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

const Billing: React.FC = () => {
  const { community } = useAuth();

  return (
    <SettingsLayout activeSection="billing" title="Billing & Payments">
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platform">Assinatura da Plataforma</TabsTrigger>
          <TabsTrigger value="payments">Configurar Pagamentos</TabsTrigger>
          <TabsTrigger value="members">Assinaturas dos Membros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platform" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Assinatura da Plataforma</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Gerencie sua assinatura para usar a plataforma Nortech Community Hub
            </p>
            <PlatformBilling />
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Configurar Pagamentos</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure sua conta Stripe para receber pagamentos dos seus membros
            </p>
            <StripeOnboardingWizard />
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-6">
          <MemberSubscriptionsDashboard />
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
};

export default Billing; 