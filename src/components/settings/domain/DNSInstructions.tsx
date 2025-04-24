
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TestTube } from 'lucide-react';

interface DNSInstructionsProps {
  targetDomain: string;
}

const DNSInstructions: React.FC<DNSInstructionsProps> = ({ targetDomain }) => {
  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <h3 className="font-medium mb-3 text-sm">DNS Configuration</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add this CNAME record to your domain provider's DNS settings:
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-900 rounded-md overflow-hidden border mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2.5 text-muted-foreground font-medium">Type</th>
                <th className="text-left p-2.5 text-muted-foreground font-medium">Host/Name</th>
                <th className="text-left p-2.5 text-muted-foreground font-medium">Value/Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2.5 font-mono text-xs">CNAME</td>
                <td className="p-2.5 font-mono text-xs">@</td>
                <td className="p-2.5 font-mono text-xs">{targetDomain}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <Button variant="link" className="h-auto p-0 text-xs gap-1.5" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
              How to set up DNS records
            </a>
          </Button>
          <Button variant="link" className="h-auto p-0 text-xs gap-1.5" asChild>
            <a href="https://dnschecker.org/" target="_blank" rel="noopener noreferrer">
              <TestTube className="h-3 w-3" />
              Test DNS propagation
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DNSInstructions;
