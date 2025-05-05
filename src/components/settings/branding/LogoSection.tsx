import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileImage, X, Loader2 } from 'lucide-react';
import { StorageService } from '@/api/services/StorageService';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface LogoSectionProps {
  initialLogo?: string;
  initialIcon?: string;
  initialOgImage?: string;
  onLogoChange?: (url: string) => void;
  onIconChange?: (url: string) => void;
  onOgImageChange?: (url: string) => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({
  initialLogo,
  initialIcon,
  initialOgImage,
  onLogoChange,
  onIconChange,
  onOgImageChange
}) => {
  const { communityContext } = useAuth();
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [icon, setIcon] = useState<string | null>(initialIcon || null);
  const [ogImage, setOgImage] = useState<string | null>(initialOgImage || null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File, type: 'logo' | 'icon' | 'og') => {
    if (!file || !communityContext?.communityId) return;

    try {
      setIsUploading(type);
      
      // Create custom filename based on type
      const fileExt = file.name.split('.').pop();
      const customFileName = `${type}.${fileExt}`;
      
      const url = await StorageService.uploadFile(
        file,
        'branding',
        communityContext.communityId,
        {
          customFileName,
          contentType: file.type
        }
      );

      switch (type) {
        case 'logo':
          setLogo(url);
          onLogoChange?.(url);
          break;
        case 'icon':
          setIcon(url);
          onIconChange?.(url);
          break;
        case 'og':
          setOgImage(url);
          onOgImageChange?.(url);
          break;
      }

      toast({
        title: 'Upload successful',
        description: 'Your image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleImageUpload = (type: 'logo' | 'icon' | 'og') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file, type);
      }
    };
    input.click();
  };

  const handleRemoveImage = async (type: 'logo' | 'icon' | 'og', url: string) => {
    if (!communityContext?.communityId) return;

    try {
      // Extract filename from URL
      const fileName = url.split('/').pop();
      if (fileName) {
        await StorageService.deleteFile(communityContext.communityId, 'branding', fileName);
      }

      switch (type) {
        case 'logo':
          setLogo(null);
          onLogoChange?.('');
          break;
        case 'icon':
          setIcon(null);
          onIconChange?.('');
          break;
        case 'og':
          setOgImage(null);
          onOgImageChange?.('');
          break;
      }

      toast({
        title: 'Image removed',
        description: 'The image has been removed successfully.',
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting your image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!communityContext?.communityId) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Please select a community to manage branding assets.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5 text-gray-500" />
          <CardTitle>Logo & Images</CardTitle>
        </div>
        <CardDescription>Upload your community's visual assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Community Logo (240x60 – 4:1 ratio)
            </Label>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full h-24 flex items-center justify-center relative"
                onClick={() => handleImageUpload('logo')}
                disabled={isUploading === 'logo'}
              >
                {isUploading === 'logo' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : logo ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={logo} 
                      alt="Logo preview" 
                      className="object-contain w-full h-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (logo) handleRemoveImage('logo', logo);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  "Upload Logo"
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-2 block">
              App/Browser Icon (32x32)
            </Label>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full h-24 flex items-center justify-center relative"
                onClick={() => handleImageUpload('icon')}
                disabled={isUploading === 'icon'}
              >
                {isUploading === 'icon' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : icon ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={icon} 
                      alt="Icon preview" 
                      className="object-contain w-full h-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (icon) handleRemoveImage('icon', icon);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  "Upload Icon"
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-2 block">
              Social Sharing Preview Image (1200x630 recommended)
            </Label>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full h-32 flex items-center justify-center relative"
                onClick={() => handleImageUpload('og')}
                disabled={isUploading === 'og'}
              >
                {isUploading === 'og' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : ogImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={ogImage} 
                      alt="OG image preview" 
                      className="object-cover w-full h-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ogImage) handleRemoveImage('og', ogImage);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoSection;
