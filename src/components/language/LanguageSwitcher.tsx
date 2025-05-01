import React from 'react';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguagePreference } from '@/utils/i18n/useLanguagePreference';
import { supportedLanguages } from '@/utils/i18n/supportedLanguages';

const LANGUAGE_NAMES: Record<string, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
};

export const LanguageSwitcher: React.FC<{
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}> = ({ 
  variant = 'ghost',
  size = 'icon',
  className = 'h-8 w-8'
}) => {
  const { currentLanguage, changeLanguage } = useLanguagePreference();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between"
          >
            <span>{lang.name}</span>
            {currentLanguage === lang.code && (
              <Check className="h-4 w-4 text-nortech-purple" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher; 