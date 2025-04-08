
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const SSOSettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Provide Single Sign-On (SSO) for your community with an OAuth provider.</h2>
        <a href="#" className="text-blue-400 hover:underline">Learn more</a>
      </div>
      
      <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-md p-4 mb-8">
        <p className="text-yellow-300 flex gap-2">
          If you plan to <a href="#" className="text-blue-400 hover:underline">set up a custom domain</a>, please do so before you set up your SSO integration.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Enable SSO
            </Label>
            <p className="text-gray-400 mt-1">
              You can disable this at any time.
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Enable state param
            </Label>
            <p className="text-gray-400 mt-1">
              Increases security by storing state in the session, adding to the authorization_url and verifying OAuth provider sends correct state param back in the callback.
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Allow members with a Nortech account to sign in
            </Label>
            <p className="text-gray-400 mt-1">
              If enabled, we'll still allow members with a Nortech account to sign in. Only members with your SSO account will be able to sign in otherwise.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-md">
          <Label htmlFor="button-label" className="text-base font-semibold text-white block mb-2">
            Button label
          </Label>
          <p className="text-gray-400 mb-4">
            Customize the label copy for the Nortech sign in button.
          </p>
          <Input 
            id="button-label" 
            className="bg-gray-700 border-gray-600 text-white" 
            defaultValue="Sign in with Nortech"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Allow members to sign up via a custom URL
            </Label>
            <p className="text-gray-400 mt-1">
              After enabling SSO, members won't be able to sign up via Nortech. However, you can keep the Sign up button visible and point it to a custom sign up URL.
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Skip profile confirmation step
            </Label>
            <p className="text-gray-400 mt-1">
              If enabled, members with a preset name will not need to confirm their profile information when they sign in via SSO for the first time.
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="callback-url" className="text-base font-semibold text-white block mb-2">
              OAuth Provider
            </Label>
            <p className="text-gray-400 mb-2">
              Callback URL: https://your-community.nortech.io/oauth2/callback
            </p>
          </div>
          
          <div>
            <Select defaultValue="">
              <option value="" disabled>Select provider</option>
              <option value="memberspace">MemberSpace</option>
              <option value="memberful">Memberful</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="github">GitHub</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="provider-name" className="text-base font-semibold text-white block mb-2">
              Provider Name
            </Label>
            <p className="text-gray-400 mb-2">
              We'll use this name as the suffix of the Continue button. For example, type "MemberSpace" if you want the button to say "Continue with MemberSpace".
            </p>
            <Input 
              id="provider-name" 
              placeholder="Enter value..." 
              className="bg-gray-700 border-gray-600 text-white" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOSettings;
