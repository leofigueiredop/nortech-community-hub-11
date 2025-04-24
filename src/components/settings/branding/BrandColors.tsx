
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Palette, RotateCcw } from 'lucide-react';

interface BrandColorsProps {
  brandColor: string;
  brandColorDark: string;
  onBrandColorChange: (color: string) => void;
  onBrandColorDarkChange: (color: string) => void;
}

const BrandColors: React.FC<BrandColorsProps> = ({
  brandColor,
  brandColorDark,
  onBrandColorChange,
  onBrandColorDarkChange
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-gray-500" />
          <CardTitle>Brand Colors</CardTitle>
        </div>
        <CardDescription>Customize your community's visual identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Button Color (Light Theme)
            </Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded border border-gray-300" 
                style={{ backgroundColor: brandColor }}
              />
              <Input 
                value={brandColor}
                onChange={(e) => onBrandColorChange(e.target.value)}
                className="font-mono w-32"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onBrandColorChange("#2B2E33")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset to default color</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex-1">
                <Button className="ml-4" style={{ backgroundColor: brandColor }}>
                  Preview Button
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-2 block">
              Button Color (Dark Theme)
            </Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded border border-gray-300" 
                style={{ backgroundColor: brandColorDark }}
              />
              <Input 
                value={brandColorDark}
                onChange={(e) => onBrandColorDarkChange(e.target.value)}
                className="font-mono w-32"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onBrandColorDarkChange("#FFFFFF")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset to default color</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex-1">
                <Button className="ml-4 dark" style={{ backgroundColor: brandColorDark }}>
                  Preview Button
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandColors;
