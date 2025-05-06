import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Palette, Upload, Image, RefreshCw, FileImage, Sparkles } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const BrandingSettings: React.FC = () => {
  const { toast } = useToast();
  const { community } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#6E56CF");
  const [secondaryColor, setSecondaryColor] = useState("#4A36A0");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#F9FAFB");
  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSecondaryColorPickerOpen, setIsSecondaryColorPickerOpen] = useState(false);
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isBgColorPickerOpen, setIsBgColorPickerOpen] = useState(false);

  // Load initial branding data
  useEffect(() => {
    const loadBrandingData = async () => {
      if (!community?.id) return;

      try {
        // Os dados já estarão no contexto de auth
        setLogo(community.logo_url);
        
        if (community.theme_config) {
          setPrimaryColor(community.theme_config.primary_color || "#6E56CF");
          setSecondaryColor(community.theme_config.secondary_color || "#4A36A0");
          setTextColor(community.theme_config.text_color || "#FFFFFF");
          setBgColor(community.theme_config.background_color || "#F9FAFB");
        }
      } catch (error) {
        console.error('Error loading branding data:', error);
        toast({
          title: "Error loading branding data",
          description: "There was an error loading your branding settings.",
          variant: "destructive"
        });
      }
    };

    loadBrandingData();
  }, [community]);
  
  const handleSaveSettings = async () => {
    if (!community?.id) {
      toast({
        title: "Error",
        description: "No community context found. Please reload the page.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('communities')
        .update({
          logo_url: logo,
          theme_config: {
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            text_color: textColor,
            background_color: bgColor
          }
        })
        .eq('id', community.id);

      if (error) throw error;

      // Update CSS variables for immediate visual feedback
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--secondary', secondaryColor);
      
      toast({
        title: "Changes Saved Successfully",
        description: "Your branding settings were updated successfully",
      });
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast({
        title: "Error saving changes",
        description: "There was an error saving your branding settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = async (file: File, type: 'logo' | 'favicon') => {
    if (!community?.id) {
      toast({
        title: "Error",
        description: "No community context found. Please reload the page.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${community.id}/${type}/${fileName}`;

      // Verificar tamanho do arquivo (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size exceeds 2MB limit');
      }

      const { error: uploadError } = await supabase.storage
        .from('community-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community-assets')
        .getPublicUrl(filePath);

      if (type === 'logo') {
        setLogo(publicUrl);
      } else if (type === 'favicon') {
        setFavicon(publicUrl);
      }
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded`,
        description: `Your ${type} has been uploaded. Don't forget to save changes.`,
      });
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: `Error uploading ${type}`,
        description: error.message || `There was an error uploading your ${type}. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Branding Settings</h2>
          <p className="text-muted-foreground">
            Customize your community's visual identity
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="colors">Brand Colors</TabsTrigger>
          <TabsTrigger value="logos">Logos & Icons</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Brand Color Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure the colors that will be used throughout your community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    Primary Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer shadow-sm" 
                          style={{ backgroundColor: primaryColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none">
                        <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                        <div className="p-2 bg-white border-t">
                          <Input 
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="font-mono w-32"
                    />
                    <Button className="ml-2" style={{ backgroundColor: primaryColor, color: textColor }}>
                      Preview
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for primary buttons, links, and brand accent elements
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    Secondary Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Popover open={isSecondaryColorPickerOpen} onOpenChange={setIsSecondaryColorPickerOpen}>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer shadow-sm" 
                          style={{ backgroundColor: secondaryColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none">
                        <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                        <div className="p-2 bg-white border-t">
                          <Input 
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="font-mono w-32"
                    />
                    <Button className="ml-2" style={{ backgroundColor: secondaryColor, color: textColor }}>
                      Preview
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for secondary UI elements, buttons, and accents
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    Text Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Popover open={isTextColorPickerOpen} onOpenChange={setIsTextColorPickerOpen}>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer shadow-sm" 
                          style={{ backgroundColor: textColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none">
                        <HexColorPicker color={textColor} onChange={setTextColor} />
                        <div className="p-2 bg-white border-t">
                          <Input 
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="font-mono w-32"
                    />
                    <div className="ml-2 flex items-center justify-center h-10 px-4 rounded-md border" 
                         style={{ backgroundColor: primaryColor, color: textColor }}>
                      Text Preview
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Text color on primary/secondary colored backgrounds
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    Background Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Popover open={isBgColorPickerOpen} onOpenChange={setIsBgColorPickerOpen}>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer shadow-sm" 
                          style={{ backgroundColor: bgColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none">
                        <HexColorPicker color={bgColor} onChange={setBgColor} />
                        <div className="p-2 bg-white border-t">
                          <Input 
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="font-mono w-32"
                    />
                    <div className="ml-2 h-10 w-14 border rounded-md flex items-center justify-center"
                         style={{ backgroundColor: bgColor }}>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Main background color for light theme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                <CardTitle>Logo & Images</CardTitle>
              </div>
              <CardDescription>
                Upload your community logo and other visual assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    Community Logo (240x60 - 4:1 ratio)
                  </Label>
                  <div className="flex flex-col space-y-3">
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-32">
                      {logo ? (
                        <img
                          src={logo}
                          alt="Community Logo"
                          className="max-h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileImage className="h-10 w-10 mb-2" />
                          <span>No logo uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        id="logo-upload"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'logo')}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="flex gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      
                      {logo && (
                        <Button
                          variant="ghost"
                          onClick={() => setLogo(null)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 240x60 pixels (4:1 ratio). Max 2MB. PNG, JPG, GIF, WEBP formats.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold block">
                    App/Browser Icon (32x32)
                  </Label>
                  <div className="flex flex-col space-y-3">
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-32">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt="Community Favicon"
                          className="max-h-20 object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileImage className="h-10 w-10 mb-2" />
                          <span>No icon uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/x-icon,image/vnd.microsoft.icon"
                        className="hidden"
                        id="favicon-upload"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'favicon')}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('favicon-upload')?.click()}
                        className="flex gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Icon
                      </Button>
                      
                      {favicon && (
                        <Button
                          variant="ghost"
                          onClick={() => setFavicon(null)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 32x32 pixels (square). Max 1MB. PNG, JPG, ICO formats.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Brand Preview</CardTitle>
              </div>
              <CardDescription>
                Preview how your branding will look throughout your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden bg-white dark:bg-gray-950">
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                  {logo ? (
                    <img src={logo} alt="Community Logo" className="h-8" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                      <span className="font-semibold">Your Community</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                    <Button variant="ghost" size="sm">Content</Button>
                    <Button variant="ghost" size="sm">Members</Button>
                    <Button variant="outline" size="sm">Invite</Button>
                    <Button size="sm" style={{ backgroundColor: primaryColor, color: textColor }}>
                      Upgrade
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="rounded-lg border p-4 mb-4">
                      <h3 className="font-semibold mb-2">Welcome to your community!</h3>
                      <p className="text-gray-500 text-sm mb-3">
                        This is a preview of how your community's branding will look.
                      </p>
                      <div className="flex gap-2">
                        <Button style={{ backgroundColor: primaryColor, color: textColor }}>
                          Primary Button
                        </Button>
                        <Button style={{ backgroundColor: secondaryColor, color: textColor }}>
                          Secondary
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/2 h-24 rounded-lg border flex items-center justify-center"
                           style={{ backgroundColor: primaryColor, color: textColor }}>
                        Primary Card
                      </div>
                      <div className="w-1/2 h-24 rounded-lg border flex items-center justify-center"
                           style={{ backgroundColor: secondaryColor, color: textColor }}>
                        Secondary Card
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                        <div className="h-2.5 rounded-full" style={{ width: '70%', backgroundColor: primaryColor }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button style={{ backgroundColor: primaryColor, color: textColor }}>
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-8 right-8">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving || !community?.id}
          size="lg"
          className="shadow-lg"
          style={{ backgroundColor: primaryColor, color: textColor }}
        >
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
