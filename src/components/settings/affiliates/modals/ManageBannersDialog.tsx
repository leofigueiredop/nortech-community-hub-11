
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Plus, Copy } from 'lucide-react';

interface ManageBannersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BannerItem {
  id: string;
  name: string;
  url: string;
  size: string;
}

const bannerSizes = [
  { value: 'wide', label: 'Wide (728x90)' },
  { value: 'square', label: 'Square (300x250)' },
  { value: 'vertical', label: 'Vertical (160x600)' },
  { value: 'social', label: 'Social Media (1200x630)' },
];

const sampleBanners: Record<string, BannerItem[]> = {
  wide: [
    { id: '1', name: 'Banner 1', url: 'https://via.placeholder.com/728x90/9b87f5/FFFFFF?text=Your+Community+Name', size: '728x90' },
    { id: '2', name: 'Banner 2', url: 'https://via.placeholder.com/728x90/6E59A5/FFFFFF?text=Join+Premium', size: '728x90' },
  ],
  square: [
    { id: '3', name: 'Banner 3', url: 'https://via.placeholder.com/300x250/9b87f5/FFFFFF?text=Premium+Content', size: '300x250' },
  ],
  vertical: [
    { id: '4', name: 'Banner 4', url: 'https://via.placeholder.com/160x600/9b87f5/FFFFFF?text=Join+Now', size: '160x600' },
  ],
  social: [
    { id: '5', name: 'Banner 5', url: 'https://via.placeholder.com/1200x630/9b87f5/FFFFFF?text=Share+With+Friends', size: '1200x630' },
  ],
};

const ManageBannersDialog: React.FC<ManageBannersDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('wide');
  
  const copyBannerCode = (url: string) => {
    const code = `<a href="https://yoursite.com/ref/AFFILIATE_ID"><img src="${url}" alt="Join our community" /></a>`;
    navigator.clipboard.writeText(code);
    // Could add toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Banner Ads</DialogTitle>
          <DialogDescription>
            Upload and manage promotional banners for your affiliates
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Upload size={16} /> Upload New Banner
          </Button>
        </div>

        <Tabs defaultValue="wide" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {bannerSizes.map((size) => (
              <TabsTrigger key={size.value} value={size.value}>
                {size.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {bannerSizes.map((size) => (
            <TabsContent key={size.value} value={size.value} className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {sampleBanners[size.value]?.length > 0 ? (
                  sampleBanners[size.value].map((banner) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{banner.name}</span>
                          <span className="text-xs text-gray-500">({banner.size})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => copyBannerCode(banner.url)}
                          >
                            <Copy size={14} /> Copy Code
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4 flex justify-center bg-gray-100 dark:bg-gray-900">
                        <img 
                          src={banner.url} 
                          alt={banner.name} 
                          className="max-w-full h-auto"
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Plus size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No banners in this size</h3>
                    <p className="text-gray-500 mb-4">
                      Upload {size.label} banners for your affiliates to use
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Upload Banner
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageBannersDialog;
