
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
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

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-8">General</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 mb-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-8">Manage general settings</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-name" className="text-base font-semibold mb-2 block">
                  Community name
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Choose a name that personalizes your community.</p>
              </div>
              <div>
                <Input 
                  id="community-name" 
                  placeholder="Your community name" 
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="default-language" className="text-base font-semibold mb-2 block">
                  Default language
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">This will be the default language for new community members.</p>
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
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-id" className="text-base font-semibold mb-2 block">
                  Community ID
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Customer support may ask for your unique community ID when troubleshooting.</p>
              </div>
              <div>
                <Input 
                  id="community-id" 
                  value="331737"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-8">Visibility</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-url" className="text-base font-semibold mb-2 block">
                  Community URL
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  <a href="#" className="text-blue-600 hover:underline">Set up your custom domain here</a>
                </p>
              </div>
              <div className="flex">
                <Input 
                  id="community-url" 
                  className="rounded-r-none"
                  value={communityUrl}
                  onChange={(e) => setCommunityUrl(e.target.value)}
                />
                <div className="flex items-center px-3 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-md text-gray-500">
                  .nortech.io
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 items-center">
              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Make this a private community
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Your community will not be accessible to visitors. Members will have to be invited by you and sign in to access your community.
                </p>
              </div>
              <div className="flex justify-end">
                <Switch 
                  checked={isPrivate} 
                  onCheckedChange={setIsPrivate} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="custom-signup-link" className="text-base font-semibold mb-2 block">
                  Custom member sign up link
                </Label>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Use this link to invite members to your community.
                </p>
              </div>
              <div>
                <Input 
                  id="custom-signup-link" 
                  value={`https://${communityUrl}.nortech.io/signup`}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-nortech-purple hover:bg-nortech-purple/90"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
