
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const MessagingSettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-8">Manage your community messaging capabilities</h2>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Enable messaging
            </Label>
            <p className="text-gray-400 mt-1">
              Allow this community to use messaging across web, workflows and mobile.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="pl-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Enable member to member messaging
              </Label>
              <p className="text-gray-400 mt-1">
                When disabled, members can't send direct messages and can chat only with admins in existing chat rooms. Existing direct rooms with members will be hidden. Admins can always message members.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Enable group messaging
              </Label>
              <p className="text-gray-400 mt-1">
                When disabled, existing group chat rooms will be hidden from all your members and members won't be able to create new rooms.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Enable voice messaging
              </Label>
              <p className="text-gray-400 mt-1">
                When disabled, members won't be able to send and receive voice messages.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSettings;
