
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const BrandingSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-8">Branding</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-8">
        <div className="relative">
          <img 
            src="/lovable-uploads/eb471fa8-1a1b-4969-93e9-95c99a0cfcfb.png" 
            alt="Branded app banner" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Launch your own branded app</h2>
              <Button variant="outline" className="bg-black/20 text-white border-white/30 hover:bg-black/40">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 items-center">
          <div>
            <Label htmlFor="brand-color" className="text-base font-semibold mb-2 block">
              Brand color
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Customize your button color to match your brand.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-gray-300 bg-[#2B2E33]"></div>
            <Input 
              id="brand-color" 
              defaultValue="#2B2E33" 
              className="font-mono"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 items-center">
          <div>
            <Label htmlFor="brand-color-dark" className="text-base font-semibold mb-2 block">
              Brand color (dark mode)
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Customize your button color to match your brand in dark mode.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-gray-300 bg-white"></div>
            <Input 
              id="brand-color-dark" 
              defaultValue="#FFFFFF" 
              className="font-mono"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="logo" className="text-base font-semibold mb-2 block">
              Logo
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Recommended dimensions: 240 x 60, 4:1 aspect ratio.
            </p>
          </div>
          <div>
            <Button variant="outline" className="w-full h-32 flex items-center justify-center">
              Select image
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="icon" className="text-base font-semibold mb-2 block">
              Icon
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Recommended dimensions: 32 x 32
            </p>
          </div>
          <div>
            <Button variant="outline" className="w-full h-32 flex items-center justify-center">
              Select image
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="og-image" className="text-base font-semibold mb-2 block">
              Default Open Graph Image
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              This image will be used as the default when your community link is shared on social media.
            </p>
          </div>
          <div>
            <Button variant="outline" className="w-full h-32 flex items-center justify-center">
              Select image
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="reply-email" className="text-base font-semibold mb-2 block">
              Reply-to email
            </Label>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Email address that will receive replies to notification emails.
            </p>
          </div>
          <div>
            <Input 
              id="reply-email" 
              placeholder="Enter reply-to email"
              defaultValue="p.mani@alphractal.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
