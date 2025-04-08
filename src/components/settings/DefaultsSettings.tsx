
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const DefaultsSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-8">Defaults</h1>
      
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Enable community switcher
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, members who belong to multiple Circle communities will see a community switcher element on the left to make switching easier, and your community will be visible as a switching option on other communities.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Allow my members to deactivate their account
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, your members will be able to deactivate their own account.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Allow search engines to index member profiles
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, member profiles will be indexed by search engines.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Truncate post/comment body in email notifications
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, the body of a post or comment will be truncated in email notifications with a 'Read more' link that links out to the full page.
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Customize call-to-action for private post share links
              </Label>
              <p className="text-gray-400 mt-1">
                You can customize the call-to-action box that is displayed at the bottom of share links generated for private posts to logged out visitors.
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <Label htmlFor="default-search-sorting" className="text-base font-semibold text-white block">
                Default search sorting
              </Label>
              <p className="text-gray-400 mt-1">
                Set the default sorting members see for search results
              </p>
            </div>
            <div>
              <Select defaultValue="relevance">
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Hide emails on member profiles
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, email addresses will not be visible on member profiles to members of the community. Admins will still be able to see them.
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Allow members to go live
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, every member in your community will be able to start a live room or live stream at any time. Please enable this with extra caution.
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Enforce email verification for new signups
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, new members on public communities will be required to verify their emails with a one-time passcode (OTP) when they sign up. Only applicable to non-SSO Circle accounts.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultsSettings;
