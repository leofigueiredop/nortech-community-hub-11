
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { NotificationTypes } from './notifications/NotificationTypes';
import { DeliveryChannels } from './notifications/DeliveryChannels';
import { FrequencySettings } from './notifications/FrequencySettings';

const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    posts: true,
    replies: true,
    mentions: true,
    events: true,
    content: true,
    invitations: true,
    milestones: true,
    announcements: true,
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false,
    digest: true,
  });

  const [frequency, setFrequency] = useState('realtime');

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSave = () => {
    toast({
      title: "Preferências salvas",
      description: "Suas configurações de notificação foram atualizadas com sucesso.",
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-nortech-dark-blue">Configurações de notificações</h2>
          <p className="text-nortech-text-muted">
            Personalize como e quando você recebe notificações da Nortech Communities.
            Essas configurações se aplicam a todos os espaços dos quais você é membro.
          </p>
        </div>

        <Tabs defaultValue="types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-nortech-gray-light">
            <TabsTrigger value="types">Tipos de notificações</TabsTrigger>
            <TabsTrigger value="channels">Canais de entrega</TabsTrigger>
            <TabsTrigger value="frequency">Frequência</TabsTrigger>
          </TabsList>

          <TabsContent value="types">
            <NotificationTypes preferences={preferences} onTogglePreference={handleTogglePreference} />
          </TabsContent>

          <TabsContent value="channels">
            <DeliveryChannels channels={channels} onToggleChannel={handleToggleChannel} />
          </TabsContent>

          <TabsContent value="frequency">
            <FrequencySettings frequency={frequency} onFrequencyChange={setFrequency} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button 
            className="bg-nortech-purple hover:bg-nortech-purple/90" 
            onClick={handleSave}
          >
            Salvar preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
