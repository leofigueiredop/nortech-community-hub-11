
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

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
        title: "Domain configured",
        description: "Your custom domain is being set up. This may take up to 24 hours to propagate.",
      });
    }, 1500);
  };

  return (
    <div>
      <Card className="mb-5 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Custom Domain Setup</CardTitle>
          <CardDescription>
            Connect your community to a custom domain for a professional branded experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-medium">Domain name</Label>
              <div className="flex gap-2">
                <Input 
                  id="domain"
                  placeholder="Example: community.yourdomain.com" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleDomainSetup} 
                  disabled={verificationStatus === 'checking'}
                  className="min-w-[100px]"
                  size="sm"
                >
                  {verificationStatus === 'checking' ? 'Verifying...' : 'Setup'}
                </Button>
              </div>
              {verificationStatus === 'success' && (
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Domain verified successfully
                </div>
              )}
            </div>
            
            <div className="rounded-lg border p-3 bg-gray-50 dark:bg-gray-900 text-sm">
              <h3 className="font-medium mb-2 text-sm">DNS Configuration</h3>
              <p className="text-muted-foreground mb-3 text-xs">
                To connect your domain, add this CNAME record to your DNS settings:
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-md overflow-hidden border mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 text-muted-foreground">Type</th>
                      <th className="text-left p-2 text-muted-foreground">Host/Name</th>
                      <th className="text-left p-2 text-muted-foreground">Value/Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-mono">CNAME</td>
                      <td className="p-2 font-mono">@</td>
                      <td className="p-2 font-mono">pablos-community-9de6af.nortech.app</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-1.5">
                <Button variant="link" className="p-0 h-auto flex items-center gap-1.5 text-xs" asChild>
                  <a href="#" className="text-blue-600">
                    <ExternalLink className="h-3 w-3" />
                    <span>How to set up DNS records</span>
                  </a>
                </Button>
                <Button variant="link" className="p-0 h-auto flex items-center gap-1.5 text-xs" asChild>
                  <a href="#" className="text-blue-600">
                    <ExternalLink className="h-3 w-3" />
                    <span>Troubleshoot domain issues</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
            <div className="text-amber-600 dark:text-amber-500 mt-0.5">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-amber-800 dark:text-amber-500">Important Note</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Domain propagation may take up to 24 hours. SSL certificates are automatically provisioned.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainSettings;
