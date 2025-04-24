
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar, MessageSquare, FileText, Megaphone, Award, UserPlus, Mail, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

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

          <TabsContent value="types" className="space-y-6">
            <div className="space-y-6">
              {[
                { 
                  icon: FileText, 
                  iconColor: 'text-blue-400', 
                  label: 'Novas postagens', 
                  description: 'Quando alguém publica em um espaço que você segue',
                  key: 'posts'
                },
                { 
                  icon: MessageSquare, 
                  iconColor: 'text-purple-400', 
                  label: 'Respostas às suas postagens', 
                  description: 'Quando alguém responde à sua postagem ou comentário',
                  key: 'replies'
                },
                { 
                  icon: Calendar, 
                  iconColor: 'text-green-400', 
                  label: 'Eventos e sessões ao vivo', 
                  description: 'Próximos eventos para os quais você se registrou',
                  key: 'events'
                },
                { 
                  icon: FileText, 
                  iconColor: 'text-teal-400', 
                  label: 'Novo conteúdo', 
                  description: 'Quando novo conteúdo é adicionado a cursos em que você está inscrito',
                  key: 'content'
                },
                { 
                  icon: UserPlus, 
                  iconColor: 'text-pink-400', 
                  label: 'Convites', 
                  description: 'Convites para espaços e aprovações de membros',
                  key: 'invitations'
                },
                { 
                  icon: Award, 
                  iconColor: 'text-amber-400', 
                  label: 'Conquistas e emblemas', 
                  description: 'Quando você completa cursos ou ganha novos emblemas',
                  key: 'milestones'
                },
                { 
                  icon: Megaphone, 
                  iconColor: 'text-red-400', 
                  label: 'Anúncios', 
                  description: 'Anúncios importantes da comunidade feitos por administradores',
                  key: 'announcements'
                }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      <div>
                        <Label className="text-base font-semibold text-nortech-dark-blue block">{item.label}</Label>
                        <p className="text-nortech-text-muted text-sm">{item.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences[item.key as keyof typeof preferences]} 
                      onCheckedChange={() => handleTogglePreference(item.key as keyof typeof preferences)}
                    />
                  </div>
                  {index < 6 && <Separator className="bg-nortech-gray-light" />}
                </React.Fragment>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="space-y-6">
              {[
                { 
                  icon: Bell, 
                  iconColor: 'text-indigo-400', 
                  label: 'Notificações no aplicativo', 
                  description: 'Notificações no centro de notificações',
                  key: 'inApp'
                },
                { 
                  icon: Mail, 
                  iconColor: 'text-cyan-400', 
                  label: 'Notificações por email', 
                  description: 'Enviar notificações para seu email',
                  key: 'email'
                },
                { 
                  icon: Bell, 
                  iconColor: 'text-orange-400', 
                  label: 'Notificações push', 
                  description: 'Notificações no seu dispositivo móvel',
                  key: 'push'
                },
                { 
                  icon: Clock, 
                  iconColor: 'text-rose-400', 
                  label: 'Emails de resumo', 
                  description: 'Receber um resumo das atividades',
                  key: 'digest'
                }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      <div>
                        <Label className="text-base font-semibold text-nortech-dark-blue block">{item.label}</Label>
                        <p className="text-nortech-text-muted text-sm">{item.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={channels[item.key as keyof typeof channels]} 
                      onCheckedChange={() => handleToggleChannel(item.key as keyof typeof channels)}
                    />
                  </div>
                  {index < 3 && <Separator className="bg-nortech-gray-light" />}
                </React.Fragment>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frequency" className="space-y-6">
            <div className="space-y-6">
              <Label className="text-base font-semibold text-nortech-dark-blue">Frequência de notificações</Label>
              <p className="text-nortech-text-muted text-sm mb-4">Escolha com que frequência você recebe notificações</p>

              <RadioGroup 
                value={frequency} 
                onValueChange={setFrequency} 
                className="space-y-4"
              >
                {[
                  { 
                    value: 'realtime', 
                    label: 'Tempo real', 
                    description: 'Receba notificações assim que acontecerem'
                  },
                  { 
                    value: 'daily', 
                    label: 'Resumo diário', 
                    description: 'Receba um resumo uma vez por dia'
                  },
                  { 
                    value: 'weekly', 
                    label: 'Resumo semanal', 
                    description: 'Receba um resumo uma vez por semana'
                  }
                ].map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={item.value} />
                    <Label htmlFor={item.value} className="text-nortech-dark-blue">
                      <span className="font-semibold">{item.label}</span>
                      <p className="text-nortech-text-muted text-sm">{item.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
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
