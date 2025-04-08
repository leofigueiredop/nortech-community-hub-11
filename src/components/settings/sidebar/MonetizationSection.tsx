
import React from 'react';
import { DollarSign, BarChart3, Share } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface MonetizationSectionProps {
  activeSection?: string;
}

const MonetizationSection: React.FC<MonetizationSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<DollarSign size={18} />} 
        label="Paywall" 
        to="/settings/paywall" 
        active={activeSection === "paywall"} 
      />
      <SettingsMenuItem 
        icon={<DollarSign size={18} />} 
        label="Plans" 
        to="/settings/plans" 
        active={activeSection === "plans"} 
      />
      <SettingsMenuItem 
        icon={<BarChart3 size={18} />} 
        label="Analytics" 
        to="/settings/analytics" 
        active={activeSection === "analytics"} 
      />
      <SettingsMenuItem 
        icon={<Share size={18} />} 
        label="Affiliates" 
        to="/settings/affiliates" 
        active={activeSection === "affiliates"} 
      />
    </div>
  );
};

export default MonetizationSection;
