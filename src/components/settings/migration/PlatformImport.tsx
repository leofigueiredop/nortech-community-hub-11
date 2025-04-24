
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const platforms = [
  { id: 'discord', name: 'Discord', icon: '🎮' },
  { id: 'slack', name: 'Slack', icon: '💼' },
  { id: 'facebook', name: 'Facebook Groups', icon: '👥' },
  { id: 'circle', name: 'Circle', icon: '⭕' },
  { id: 'reddit', name: 'Reddit', icon: '🔴' },
  { id: 'telegram', name: 'Telegram', icon: '📱' }
];

const PlatformImport: React.FC = () => {
  const { toast } = useToast();
  
  const handlePlatformSelect = (platform: string) => {
    toast({
      title: `Starting ${platform} import`,
      description: "Please authorize access to your account.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Supported Platforms</h3>
        <div className="grid grid-cols-2 gap-3">
          {platforms.map((platform) => (
            <div 
              key={platform.id} 
              className="flex items-center gap-2 p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              onClick={() => handlePlatformSelect(platform.name)}
            >
              <span className="text-xl" role="img" aria-label={platform.name}>
                {platform.icon}
              </span>
              <span>{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Button onClick={() => handlePlatformSelect('Platform')} className="w-full mt-2">
          Start Import
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          You'll need to authorize access to your account on the selected platform.
        </p>
      </div>
    </div>
  );
};

export default PlatformImport;
