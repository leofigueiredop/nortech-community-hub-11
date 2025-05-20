import React, { useState, useEffect } from 'react';
import { PaywallTemplateType } from './paywall/PaywallTemplateGrid';
import PaywallTemplateGrid from './paywall/PaywallTemplateGrid';
import PaywallSettingsForm from './paywall/PaywallSettingsForm';
import PaywallPreviewDialog from './paywall/PaywallPreviewDialog';
import PaymentOptionsSection from './paywall/PaymentOptionsSection';
import { Lock, Check, Loader2 } from 'lucide-react';
import { usePaywallSettings } from '../../hooks/usePaywallSettings';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const PaywallSettings: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const {
    settings,
    templates,
    loading,
    error,
    fetchSettings,
    saveSettings,
    changeTemplate,
    updateMessageSettings,
    toggleGateway,
    updateGatewayConfig
  } = usePaywallSettings();
  
  // Use activeTemplate from settings or default to 'simple'
  const activeTemplate = settings?.activeTemplate as PaywallTemplateType || 'simple';
  
  // Handler para alterar o template ativo
  const handleTemplateChange = async (template: PaywallTemplateType) => {
    if (settings) {
      await changeTemplate(template);
    }
  };
  
  // Handler para abrir visualização
  const handleOpenPreview = () => {
    setPreviewOpen(true);
  };
  
  // Recarregar configurações em caso de erro
  const handleRetry = () => {
    fetchSettings();
  };
  
  // Carregar configurações quando o componente montar
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  
  // Template preview definitions
  const templatePreviews = {
    simple: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-6 text-center space-y-4">
          <Lock className="h-12 w-12 mx-auto text-purple-500" />
          <h2 className="text-2xl font-bold">
            {settings?.messageSettings?.title || 'Premium Content'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {settings?.messageSettings?.description || 'This content is available exclusively for members.'}
          </p>
          <div className="pt-4">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
              {settings?.messageSettings?.ctaText || 'Subscribe Now'}
            </button>
          </div>
        </div>
      </div>
    ),
    featured: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">{settings?.messageSettings?.title || 'Premium Members Only'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {settings?.messageSettings?.description || 'Get access to premium content and exclusive resources:'}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Exclusive courses and tutorials</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Access to member-only community</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Early access to new content</span>
            </li>
          </ul>
          <div className="pt-4">
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-2 px-4 rounded">
              {settings?.messageSettings?.ctaText || 'Unlock Premium Access'}
            </button>
          </div>
        </div>
      </div>
    ),
    premium: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">{settings?.messageSettings?.title || 'Premium Membership'}</h2>
          <p className="opacity-80 mt-1">Unlock all premium features</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">$19.99<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Full access to all courses</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Premium community features</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Exclusive events and webinars</span>
            </li>
          </ul>
          <div className="pt-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
              {settings?.messageSettings?.ctaText || 'Subscribe Now'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Secure payment via {settings?.gatewayConfigs?.stripe?.isDefault ? 'Stripe' : 'PayPal'}
            </p>
          </div>
        </div>
      </div>
    )
  };

  // Renderização condicional para carregamento e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erro ao carregar configurações</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Paywall Setup</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure how paywalls appear when members encounter premium content
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Paywall Templates</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose how your paywall looks when users encounter premium content
        </p>
        
        <PaywallTemplateGrid 
          activeTemplate={activeTemplate}
          setActiveTemplate={handleTemplateChange}
          onPreview={handleOpenPreview}
          availableTemplates={templates}
        />
        
        <PaywallSettingsForm 
          messageSettings={settings?.messageSettings}
          onUpdateMessages={updateMessageSettings}
        />
      </div>

      <PaymentOptionsSection 
        gatewayConfigs={settings?.gatewayConfigs}
        activeGateways={settings?.activeGateways || []}
        onToggleGateway={toggleGateway}
        onUpdateGateway={updateGatewayConfig}
      />

      <PaywallPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={templatePreviews[activeTemplate]}
      />
    </div>
  );
};

export default PaywallSettings;
