
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const DomainSettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <h2 className="text-xl mb-6">To use a custom domain for your Circle community, please follow these steps.</h2>
      
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Enter your custom domain</h3>
            <Input 
              placeholder="Example: custom.my-community.com" 
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Set up a CNAME record in your DNS provider</h3>
            <p className="text-gray-300 mb-4">
              To configure your custom domain, you'll need to add a CNAME record pointing your custom domain to your Circle subdomain in your DNS provider.
            </p>
            
            <div className="bg-gray-800 rounded-md overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400">TYPE</th>
                    <th className="text-left p-4 text-gray-400">HOST/NAME</th>
                    <th className="text-left p-4 text-gray-400">TARGET/VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4">CNAME</td>
                    <td className="p-4">my-custom-subdomain</td>
                    <td className="p-4">pablos-community-9de6af.circle.so</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="space-y-2">
              <a href="#" className="text-blue-400 hover:underline flex items-center gap-2">
                <span className="text-blue-400">→</span>
                Check out our guide if you need help
              </a>
              <a href="#" className="text-blue-400 hover:underline flex items-center gap-2">
                <span className="text-blue-400">→</span>
                Use this tool to validate the CNAME record
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button>Setup domain</Button>
      </div>
    </div>
  );
};

export default DomainSettings;
