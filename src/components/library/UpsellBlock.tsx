import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, FileText, FileVideo, Download, Star, Award, Diamond } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpsellBlockProps {
  premiumContentCount?: number;
  purchaseType?: 'one-time' | 'subscription' | 'both';
}

const UpsellBlock: React.FC<UpsellBlockProps> = ({ 
  premiumContentCount = 0,
  purchaseType = 'both'
}) => {
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate('/settings/subscriptions', { state: { fromLibrary: true } });
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-6">
        <div className="absolute top-0 right-0 w-full h-full bg-amber-400 opacity-20 rounded-full blur-2xl"></div>
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-xl">Premium Library Access</CardTitle>
        </div>
        <CardDescription>
          Unlock {premiumContentCount > 0 ? premiumContentCount : 'all'} premium resources and exclusive content
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
            <FileText className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-center">Premium PDFs</h3>
            <p className="text-sm text-center text-muted-foreground">Downloadable templates and guides</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
            <FileVideo className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-center">Exclusive Videos</h3>
            <p className="text-sm text-center text-muted-foreground">In-depth tutorials and masterclasses</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
            <Download className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-center">Unlimited Downloads</h3>
            <p className="text-sm text-center text-muted-foreground">Save all resources for offline use</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Early access to new content releases</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Bonus points for premium content completions</span>
          </div>
          <div className="flex items-center gap-2">
            <Diamond className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Priority support and content requests</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        {(purchaseType === 'subscription' || purchaseType === 'both') && (
          <Button onClick={handleSubscribeClick} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            Subscribe for Unlimited Access
          </Button>
        )}
        
        {(purchaseType === 'one-time' || purchaseType === 'both') && (
          <Button variant="outline" onClick={handleSubscribeClick} className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-100">
            One-Time Purchase
          </Button>
        )}
        
        <div className="ml-auto flex items-center">
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200">
            <Lock size={12} className="mr-1" /> Premium
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UpsellBlock;
