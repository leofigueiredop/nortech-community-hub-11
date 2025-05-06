import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileImage, X, Loader2 } from 'lucide-react';
import { StorageService } from '@/api/services/StorageService';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface LogoSectionProps {
  initialLogo?: string | null;
  initialIcon?: string | null;
  initialOgImage?: string | null;
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('LogoSection mounted with community context:', communityContext);
    if (communityContext?.community) {
      setLogo(communityContext.community.logo_url || null);
      setIcon(communityContext.community.icon_url || null);
      setOgImage(communityContext.community.og_image_url || null);
    }
  }, [communityContext]);

  const handleFileSelect = async (file: File, type: 'logo' | 'icon' | 'og') => {
    if (!file || !communityContext?.community?.id) {
      toast({
        title: 'Upload failed',
        description: 'Community context not found. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    // Reset error state
    setUploadError(null);

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 5MB.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, GIF, or WebP file.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsUploading(type);

      const path = `${communityContext.community.id}/${type}`;
      const url = await StorageService.uploadFile(file, 'community-assets', path, {
        maxSizeMB: 5,
        contentType: file.type
      });

      if (!url) throw new Error('Upload failed');

      // Update state based on type
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
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been updated.`
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadError(`Failed to upload ${type}. Please try again.`);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleRemove = (type: 'logo' | 'icon' | 'og') => {
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
  };

  if (!communityContext?.community?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logo & Images</CardTitle>
          <CardDescription>
            Please select a community to manage branding assets.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo & Images</CardTitle>
        <CardDescription>
          Upload your community logo and other brand assets. Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload Section */}
        <div className="space-y-2">
          <Label>Community Logo</Label>
          <div className="flex items-center gap-4">
            {logo ? (
              <div className="relative h-20 w-20">
                <img
                  src={logo}
                  alt="Community Logo"
                  className="h-full w-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2"
                  onClick={() => handleRemove('logo')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'logo')}
                ref={fileInputRef}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading === 'logo'}
              >
                {isUploading === 'logo' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Logo'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Icon Upload Section */}
        <div className="space-y-2">
          <Label>Community Icon</Label>
          <div className="flex items-center gap-4">
            {icon ? (
              <div className="relative h-20 w-20">
                <img
                  src={icon}
                  alt="Community Icon"
                  className="h-full w-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2"
                  onClick={() => handleRemove('icon')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'icon')}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading === 'icon'}
              >
                {isUploading === 'icon' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Icon'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* OG Image Upload Section */}
        <div className="space-y-2">
          <Label>Social Share Image</Label>
          <div className="flex items-center gap-4">
            {ogImage ? (
              <div className="relative h-20 w-20">
                <img
                  src={ogImage}
                  alt="Social Share Image"
                  className="h-full w-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2"
                  onClick={() => handleRemove('og')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'og')}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading === 'og'}
              >
                {isUploading === 'og' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Social Image'
                )}
              </Button>
            </div>
          </div>
        </div>

        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LogoSection;
