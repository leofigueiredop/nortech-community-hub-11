
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-8">General</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 mb-4">
          <h2 className="text-xl font-semibold mb-8 text-white">Manage general settings</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-name" className="text-base font-semibold text-white mb-2 block">
                  Community name
                </Label>
                <p className="text-gray-400 mb-2">Choose a name that personalizes your community.</p>
              </div>
              <div>
                <Input 
                  id="community-name" 
                  placeholder="Your community name" 
                  className="bg-gray-700 border-gray-600 text-white" 
                  defaultValue="Pablo's Community"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="default-language" className="text-base font-semibold text-white mb-2 block">
                  Default language
                </Label>
                <p className="text-gray-400 mb-2">This will be the default language for new community members.</p>
              </div>
              <div>
                <Select defaultValue="english">
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="portuguese">Portuguese</option>
                  <option value="french">French</option>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-id" className="text-base font-semibold text-white mb-2 block">
                  Community ID
                </Label>
                <p className="text-gray-400 mb-2">Customer support may ask for your unique community ID when troubleshooting.</p>
              </div>
              <div>
                <Input 
                  id="community-id" 
                  className="bg-gray-700 border-gray-600 text-white" 
                  defaultValue="331737"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-8 text-white">Visibility</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="community-url" className="text-base font-semibold text-white mb-2 block">
                  Community URL
                </Label>
                <p className="text-gray-400 mb-2">
                  <a href="#" className="text-blue-400 hover:underline">Set up your custom domain here</a>
                </p>
              </div>
              <div className="flex">
                <Input 
                  id="community-url" 
                  className="bg-gray-700 border-gray-600 text-white rounded-r-none" 
                  defaultValue="pablos-community-9de6a"
                />
                <div className="flex items-center bg-gray-700 px-3 border border-l-0 border-gray-600 rounded-r-md text-gray-400">
                  .circle.so
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 items-center">
              <div>
                <Label className="text-base font-semibold text-white mb-2 block">
                  Make this a private community
                </Label>
                <p className="text-gray-400 mb-2">
                  Your community will not be accessible to visitors. Members will have to be invited by you and sign in to access your community.
                </p>
              </div>
              <div className="flex justify-end">
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="custom-signup-link" className="text-base font-semibold text-white mb-2 block">
                  Custom member sign up link
                </Label>
                <p className="text-gray-400 mb-2">
                  Use this link to invite members to your community.
                </p>
              </div>
              <div>
                <Input 
                  id="custom-signup-link" 
                  className="bg-gray-700 border-gray-600 text-white" 
                  defaultValue="https://pablos-community-9de6a.circle.so/signup"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
