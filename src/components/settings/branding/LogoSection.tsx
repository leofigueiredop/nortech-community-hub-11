
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileImage, X } from 'lucide-react';

const LogoSection: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);

  const handleImageUpload = (setter: (value: string | null) => void) => {
    // Simulated upload - in real app would handle actual file upload
    setter("/lovable-uploads/598c2a9d-a24a-4854-ba20-b22476ca4f7b.png");
  };

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
                className="w-full h-24 flex items-center justify-center"
                onClick={() => handleImageUpload(setLogo)}
              >
                {logo ? (
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
                        setLogo(null);
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
                className="w-full h-24 flex items-center justify-center"
                onClick={() => handleImageUpload(setIcon)}
              >
                {icon ? (
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
                        setIcon(null);
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
                className="w-full h-32 flex items-center justify-center"
                onClick={() => handleImageUpload(setOgImage)}
              >
                {ogImage ? (
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
                        setOgImage(null);
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
