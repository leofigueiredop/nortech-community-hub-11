
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Clock } from 'lucide-react';

interface DeliveryChannelsProps {
  channels: Record<string, boolean>;
  onToggleChannel: (key: string) => void;
}

const channelItems = [
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
];

export const DeliveryChannels: React.FC<DeliveryChannelsProps> = ({ channels, onToggleChannel }) => {
  return (
    <div className="space-y-6">
      {channelItems.map((item, index) => (
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
              checked={channels[item.key]} 
              onCheckedChange={() => onToggleChannel(item.key)}
            />
          </div>
          {index < channelItems.length - 1 && <Separator className="bg-nortech-gray-light" />}
        </React.Fragment>
      ))}
    </div>
  );
};
