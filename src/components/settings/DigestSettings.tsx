
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Image, SmilePlus } from 'lucide-react';

const DigestSettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <p className="mb-8">
        Weekly digest emails include a personalized summary of the week's popular posts, comments, and more. Every member will receive a digest featuring content only from the spaces they are a member of.
      </p>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-white block">
              Enable weekly digest
            </Label>
            <p className="text-gray-400 mt-1">
              If enabled, a personalized weekly digest will be sent to your members starting at 9am PT on Thursdays. Emails may take up to 4-5 hours to be sent and members have the option to unsubscribe from these emails.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="digest-subject" className="text-base font-semibold text-white">
                Subject
              </Label>
              <div className="text-gray-400">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-xs">?</span>
              </div>
            </div>
            <Input 
              id="digest-subject" 
              placeholder="Subject" 
              className="bg-gray-900 border-gray-700 text-white" 
              defaultValue="This week on Pablo's Community: April 1 - April 8, 2025"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="digest-introduction" className="text-base font-semibold text-white">
                Introduction
              </Label>
              <div className="text-gray-400">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-xs">?</span>
              </div>
            </div>
            <Textarea 
              id="digest-introduction" 
              placeholder="Introduction" 
              className="bg-gray-900 border-gray-700 text-white min-h-[150px]" 
              defaultValue="This introduction will be added to the top of all future digests. You can set a permanent introduction for all digests, or update it weekly before 9am PT on Thursdays to use it as a newsletter."
            />
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Bold size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Image size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <SmilePlus size={18} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-white block">
                  Hide popular posts
                </Label>
                <p className="text-gray-400 mt-1">
                  If enabled, the popular posts section will be hidden from the weekly digest.
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-white block">
                  Hide popular comments
                </Label>
                <p className="text-gray-400 mt-1">
                  If enabled, the popular comments section will be hidden from the weekly digest.
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-white block">
                  Hide stats
                </Label>
                <p className="text-gray-400 mt-1">
                  If enabled, the stats section will be hidden from the weekly digest.
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-white block">
                  Hide new members
                </Label>
                <p className="text-gray-400 mt-1">
                  If enabled, the new members section will be hidden from the weekly digest.
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export default DigestSettings;
