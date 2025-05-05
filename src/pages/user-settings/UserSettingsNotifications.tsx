import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FrequencySettings } from '@/components/settings/notifications/FrequencySettings';
import { NotificationTypes } from '@/components/settings/notifications/NotificationTypes';
import { DeliveryChannels } from '@/components/settings/notifications/DeliveryChannels'; 
import { Bell, Mail } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const UserSettingsNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados iniciais para preferências de notificações
  const [frequency, setFrequency] = useState('realtime');
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false,
    digest: true,
  });
  const [preferences, setPreferences] = useState({
    posts: true,
    replies: true,
    events: true,
    content: true,
    invitations: true,
    milestones: true,
    announcements: true,
  });
  
  // Simula carregamento das preferências do usuário do Supabase
  useEffect(() => {
    // Aqui, em um cenário real, carregaríamos as preferências do usuário do Supabase
    // Exemplo: loadUserNotificationPreferences(user.id, currentCommunity.id)
    console.log("Carregando preferências de notificações do usuário", user?.id);
  }, [user]);
  
  const handleFrequencyChange = async (value: string) => {
    setIsLoading(true);
    
    try {
      setFrequency(value);
      // Em um cenário real: await updateNotificationSettings(user.id, { frequency: value })
      
      toast({
        title: "Frequência atualizada",
        description: "Sua preferência de frequência de notificações foi atualizada.",
      });
    } catch (error) {
      console.error("Erro ao atualizar frequência:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleChannel = async (key: string) => {
    setIsLoading(true);
    
    try {
      const updatedChannels = {
        ...channels,
        [key]: !channels[key as keyof typeof channels]
      };
      
      setChannels(updatedChannels);
      // Em um cenário real: await updateNotificationChannels(user.id, updatedChannels)
      
      toast({
        title: "Canal atualizado",
        description: "Suas preferências de canais de notificação foram atualizadas.",
      });
    } catch (error) {
      console.error("Erro ao atualizar canal:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTogglePreference = async (key: string) => {
    setIsLoading(true);
    
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key as keyof typeof preferences]
      };
      
      setPreferences(updatedPreferences);
      // Em um cenário real: await updateNotificationPreferences(user.id, updatedPreferences)
      
      toast({
        title: "Preferência atualizada",
        description: "Suas preferências de notificação foram atualizadas.",
      });
    } catch (error) {
      console.error("Erro ao atualizar preferência:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisableAll = async () => {
    setIsLoading(true);
    
    try {
      const updatedPreferences = Object.keys(preferences).reduce((acc, key) => {
        acc[key as keyof typeof preferences] = false;
        return acc;
      }, {} as typeof preferences);
      
      setPreferences(updatedPreferences);
      // Em um cenário real: await updateNotificationPreferences(user.id, updatedPreferences)
      
      toast({
        title: "Todas as notificações desativadas",
        description: "Você não receberá notificações até ativá-las novamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Erro ao desativar notificações:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout title="Configurações de Notificações">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações de Notificações</h1>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Preferências de Notificação</h2>
              </div>
              
              <NotificationTypes 
                preferences={preferences} 
                onTogglePreference={handleTogglePreference} 
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                  onClick={handleDisableAll}
                  disabled={isLoading}
                >
                  Desativar todas as notificações
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Canais de Entrega</h2>
              </div>
              
              <DeliveryChannels 
                channels={channels}
                onToggleChannel={handleToggleChannel}
              />
            </div>

            <Separator />

            <div className="space-y-6">
              <FrequencySettings 
                frequency={frequency}
                onFrequencyChange={handleFrequencyChange}
              />
              
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="text-sm font-medium mb-2">Prévia de resumos por email</h3>
                <p className="text-sm text-muted-foreground">
                  {frequency === 'realtime' ? (
                    "Você receberá emails imediatos para notificações importantes."
                  ) : frequency === 'daily' ? (
                    "Você receberá um resumo diário de todas as suas notificações ao final de cada dia."
                  ) : (
                    "Você receberá um resumo semanal de todas as suas notificações todo domingo."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserSettingsNotifications; 