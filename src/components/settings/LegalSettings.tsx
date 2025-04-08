
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LegalSettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-8">Manage your community legal notices</h2>
      
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="legal-email" className="text-base font-semibold text-white block mb-2">
              Legal email
            </Label>
            <p className="text-gray-400 mb-2">
              This email address will be shown in your terms of service and privacy policy.
            </p>
          </div>
          <div>
            <Input 
              id="legal-email" 
              placeholder="Enter legal email" 
              className="bg-gray-800 border-gray-700 text-white" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="legal-address" className="text-base font-semibold text-white block mb-2">
              Legal address
            </Label>
            <p className="text-gray-400 mb-2">
              This address will be shown in your terms of service and privacy policy.
            </p>
          </div>
          <div>
            <Input 
              id="legal-address" 
              placeholder="Enter legal address" 
              className="bg-gray-800 border-gray-700 text-white" 
            />
          </div>
        </div>
        
        <div className="h-px bg-gray-800 my-8"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Terms of service</h3>
            <p className="text-gray-400 mt-1">
              New members will have to agree to these terms to be able to sign up to your community.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-white border-gray-700">Copy URL</Button>
            <Button variant="outline" className="text-white border-gray-700">View</Button>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Switch id="custom-terms" />
          <div>
            <Label htmlFor="custom-terms" className="text-base font-semibold text-white block">
              Add additional terms to the terms of service
            </Label>
            <p className="text-gray-400 mt-1">
              Your custom terms will be displayed at the bottom as Exhibit A.
            </p>
          </div>
        </div>
        
        <div className="h-px bg-gray-800 my-8"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Privacy policy</h3>
            <p className="text-gray-400 mt-1">
              New members will have to agree to this privacy notice to be able to sign up to your community.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-white border-gray-700">Copy URL</Button>
            <Button variant="outline" className="text-white border-gray-700">View</Button>
          </div>
        </div>
        
        <RadioGroup defaultValue="template">
          <div className="flex items-start gap-2 mb-4">
            <RadioGroupItem value="template" id="template" className="mt-1" />
            <div>
              <Label htmlFor="template" className="text-base font-semibold text-white block">
                Use Circle's privacy policy template
              </Label>
            </div>
          </div>
          
          <div className="flex items-start gap-2 mb-4">
            <RadioGroupItem value="custom" id="custom" className="mt-1" />
            <div>
              <Label htmlFor="custom" className="text-base font-semibold text-white block">
                Create your own privacy policy (Recommended)
              </Label>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <RadioGroupItem value="link" id="link" className="mt-1" />
            <div>
              <Label htmlFor="link" className="text-base font-semibold text-white block">
                Please provide a link to your own privacy policy page
              </Label>
            </div>
          </div>
        </RadioGroup>
        
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export default LegalSettings;
