
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import BrandColors from './branding/BrandColors';
import LogoSection from './branding/LogoSection';
import NotificationSection from './branding/NotificationSection';
import WhiteLabelAppCard from './branding/WhiteLabelAppCard';
import SaveButton from './branding/SaveButton';

const BrandingSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [brandColor, setBrandColor] = useState("#2B2E33");
  const [brandColorDark, setBrandColorDark] = useState("#FFFFFF");
  const [replyEmail, setReplyEmail] = useState("p.mani@alphractal.com");
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      document.documentElement.style.setProperty('--primary', brandColor);
      
      toast({
        title: "✅ Changes Saved Successfully",
        description: `Your branding settings were updated at ${new Date().toLocaleTimeString()}`,
      });
    }, 800);
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 relative pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BrandColors 
            brandColor={brandColor}
            brandColorDark={brandColorDark}
            onBrandColorChange={setBrandColor}
            onBrandColorDarkChange={setBrandColorDark}
          />
          
          <LogoSection />
          
          <NotificationSection 
            replyEmail={replyEmail}
            onReplyEmailChange={setReplyEmail}
          />
        </div>
        
        <div className="lg:col-span-1">
          <WhiteLabelAppCard />
        </div>
      </div>

      <SaveButton 
        isSaving={isSaving}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default BrandingSettings;
