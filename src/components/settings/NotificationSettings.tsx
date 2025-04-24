
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
    <Card className="bg-gray-900 rounded-2xl text-white shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Configurações de notificações</h2>
          <p className="text-gray-400">
            Personalize como e quando você recebe notificações da Nortech Communities.
            Essas configurações se aplicam a todos os espaços dos quais você é membro.
          </p>
        </div>

        <Tabs defaultValue="types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="types">Tipos de notificações</TabsTrigger>
            <TabsTrigger value="channels">Canais de entrega</TabsTrigger>
            <TabsTrigger value="frequency">Frequência</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Novas postagens</Label>
                    <p className="text-gray-400 text-sm">Quando alguém publica em um espaço que você segue</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.posts} 
                  onCheckedChange={() => handleTogglePreference('posts')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Respostas às suas postagens</Label>
                    <p className="text-gray-400 text-sm">Quando alguém responde à sua postagem ou comentário</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.replies} 
                  onCheckedChange={() => handleTogglePreference('replies')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Eventos e sessões ao vivo</Label>
                    <p className="text-gray-400 text-sm">Próximos eventos para os quais você se registrou</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.events} 
                  onCheckedChange={() => handleTogglePreference('events')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-teal-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Novo conteúdo</Label>
                    <p className="text-gray-400 text-sm">Quando novo conteúdo é adicionado a cursos em que você está inscrito</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.content} 
                  onCheckedChange={() => handleTogglePreference('content')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-5 w-5 text-pink-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Convites</Label>
                    <p className="text-gray-400 text-sm">Convites para espaços e aprovações de membros</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.invitations} 
                  onCheckedChange={() => handleTogglePreference('invitations')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-amber-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Conquistas e emblemas</Label>
                    <p className="text-gray-400 text-sm">Quando você completa cursos ou ganha novos emblemas</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.milestones} 
                  onCheckedChange={() => handleTogglePreference('milestones')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-red-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Anúncios</Label>
                    <p className="text-gray-400 text-sm">Anúncios importantes da comunidade feitos por administradores</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.announcements} 
                  onCheckedChange={() => handleTogglePreference('announcements')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-indigo-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Notificações no aplicativo</Label>
                    <p className="text-gray-400 text-sm">Notificações no centro de notificações</p>
                  </div>
                </div>
                <Switch 
                  checked={channels.inApp} 
                  onCheckedChange={() => handleToggleChannel('inApp')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Notificações por email</Label>
                    <p className="text-gray-400 text-sm">Enviar notificações para seu email</p>
                  </div>
                </div>
                <Switch 
                  checked={channels.email} 
                  onCheckedChange={() => handleToggleChannel('email')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Notificações push</Label>
                    <p className="text-gray-400 text-sm">Notificações no seu dispositivo móvel</p>
                  </div>
                </div>
                <Switch 
                  checked={channels.push} 
                  onCheckedChange={() => handleToggleChannel('push')}
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-rose-400" />
                  <div>
                    <Label className="text-base font-semibold text-white">Emails de resumo</Label>
                    <p className="text-gray-400 text-sm">Receber um resumo das atividades</p>
                  </div>
                </div>
                <Switch 
                  checked={channels.digest} 
                  onCheckedChange={() => handleToggleChannel('digest')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frequency" className="space-y-6">
            <div className="space-y-6">
              <Label className="text-base font-semibold text-white">Frequência de notificações</Label>
              <p className="text-gray-400 text-sm mb-4">Escolha com que frequência você recebe notificações</p>

              <RadioGroup 
                value={frequency} 
                onValueChange={setFrequency} 
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="realtime" id="realtime" />
                  <Label htmlFor="realtime" className="text-white">
                    <span className="font-semibold">Tempo real</span>
                    <p className="text-gray-400 text-sm">Receba notificações assim que acontecerem</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="text-white">
                    <span className="font-semibold">Resumo diário</span>
                    <p className="text-gray-400 text-sm">Receba um resumo uma vez por dia</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="text-white">
                    <span className="font-semibold">Resumo semanal</span>
                    <p className="text-gray-400 text-sm">Receba um resumo uma vez por semana</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button className="bg-nortech-purple hover:bg-nortech-purple/90" onClick={handleSave}>
            Salvar preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
