import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { FileText, MessageSquare, Calendar, UserPlus, Award, Megaphone } from 'lucide-react';

interface NotificationTypesProps {
  preferences: Record<string, boolean>;
  onTogglePreference: (key: string) => void;
}

const notificationTypeItems = [
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
];

export const NotificationTypes: React.FC<NotificationTypesProps> = ({ preferences, onTogglePreference }) => {
  return (
    <div className="space-y-6">
      {notificationTypeItems.map((item, index) => (
        <React.Fragment key={item.key}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              <div>
                <Label className="text-base font-semibold block">{item.label}</Label>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </div>
            <Switch 
              checked={preferences[item.key]} 
              onCheckedChange={() => onTogglePreference(item.key)}
            />
          </div>
          {index < notificationTypeItems.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};
