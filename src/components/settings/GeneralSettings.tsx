import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe, Settings2, Lock, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GeneralSettings: React.FC = () => {
  const { toast } = useToast();
  const [communityName, setCommunityName] = useState("Pablo's Community");
  const [language, setLanguage] = useState("english");
  const [isPrivate, setIsPrivate] = useState(true);
  const [communityUrl, setCommunityUrl] = useState("pablos-community-9de6a");
  const [isSaving, setIsSaving] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: `Changes were saved successfully at ${new Date().toLocaleTimeString()}`,
      });
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Community Preview Badge */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-6 inline-flex items-center gap-2">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${communityName}`} 
             className="w-8 h-8 rounded" 
             alt="Community" />
        <div>
          <div className="text-sm font-medium">{communityName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Community Preview</div>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-gray-500" />
            <CardTitle>Manage General Settings</CardTitle>
          </div>
          <CardDescription>Configure basic information about your community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="community-name" className="text-base font-semibold mb-2 block">
                Community Name
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">Your brand name shown to members</p>
            </div>
            <div>
              <Input 
                id="community-name" 
                placeholder="Enter community name" 
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="default-language" className="text-base font-semibold mb-2 block">
                Language
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">Default for new members</p>
            </div>
            <div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="community-id" className="text-base font-semibold mb-2 block">
                Community ID
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">For support identification</p>
            </div>
            <div>
              <Input 
                id="community-id" 
                value="331737"
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <CardTitle>Visibility & Access</CardTitle>
          </div>
          <CardDescription>Control how users can access your community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="community-url" className="text-base font-semibold mb-2 block">
                Community URL
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
                Your community's web address
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex flex-1">
                  <Input 
                    id="community-url" 
                    className="rounded-r-none"
                    value={communityUrl}
                    onChange={(e) => setCommunityUrl(e.target.value)}
                  />
                  <div className="flex items-center px-3 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-md text-gray-500 bg-gray-50 dark:bg-gray-800">
                    .nortech.app
                  </div>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://${communityUrl}.nortech.app`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-left flex items-center gap-2 text-sm" 
                onClick={() => {window.location.href = '/settings/domain'}}
              >
                <Globe className="h-4 w-4" />
                Set up custom domain
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Label className="text-base font-semibold mb-2 block">
                Private Community
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
                Only invited users can join
              </p>
            </div>
            <div className="flex justify-end items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>When enabled, users must be invited to join</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Switch 
                checked={isPrivate} 
                onCheckedChange={setIsPrivate}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="custom-signup-link" className="text-base font-semibold mb-2 block">
                Invitation Link
              </Label>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
                Share this to onboard users
              </p>
            </div>
            <div className="flex gap-2">
              <Input 
                id="custom-signup-link" 
                value={`https://${communityUrl}.nortech.io/signup`}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 flex-1"
              />
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`
        fixed bottom-8 right-8 transition-all duration-200 ease-in-out
        ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
      `}>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          size="lg"
          className="bg-nortech-purple hover:bg-nortech-purple/90 shadow-lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;
