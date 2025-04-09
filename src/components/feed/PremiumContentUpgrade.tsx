
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Star, Sparkles, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const PremiumContentUpgrade: React.FC = () => {
  const { toast } = useToast();
  
  const handleUpgradeClick = () => {
    // In a real app, this would redirect to the upgrade page
    toast({
      title: "Upgrade initiated",
      description: "Redirecting to the premium upgrade page...",
    });
  };
  
  return (
    <Card className="overflow-hidden border border-purple-200 dark:border-purple-900 shadow-sm">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
        <Lock className="w-12 h-12 mx-auto text-white mb-2" />
        <CardTitle className="text-2xl font-bold text-white text-center">
          Unlock Premium Content
        </CardTitle>
        <CardDescription className="text-base text-purple-100 text-center">
          Upgrade your membership to access exclusive premium content
        </CardDescription>
      </div>
      <CardContent className="space-y-6 pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Star className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Exclusive Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access premium tutorials, courses, and in-depth resources
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Sparkles className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Early Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Be the first to see new courses and community features
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Direct Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized help from our community mentors
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Lock className="text-nortech-purple mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Premium Groups</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join private discussion groups with industry experts
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button 
          onClick={handleUpgradeClick}
          className="bg-nortech-purple hover:bg-nortech-purple/90 text-white font-semibold px-8 py-2"
        >
          Upgrade Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumContentUpgrade;
