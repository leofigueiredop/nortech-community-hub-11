
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    name: string;
    description: string;
    color: string;
    instructions: string;
    useCases: string[];
  } | null;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  integration
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  if (!integration) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      toast({
        title: "Connection successful",
        description: `${integration.name} has been connected to your community.`,
      });
      setIsConnecting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {integration.name}</DialogTitle>
          <DialogDescription>
            {integration.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
            <h3 className="text-sm font-medium mb-2">Connection Instructions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {integration.instructions}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input 
              id="webhookUrl" 
              placeholder="https://hooks.zapier.com/..." 
              value={webhookUrl} 
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter your {integration.name} webhook URL to establish the connection.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Suggested Use Cases</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {integration.useCases.map((useCase, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">{useCase}</li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={!webhookUrl || isConnecting}
            style={{ backgroundColor: integration.color }}
          >
            {isConnecting ? "Connecting..." : `Connect to ${integration.name}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;
