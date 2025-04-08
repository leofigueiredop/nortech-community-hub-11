
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GripVertical, MoreHorizontal } from 'lucide-react';

const MobileSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-8">Mobile App</h1>
      
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Manage the mobile app experience for your community</h2>
        
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Allow my members to access my community from Circle's iOS and Android app
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, your members will be able to sign in to your community via the Circle Communities iOS and Android app.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Reorder Home tabs</h3>
            <p className="text-gray-400 mb-6">Drag and drop to reorder top navigation your members will see in the mobile app</p>
            
            <div className="space-y-2">
              <div className="bg-gray-950 rounded-md p-4 text-white">
                <div className="uppercase text-xs font-semibold mb-3">MENU TITLE</div>
                
                <div className="border-b border-gray-700 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Feed</span>
                    </div>
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </div>
                </div>
                
                <div className="border-b border-gray-700 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Spaces</span>
                    </div>
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </div>
                </div>
                
                <div className="border-b border-gray-700 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Members</span>
                    </div>
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </div>
                </div>
                
                <div className="border-b border-gray-700 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Courses</span>
                    </div>
                    <span className="text-blue-400 text-xs">Unavailable</span>
                  </div>
                </div>
                
                <div className="border-b border-gray-700 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Leaderboard</span>
                    </div>
                    <span className="text-orange-400 text-xs">Disabled</span>
                  </div>
                </div>
                
                <div className="pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-500" />
                      <span>Events</span>
                    </div>
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-white block">
                Show app download banner on mobile browsers and outbound emails
              </Label>
              <p className="text-gray-400 mt-1">
                If enabled, members will see a banner to download Circle's iOS and Android app for easy access to your community across web browsers and in outbound emails.
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

export default MobileSettings;
