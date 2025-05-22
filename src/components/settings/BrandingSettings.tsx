import React, { useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Palette, Upload, Image, RefreshCw, FileImage, Sparkles, Layers, Grid, RotateCcw, Wand2, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { predefinedThemes, defaultTheme } from '@/utils/predefinedThemes';
import imageCompression from 'browser-image-compression';
import ThemeContext from '@/context/ThemeContext';

// Função local caso a importação direta não funcione
const useTheme = () => useContext(ThemeContext);

const BrandingSettings: React.FC = () => {
  const { toast } = useToast();
  const { community } = useAuth();
  const { colors, updateThemeColors } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estado inicial expandido com as novas opções de cores
  const [initialValues, setInitialValues] = useState({
    primaryColor: "#6E56CF",
    secondaryColor: "#4A36A0",
    textColor: "#FFFFFF",
    bgColor: "#F9FAFB",
    cardColor: "#FFFFFF",
    mutedColor: "#F1F5F9",
    accentColor: "#0EA5E9",
    borderColor: "#E2E8F0",
    logo: null as string | null,
    favicon: null as string | null
  });
  
  // Estados para cada cor
  const [primaryColor, setPrimaryColor] = useState(initialValues.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialValues.secondaryColor);
  const [textColor, setTextColor] = useState(initialValues.textColor);
  const [bgColor, setBgColor] = useState(initialValues.bgColor);
  const [cardColor, setCardColor] = useState(initialValues.cardColor);
  const [mutedColor, setMutedColor] = useState(initialValues.mutedColor);
  const [accentColor, setAccentColor] = useState(initialValues.accentColor);
  const [borderColor, setBorderColor] = useState(initialValues.borderColor);
  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  
  // Estados para controle de popover de cada cor
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSecondaryColorPickerOpen, setIsSecondaryColorPickerOpen] = useState(false);
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isBgColorPickerOpen, setIsBgColorPickerOpen] = useState(false);
  const [isCardColorPickerOpen, setIsCardColorPickerOpen] = useState(false);
  const [isMutedColorPickerOpen, setIsMutedColorPickerOpen] = useState(false);
  const [isAccentColorPickerOpen, setIsAccentColorPickerOpen] = useState(false);
  const [isBorderColorPickerOpen, setIsBorderColorPickerOpen] = useState(false);

  // Load initial branding data
  useEffect(() => {
    const loadBrandingData = async () => {
      if (!community?.id) return;

      try {
        // Use ThemeContext colors as initial values
        const newInitialValues = {
          primaryColor: colors.primaryColor,
          secondaryColor: colors.secondaryColor,
          textColor: colors.textColor,
          bgColor: colors.backgroundColor,
          cardColor: colors.cardColor,
          mutedColor: colors.mutedColor,
          accentColor: colors.accentColor,
          borderColor: colors.borderColor,
          logo: community.logo_url,
          favicon: null
        };
        
        setInitialValues(newInitialValues);
        setPrimaryColor(newInitialValues.primaryColor);
        setSecondaryColor(newInitialValues.secondaryColor);
        setTextColor(newInitialValues.textColor);
        setBgColor(newInitialValues.bgColor);
        setCardColor(newInitialValues.cardColor);
        setMutedColor(newInitialValues.mutedColor);
        setAccentColor(newInitialValues.accentColor);
        setBorderColor(newInitialValues.borderColor);
        setLogo(newInitialValues.logo);
        setHasChanges(false);
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
  }, [community, colors]);

  // Check for changes
  useEffect(() => {
    const hasColorChanges = 
      primaryColor !== initialValues.primaryColor ||
      secondaryColor !== initialValues.secondaryColor ||
      textColor !== initialValues.textColor ||
      bgColor !== initialValues.bgColor ||
      cardColor !== initialValues.cardColor ||
      mutedColor !== initialValues.mutedColor ||
      accentColor !== initialValues.accentColor ||
      borderColor !== initialValues.borderColor ||
      logo !== initialValues.logo ||
      favicon !== initialValues.favicon;
    
    setHasChanges(hasColorChanges);
  }, [primaryColor, secondaryColor, textColor, bgColor, cardColor, mutedColor, accentColor, borderColor, logo, favicon, initialValues]);

  const handleUpdateColor = (color: string, setter: (color: string) => void) => {
    setter(color);
  };

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
            background_color: bgColor,
            card_color: cardColor,
            muted_color: mutedColor,
            accent_color: accentColor,
            border_color: borderColor
          }
        })
        .eq('id', community.id);

      if (error) throw error;

      // Update theme context
      updateThemeColors({
        primaryColor,
        secondaryColor,
        textColor,
        backgroundColor: bgColor,
        cardColor,
        mutedColor,
        accentColor,
        borderColor
      });
      
      // Forçar uma atualização da DOM para aplicar o tema
      // Isso é importante especialmente para temas escuros
      setTimeout(() => {
        document.documentElement.style.setProperty('--refresh-trigger', Date.now().toString());
      }, 100);
      
      // Update initial values to match current values
      setInitialValues({
        primaryColor,
        secondaryColor,
        textColor,
        bgColor,
        cardColor,
        mutedColor,
        accentColor,
        borderColor,
        logo,
        favicon
      });
      
      setHasChanges(false);
      
      toast({
        title: "Alterações salvas com sucesso",
        description: "As configurações de branding da sua comunidade foram atualizadas com sucesso",
        style: isColorDark(bgColor) ? {
          backgroundColor: cardColor,
          color: getTextColor(cardColor),
          border: `1px solid ${borderColor}`
        } : undefined
      });
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast({
        title: "Erro ao salvar alterações",
        description: "Houve um erro ao salvar suas configurações de branding. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to convert hex color to RGB format for CSS
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  // Função handleFileSelect para upload de logos/imagens
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
      // Check file size before upload (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size exceeds 50MB limit');
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Please select a JPEG, PNG, GIF, or WebP file');
      }

      // Get file extension from original file
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${community.id}/${type}/${fileName}`;

      // Upload file using standard upload
      const { data, error: uploadError } = await supabase.storage
        .from('community-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(uploadError.message || 'Error uploading file');
      }

      // Get public URL after successful upload
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

      setHasChanges(true);
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: `Error uploading ${type}`,
        description: error.message || `There was an error uploading your ${type}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Interface para o ColorPickerField para facilitar a criação de campos de cor
  interface ColorPickerFieldProps {
    label: string;
    description: string; 
    color: string;
    setColor: (color: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    previewType?: 'button' | 'circle' | 'text';
  }

  // Componente para configuração consistente de cores
  const ColorPickerField = ({ label, description, color, setColor, isOpen, setIsOpen, previewType = 'button' }: ColorPickerFieldProps) => {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold block">
          {label}
        </Label>
        <div className="flex items-center gap-3">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div 
                className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer shadow-sm" 
                style={{ backgroundColor: color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none">
              <HexColorPicker 
                color={color} 
                onChange={(color) => handleUpdateColor(color, setColor)} 
              />
              <div className="p-2 bg-white border-t">
                <Input 
                  value={color}
                  onChange={(e) => handleUpdateColor(e.target.value, setColor)}
                  className="font-mono text-xs"
                />
              </div>
            </PopoverContent>
          </Popover>
          <Input 
            value={color}
            onChange={(e) => handleUpdateColor(e.target.value, setColor)}
            className="font-mono w-32"
          />
          {previewType === 'button' && (
            <Button className="ml-2" style={{ backgroundColor: color, color: textColor }}>
              Preview
            </Button>
          )}
          {previewType === 'circle' && (
            <div className="ml-2 w-10 h-10 rounded-full border" style={{ backgroundColor: color }}></div>
          )}
          {previewType === 'text' && (
            <div className="ml-2 flex items-center justify-center h-10 px-4 rounded-md border" style={{ backgroundColor: primaryColor, color: color }}>
              Text Preview
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    );
  };

  // Resetar para o tema padrão
  const handleResetToDefault = () => {
    if (!confirm("Tem certeza que deseja resetar para o tema padrão? Todas as suas personalizações serão perdidas.")) {
      return;
    }
    
    setPrimaryColor(defaultTheme.primaryColor);
    setSecondaryColor(defaultTheme.secondaryColor);
    setTextColor(defaultTheme.textColor);
    setBgColor(defaultTheme.backgroundColor);
    setCardColor(defaultTheme.cardColor);
    setMutedColor(defaultTheme.mutedColor);
    setAccentColor(defaultTheme.accentColor);
    setBorderColor(defaultTheme.borderColor);
    
    // Marcar que houve alterações para ativar o botão de salvar
    setHasChanges(true);
    
    toast({
      title: "Tema redefinido",
      description: "As cores foram redefinidas para o tema padrão. Clique em Salvar para aplicar as mudanças.",
    });
  };

  // Aplicar um tema predefinido
  const applyTheme = (theme: typeof predefinedThemes[0]) => {
    if (!confirm(`Deseja aplicar o tema "${theme.name}"? Suas personalizações atuais serão substituídas.`)) {
      return;
    }

    const { colors } = theme;
    
    setPrimaryColor(colors.primaryColor);
    setSecondaryColor(colors.secondaryColor);
    setTextColor(colors.textColor);
    setBgColor(colors.backgroundColor);
    setCardColor(colors.cardColor);
    setMutedColor(colors.mutedColor);
    setAccentColor(colors.accentColor);
    setBorderColor(colors.borderColor);
    
    // Aplicar cores para visualização imediata sem precisar salvar
    updateThemeColors({
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor,
      textColor: colors.textColor,
      backgroundColor: colors.backgroundColor,
      cardColor: colors.cardColor,
      mutedColor: colors.mutedColor,
      accentColor: colors.accentColor,
      borderColor: colors.borderColor
    });
    
    // Marcar que houve alterações para ativar o botão de salvar
    setHasChanges(true);
    
    // Atualizar para a aba de preview para ver as mudanças imediatamente
    setTimeout(() => {
      const previewTab = document.querySelector('[data-state="inactive"][value="preview"]') as HTMLElement;
      if (previewTab) {
        previewTab.click();
      }
    }, 100);
    
    toast({
      title: `Tema "${theme.name}" aplicado`,
      description: "Visualize como ficou na aba Preview. Não esqueça de Salvar para aplicar as mudanças permanentemente.",
    });
  };

  // Verificar se uma cor é escura baseada na luminosidade
  const isColorDark = (hexColor: string): boolean => {
    // Remove the hash if it exists
    const color = hexColor.replace('#', '');
    
    // Parse r, g, b values
    const r = parseInt(color.substr(0, 2), 16) / 255;
    const g = parseInt(color.substr(2, 2), 16) / 255;
    const b = parseInt(color.substr(4, 2), 16) / 255;
    
    // Calculate luminance using the relative luminance formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    // Return true if color is dark (luminance < 0.5)
    return luminance < 0.5;
  };
  
  // Obter a cor apropriada de texto (claro ou escuro) para o background
  const getTextColor = (backgroundColor: string): string => {
    return isColorDark(backgroundColor) ? '#FFFFFF' : '#000000';
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
        <Button 
          variant="outline" 
          onClick={handleResetToDefault}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </Button>
      </div>
      
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="themes">Theme Gallery</TabsTrigger>
          <TabsTrigger value="colors">Primary Colors</TabsTrigger>
          <TabsTrigger value="uiColors">UI Colors</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <CardTitle>Theme Gallery</CardTitle>
              </div>
              <CardDescription>
                Choose a pre-defined theme to quickly style your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  Clicking on a theme will apply it instantly. You can then make additional customizations in the other tabs if needed.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predefinedThemes.map((theme, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-2"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="h-24 flex">
                      <div className="w-1/2 flex items-center justify-center" style={{ backgroundColor: theme.colors.primaryColor }}>
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.colors.accentColor }}></div>
                      </div>
                      <div className="w-1/2 flex items-center justify-center" style={{ backgroundColor: theme.colors.backgroundColor }}>
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.colors.cardColor, borderColor: theme.colors.borderColor }}></div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium">{theme.name}</h4>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Brand Color Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure the main colors that define your brand identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPickerField 
                  label="Primary Color"
                  description="Used for primary buttons, links, and brand accent elements"
                  color={primaryColor}
                  setColor={setPrimaryColor}
                  isOpen={isColorPickerOpen}
                  setIsOpen={setIsColorPickerOpen}
                  previewType="button"
                />
                
                <ColorPickerField 
                  label="Secondary Color"
                  description="Used for secondary UI elements, buttons, and accents"
                  color={secondaryColor}
                  setColor={setSecondaryColor}
                  isOpen={isSecondaryColorPickerOpen}
                  setIsOpen={setIsSecondaryColorPickerOpen}
                  previewType="button"
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPickerField 
                  label="Text Color"
                  description="Text color on primary/secondary colored backgrounds"
                  color={textColor}
                  setColor={setTextColor}
                  isOpen={isTextColorPickerOpen}
                  setIsOpen={setIsTextColorPickerOpen}
                  previewType="text"
                />
                
                <ColorPickerField 
                  label="Background Color"
                  description="Main background color for your community"
                  color={bgColor}
                  setColor={setBgColor}
                  isOpen={isBgColorPickerOpen}
                  setIsOpen={setIsBgColorPickerOpen}
                  previewType="circle"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 p-4 border rounded-md bg-gray-50">
                <div className="h-20 w-20 rounded-md flex items-center justify-center" 
                     style={{ backgroundColor: primaryColor, color: textColor }}>
                  Primary
                </div>
                <div className="h-20 w-20 rounded-md flex items-center justify-center" 
                     style={{ backgroundColor: secondaryColor, color: textColor }}>
                  Secondary
                </div>
                <div className="h-20 w-20 rounded-md border flex items-center justify-center" 
                     style={{ backgroundColor: bgColor, color: primaryColor }}>
                  Background
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="uiColors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>UI Element Colors</CardTitle>
              </div>
              <CardDescription>
                Configure colors for specific UI elements across your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPickerField 
                  label="Card Color"
                  description="Background color for cards, dialogs and elevated elements"
                  color={cardColor}
                  setColor={setCardColor}
                  isOpen={isCardColorPickerOpen}
                  setIsOpen={setIsCardColorPickerOpen}
                  previewType="circle"
                />
                
                <ColorPickerField 
                  label="Muted Color"
                  description="Used for subtle backgrounds and less prominent elements"
                  color={mutedColor}
                  setColor={setMutedColor}
                  isOpen={isMutedColorPickerOpen}
                  setIsOpen={setIsMutedColorPickerOpen}
                  previewType="circle"
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPickerField 
                  label="Accent Color"
                  description="Used for interactive elements and highlights"
                  color={accentColor}
                  setColor={setAccentColor}
                  isOpen={isAccentColorPickerOpen}
                  setIsOpen={setIsAccentColorPickerOpen}
                  previewType="button"
                />
                
                <ColorPickerField 
                  label="Border Color"
                  description="Color for borders and dividers throughout the UI"
                  color={borderColor}
                  setColor={setBorderColor}
                  isOpen={isBorderColorPickerOpen}
                  setIsOpen={setIsBorderColorPickerOpen}
                  previewType="circle"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 p-4 border rounded-md border-gray-100 shadow-sm" 
                   style={{ backgroundColor: cardColor, borderColor: borderColor }}>
                <div className="h-16 w-16 rounded-md flex items-center justify-center" 
                     style={{ backgroundColor: mutedColor, color: textColor, borderColor: borderColor, border: '1px solid' }}>
                  Muted
                </div>
                <div className="h-16 w-16 rounded-md flex items-center justify-center" 
                     style={{ backgroundColor: accentColor, color: textColor }}>
                  Accent
                </div>
                <div className="h-16 w-16 rounded-md border flex items-center justify-center" 
                     style={{ borderColor: borderColor, border: '2px solid' }}>
                  Border
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
          <Card 
            className={`${isColorDark(bgColor) ? 'theme-dark' : 'theme-light'}`}
            style={{ backgroundColor: bgColor, color: getTextColor(bgColor) }}
          >
            <CardHeader style={{ borderColor: borderColor }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
                <CardTitle style={{ color: getTextColor(bgColor) }}>Theme Preview</CardTitle>
              </div>
              <CardDescription style={{ color: `${getTextColor(bgColor)}99` }}>
                Preview how your branding will look throughout your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {/* Header & Navigation Preview */}
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: borderColor }}>
                    <div className="p-4 border-b flex items-center justify-between" 
                         style={{ backgroundColor: cardColor, borderColor: borderColor, color: getTextColor(cardColor) }}>
                      {logo ? (
                        <img src={logo} alt="Community Logo" className="h-8" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                          <span className="font-semibold" style={{ color: getTextColor(cardColor) }}>Your Community</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" style={{ color: getTextColor(cardColor) }}>Home</Button>
                        <Button variant="ghost" size="sm" style={{ color: getTextColor(cardColor) }}>Library</Button>
                        <Button variant="ghost" size="sm" style={{ color: getTextColor(cardColor) }}>Events</Button>
                        <Button variant="outline" size="sm" style={{ borderColor: borderColor, color: getTextColor(cardColor) }}>Search</Button>
                        <Button size="sm" style={{ backgroundColor: primaryColor, color: textColor }}>
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cards & Content Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3" style={{ color: getTextColor(bgColor) }}>Cards & Content</h3>
                      <div className="rounded-lg border p-4 mb-4" 
                           style={{ backgroundColor: cardColor, borderColor: borderColor, color: getTextColor(cardColor) }}>
                        <h4 className="font-medium mb-2" style={{ color: getTextColor(cardColor) }}>Regular Card</h4>
                        <p className="text-sm mb-3" style={{ color: `${getTextColor(cardColor)}99` }}>
                          This is how regular content cards will look with your theme.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" 
                                  style={{ borderColor: borderColor, color: getTextColor(cardColor) }}>Cancel</Button>
                          <Button size="sm" style={{ backgroundColor: primaryColor, color: textColor }}>
                            Confirm
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: mutedColor, color: getTextColor(mutedColor) }}>
                        <h4 className="font-medium mb-2" style={{ color: getTextColor(mutedColor) }}>Muted Background</h4>
                        <p className="text-sm mb-3" style={{ color: `${getTextColor(mutedColor)}99` }}>
                          This is how muted areas will appear on the interface.
                        </p>
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
                          <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: primaryColor }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3" style={{ color: getTextColor(bgColor) }}>UI Elements</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <span className="text-sm font-medium" style={{ color: getTextColor(bgColor) }}>Buttons</span>
                          <div className="flex flex-wrap gap-2">
                            <Button style={{ backgroundColor: primaryColor, color: textColor }}>
                              Primary
                            </Button>
                            <Button style={{ backgroundColor: secondaryColor, color: textColor }}>
                              Secondary
                            </Button>
                            <Button style={{ backgroundColor: accentColor, color: textColor }}>
                              Accent
                            </Button>
                            <Button variant="outline" style={{ borderColor: borderColor, color: getTextColor(bgColor) }}>Outline</Button>
                            <Button variant="ghost" style={{ color: getTextColor(bgColor) }}>Ghost</Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-sm font-medium" style={{ color: getTextColor(bgColor) }}>Form Elements</span>
                          <div className="flex flex-col gap-2">
                            <Input placeholder="Text input" style={{ 
                              backgroundColor: cardColor, 
                              color: getTextColor(cardColor),
                              borderColor: borderColor
                            }} />
                            <div className="flex items-center gap-2">
                              <input type="checkbox" className="rounded border" style={{ borderColor: borderColor }} />
                              <span className="text-sm" style={{ color: getTextColor(bgColor) }}>Checkbox</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-8 rounded-full relative" style={{ backgroundColor: mutedColor }}>
                                <div className="absolute right-0 top-0 h-4 w-4 rounded-full" 
                                     style={{ backgroundColor: primaryColor }}></div>
                              </div>
                              <span className="text-sm" style={{ color: getTextColor(bgColor) }}>Toggle (on)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation & Sidebar Preview */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Navigation Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3">Sidebar Items</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <div className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }}>📊</div>
                            <span className="text-sm">Dashboard</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-md" 
                               style={{ backgroundColor: `rgba(${hexToRgb(primaryColor)}, 0.15)`, color: primaryColor }}>
                            <div className="w-4 h-4" style={{ color: primaryColor }}>📚</div>
                            <span className="text-sm font-medium">Library</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <div className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }}>📅</div>
                            <span className="text-sm">Events</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3">Pinned Items</h4>
                        <div className="space-y-2">
                          <h5 className="text-xs font-semibold" style={{ color: primaryColor }}>PINNED</h5>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-md"
                               style={{ backgroundColor: `rgba(${hexToRgb(primaryColor)}, 0.15)` }}>
                            <div className="w-4 h-4">📌</div>
                            <span className="text-sm">Pinned Item</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3">Tabs & Indicators</h4>
                        <div className="border-b flex">
                          <div className="px-4 py-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                            Active Tab
                          </div>
                          <div className="px-4 py-2 text-muted-foreground">
                            Inactive
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                          <span className="text-sm">Status Indicator</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Toast & Notification Preview */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Notifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4 bg-card relative">
                        <div className="absolute top-2 right-2">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Success Toast</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your changes have been successfully saved.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4 bg-red-500 text-white relative">
                        <div className="absolute top-2 right-2">
                          <X className="h-4 w-4 text-white" />
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Error Toast</span>
                        </div>
                        <p className="text-sm text-red-50">
                          There was an error processing your request.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-8 right-8">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving || !community?.id || !hasChanges}
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
