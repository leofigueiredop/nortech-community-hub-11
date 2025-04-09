
import React from 'react';
import { DollarSign, BarChart3, Share, CreditCard } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonetizationSectionProps {
  activeSection?: string;
}

const MonetizationSection: React.FC<MonetizationSectionProps> = ({ activeSection }) => {
  const { isMobile } = useIsMobile();
  const textSize = isMobile ? "text-[10px]" : "text-xs";
  
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<CreditCard size={18} />} 
        label="Nortech Plans" 
        to="/settings/plans" 
        active={activeSection === "plans"} 
        className={textSize}
      />
      <SettingsMenuItem 
        icon={<DollarSign size={18} />} 
        label="Member Subscriptions" 
        to="/settings/subscriptions" 
        active={activeSection === "subscriptions"} 
        className={textSize}
      />
      <SettingsMenuItem 
        icon={<DollarSign size={18} />} 
        label="Paywall Setup" 
        to="/settings/paywall" 
        active={activeSection === "paywall"} 
        className={textSize}
      />
      <SettingsMenuItem 
        icon={<BarChart3 size={18} />} 
        label="Analytics" 
        to="/settings/analytics" 
        active={activeSection === "analytics"} 
        className={textSize}
      />
      <SettingsMenuItem 
        icon={<Share size={18} />} 
        label="Affiliates" 
        to="/settings/affiliates" 
        active={activeSection === "affiliates"} 
        className={textSize}
      />
    </div>
  );
};

export default MonetizationSection;
