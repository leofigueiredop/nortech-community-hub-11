
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'lucide-react';
import StatusBadge from './domain/StatusBadge';
import DNSInstructions from './domain/DNSInstructions';

const DomainSettings: React.FC = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  
  const handleDomainSetup = () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain to continue",
        variant: "destructive"
      });
      return;
    }
    
    setVerificationStatus('checking');
    // Simulate API call to verify domain
    setTimeout(() => {
      setVerificationStatus('success');
      toast({
        title: "Domain verified successfully",
        description: "Your custom domain is being set up. DNS propagation may take up to 24 hours.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Connect your own domain</CardTitle>
            <StatusBadge status={verificationStatus} />
          </div>
          <CardDescription>
            Replace nortech.app with your custom domain for a professional branded experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Your custom domain</Label>
            <div className="flex gap-2">
              <Input 
                id="domain"
                placeholder="e.g. community.yourdomain.com" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleDomainSetup}
                disabled={verificationStatus === 'checking'}
                className="gap-2"
              >
                <Link className="h-4 w-4" />
                {verificationStatus === 'checking' ? 'Verifying...' : 'Connect Domain'}
              </Button>
            </div>
            {domain && (
              <p className="text-sm text-muted-foreground">
                Your community will be available at: <span className="font-mono">https://{domain}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {domain && <DNSInstructions targetDomain="pablos-community-9de6af.nortech.app" />}

      <Alert className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
          DNS propagation may take up to 24 hours. SSL certificates are automatically provisioned once DNS is verified.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DomainSettings;
