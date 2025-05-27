import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  cardColor: string;       // Cor de cartões e elementos elevados
  mutedColor: string;      // Cor para áreas de destaque suave
  accentColor: string;     // Cor de destaque adicional 
  borderColor: string;     // Cor de bordas
}

interface ThemeContextType {
  colors: ThemeColors;
  updateThemeColors: (newColors: Partial<ThemeColors>) => void;
  applyThemeToDOM: () => void;
}

// Default theme values as fallback
export const defaultTheme: ThemeColors = {
  primaryColor: '#6E56CF',   // Púrpura principal
  secondaryColor: '#4A36A0', // Púrpura secundário
  textColor: '#FFFFFF',      // Texto branco (para botões)
  backgroundColor: '#F9FAFB', // Background geral (cinza claro)
  cardColor: '#FFFFFF',      // Cards brancos
  mutedColor: '#F1F5F9',     // Áreas destacadas sutis (cinza mais claro)
  accentColor: '#0EA5E9',    // Azul como destaque adicional
  borderColor: '#E2E8F0',    // Bordas em cinza suave
};

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  updateThemeColors: () => {},
  applyThemeToDOM: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { community } = useAuth();
  const [colors, setColors] = useState<ThemeColors>(defaultTheme);

  // Update colors when community changes
  useEffect(() => {
    if (community?.theme_config) {
      const newColors = {
        primaryColor: community.theme_config.primary_color || defaultTheme.primaryColor,
        secondaryColor: community.theme_config.secondary_color || defaultTheme.secondaryColor,
        textColor: community.theme_config.text_color || defaultTheme.textColor,
        backgroundColor: community.theme_config.background_color || defaultTheme.backgroundColor,
        cardColor: community.theme_config.card_color || defaultTheme.cardColor,
        mutedColor: community.theme_config.muted_color || defaultTheme.mutedColor,
        accentColor: community.theme_config.accent_color || defaultTheme.accentColor,
        borderColor: community.theme_config.border_color || defaultTheme.borderColor,
      };
      setColors(newColors);
      
      // Apply the theme immediately when community context is loaded
      applyThemeToDOM(newColors);
    }
  }, [community]);

  // Convert hex color to hsl format required by Tailwind CSS variables
  const hexToHSL = (hex: string): string => {
    try {
      // Remove the hash if it exists
      hex = hex.replace('#', '');
      
      // Parse r, g, b values
      let r = parseInt(hex.substr(0, 2), 16) / 255;
      let g = parseInt(hex.substr(2, 2), 16) / 255;
      let b = parseInt(hex.substr(4, 2), 16) / 255;
      
      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = Math.round(h * 60);
        s = Math.round(s * 100);
      }
      
      l = Math.round(l * 100);
      
      return `${h} ${s}% ${l}%`;
    } catch (error) {
      console.error('Error converting hex to HSL:', error);
      return '260 80% 64%'; // Default primary color as fallback
    }
  };

  // Apply theme colors to the document
  const applyThemeToDOM = (themeColors: ThemeColors = colors) => {
    try {
      // Aplicar cor em TODOS os elementos temáticos da UI
      const primaryHSL = hexToHSL(themeColors.primaryColor);
      const secondaryHSL = hexToHSL(themeColors.secondaryColor);
      const bgHSL = hexToHSL(themeColors.backgroundColor);
      const cardHSL = hexToHSL(themeColors.cardColor);
      const mutedHSL = hexToHSL(themeColors.mutedColor);
      const accentHSL = hexToHSL(themeColors.accentColor);
      const borderHSL = hexToHSL(themeColors.borderColor);
      const textHSL = hexToHSL(themeColors.textColor);
      
      // Cores principais
      document.documentElement.style.setProperty('--primary', primaryHSL);
      document.documentElement.style.setProperty('--secondary', secondaryHSL);
      
      // Background e áreas relacionadas
      document.documentElement.style.setProperty('--background', bgHSL);
      
      // Cards e elementos elevados
      document.documentElement.style.setProperty('--card', cardHSL);
      document.documentElement.style.setProperty('--popover', cardHSL);
      
      // Muted areas
      document.documentElement.style.setProperty('--muted', mutedHSL);
      
      // Accent colors
      document.documentElement.style.setProperty('--accent', accentHSL);
      
      // Border colors
      document.documentElement.style.setProperty('--border', borderHSL);
      document.documentElement.style.setProperty('--input', borderHSL);
      document.documentElement.style.setProperty('--ring', primaryHSL);
      
      // Cor selecionada
      document.documentElement.style.setProperty('--selected', primaryHSL);
      document.documentElement.style.setProperty('--highlight', primaryHSL);
      
      // Text colors principal
      document.documentElement.style.setProperty('--foreground', hexToHSL(contrastColor(themeColors.backgroundColor)));
      document.documentElement.style.setProperty('--primary-foreground', hexToHSL(contrastColor(themeColors.primaryColor)));
      document.documentElement.style.setProperty('--secondary-foreground', hexToHSL(contrastColor(themeColors.secondaryColor)));
      document.documentElement.style.setProperty('--muted-foreground', hexToHSL(adjustBrightness(contrastColor(themeColors.backgroundColor), 0.75)));
      document.documentElement.style.setProperty('--accent-foreground', hexToHSL(contrastColor(themeColors.accentColor)));
      document.documentElement.style.setProperty('--card-foreground', hexToHSL(contrastColor(themeColors.cardColor)));
      document.documentElement.style.setProperty('--popover-foreground', hexToHSL(contrastColor(themeColors.cardColor)));
      document.documentElement.style.setProperty('--destructive-foreground', hexToHSL('#FFFFFF'));
      
      // Toast styles - improved visibility and contrast
      const toastBgColor = themeColors.cardColor;
      const toastTextColor = contrastColor(toastBgColor);
      
      document.documentElement.style.setProperty('--toast-background', hexToHSL(toastBgColor));
      document.documentElement.style.setProperty('--toast-foreground', hexToHSL(toastTextColor));
      document.documentElement.style.setProperty('--toast-border', hexToHSL(themeColors.borderColor));
      document.documentElement.style.setProperty('--toast-title', hexToHSL(toastTextColor));
      document.documentElement.style.setProperty('--toast-description', hexToHSL(adjustBrightness(toastTextColor, 0.85)));
      
      // Para toasts com variante "destructive" - manter sempre visível
      document.documentElement.style.setProperty('--toast-destructive-background', '#EF4444');
      document.documentElement.style.setProperty('--toast-destructive-foreground', '#FFFFFF');
      
      // Sidebar customization - fully themed with primary color
      document.documentElement.style.setProperty('--sidebar-background', hexToHSL(adjustBrightness(themeColors.backgroundColor, 1.02)));
      document.documentElement.style.setProperty('--sidebar-foreground', hexToHSL(contrastColor(themeColors.backgroundColor)));
      document.documentElement.style.setProperty('--sidebar-muted', mutedHSL);
      document.documentElement.style.setProperty('--sidebar-muted-foreground', hexToHSL(adjustBrightness(contrastColor(themeColors.backgroundColor), 0.75)));
      document.documentElement.style.setProperty('--sidebar-accent', primaryHSL); // Usar cor primária para acentos
      document.documentElement.style.setProperty('--sidebar-accent-foreground', hexToHSL(contrastColor(themeColors.primaryColor)));
      document.documentElement.style.setProperty('--sidebar-border', borderHSL);
      document.documentElement.style.setProperty('--sidebar-primary', primaryHSL);
      document.documentElement.style.setProperty('--sidebar-primary-foreground', hexToHSL(contrastColor(themeColors.primaryColor)));
      
      // Elementos adicionais de UI
      document.documentElement.style.setProperty('--active-item-bg', hexToHSL(adjustOpacity(themeColors.primaryColor, 0.15)));
      document.documentElement.style.setProperty('--hover-item-bg', hexToHSL(adjustOpacity(themeColors.primaryColor, 0.1)));
      document.documentElement.style.setProperty('--active-icon', primaryHSL);
      document.documentElement.style.setProperty('--menu-active', primaryHSL);
      document.documentElement.style.setProperty('--tab-active', primaryHSL);
      document.documentElement.style.setProperty('--focus-ring', primaryHSL);
      document.documentElement.style.setProperty('--pinned-bg', hexToHSL(adjustOpacity(themeColors.primaryColor, 0.15)));
      document.documentElement.style.setProperty('--pinned-color', primaryHSL);
      
      // Also set direct CSS variables for direct access (hex format)
      document.documentElement.style.setProperty('--theme-primary-color', themeColors.primaryColor);
      document.documentElement.style.setProperty('--theme-secondary-color', themeColors.secondaryColor);
      document.documentElement.style.setProperty('--theme-text-color', themeColors.textColor);
      document.documentElement.style.setProperty('--theme-background-color', themeColors.backgroundColor);
      document.documentElement.style.setProperty('--theme-card-color', themeColors.cardColor);
      document.documentElement.style.setProperty('--theme-muted-color', themeColors.mutedColor);
      document.documentElement.style.setProperty('--theme-accent-color', themeColors.accentColor);
      document.documentElement.style.setProperty('--theme-border-color', themeColors.borderColor);
      
      // Aplicar diretamente em elementos específicos para garantir a customização completa
      applyStyleToElements(themeColors);
      
    } catch (error) {
      console.error('Error applying theme to DOM:', error);
    }
  };

  // Função para aplicar estilos diretamente a elementos específicos que possam não estar usando as variáveis CSS
  const applyStyleToElements = (themeColors: ThemeColors) => {
    try {
      // Definir estilos injetados direto no CSS
      const styleElement = document.getElementById('theme-override-styles') || document.createElement('style');
      if (!document.getElementById('theme-override-styles')) {
        styleElement.id = 'theme-override-styles';
        document.head.appendChild(styleElement);
      }
      
      // Verificar se é um tema escuro baseado na luminosidade do fundo
      const isDarkTheme = isColorDark(themeColors.backgroundColor);
      
      // Injetar CSS customizado para elementos problemáticos
      styleElement.innerHTML = `
        /* Primary color overrides */
        .bg-primary, [data-bg-primary], [data-theme="primary"] {
          background-color: ${themeColors.primaryColor} !important;
        }
        
        .text-primary, [data-text-primary] {
          color: ${themeColors.primaryColor} !important;
        }
        
        /* Overrides específicos para temas escuros */
        ${isDarkTheme ? `
        body, html {
          background-color: ${themeColors.backgroundColor} !important;
          color: ${contrastColor(themeColors.backgroundColor)} !important;
        }
        
        .bg-card, .bg-background, .card, [class*="bg-card"], [class*="bg-background"] {
          background-color: ${themeColors.cardColor} !important;
        }
        
        .settings-layout, .page-container, main, .main-content, [class*="page-container"] {
          background-color: ${themeColors.backgroundColor} !important;
        }
        
        .border {
          border-color: ${themeColors.borderColor} !important;
        }
        
        .rounded-lg.border {
          background-color: ${themeColors.cardColor} !important;
        }
        
        /* Corrija tabelas e outros elementos estruturais */
        table, tr, td, th {
          border-color: ${themeColors.borderColor} !important;
        }
        
        /* Ajuste inputs e controles para serem visíveis em fundos escuros */
        input, select, textarea {
          background-color: ${adjustBrightness(themeColors.backgroundColor, 1.2)} !important;
          color: ${contrastColor(adjustBrightness(themeColors.backgroundColor, 1.2))} !important;
          border-color: ${themeColors.borderColor} !important;
        }
        
        /* Faça os rótulos terem um bom contraste */
        label, h1, h2, h3, h4, h5, h6 {
          color: ${contrastColor(themeColors.backgroundColor)} !important;
        }
        
        /* Faça os textos secundários terem um contraste suave */
        p, span, div:not([class]) {
          color: ${adjustBrightness(contrastColor(themeColors.backgroundColor), 0.9)} !important;
        }
        ` : ''}
        
        /* Sidebar menu items ativos/destacados */
        .sidebar a.active, 
        .sidebar [data-active="true"],
        .sidebar [data-state="active"],
        .sidebar-item.active,
        [data-sidebar-active="true"],
        [role="navigation"] [aria-current="page"],
        [role="navigation"] .active-item,
        [role="navigation"] a.active,
        [role="navigation"] li.active {
          background-color: ${adjustOpacity(themeColors.primaryColor, 0.15)} !important;
          color: ${themeColors.primaryColor} !important;
        }
        
        /* Ícones ativos */
        .sidebar a.active svg,
        .sidebar [data-active="true"] svg,
        .sidebar [data-state="active"] svg,
        .sidebar-item.active svg,
        [data-sidebar-active="true"] svg,
        [role="navigation"] [aria-current="page"] svg,
        [role="navigation"] .active-item svg,
        [role="navigation"] a.active svg,
        [role="navigation"] li.active svg {
          color: ${themeColors.primaryColor} !important;
        }
        
        /* Settings menu items - overrides hardcoded purple */
        a[href^="/settings/"] {
          --active-bg-color: ${adjustOpacity(themeColors.primaryColor, 0.15)};
          --active-text-color: ${themeColors.primaryColor};
        }
        
        a[href^="/settings/"].active,
        .settings-menu-item.active {
          background-color: var(--active-bg-color) !important;
          color: var(--active-text-color) !important;
        }
        
        a[href^="/settings/"].active svg,
        .settings-menu-item.active svg {
          color: var(--active-text-color) !important;
        }
        
        /* Pinned items section and headers */
        [data-section="pinned"] h3,
        [data-section="pinned"] .section-title,
        div:has(> [class*="PINNED"]) {
          color: ${themeColors.primaryColor} !important;
        }
        
        /* Star icons for pinned items */
        .fill-amber-400, 
        [class*="fill-amber"] {
          fill: ${themeColors.primaryColor} !important;
        }
        
        .text-amber-400, 
        [class*="text-amber"] {
          color: ${themeColors.primaryColor} !important;
        }
        
        /* Items pinados e seus fundos */
        .pinned-item,
        [data-pinned="true"],
        [data-section="pinned"] a,
        [data-section="pinned"] [role="listitem"] {
          background-color: ${adjustOpacity(themeColors.primaryColor, 0.15)} !important;
        }
        
        /* Border colors */
        .border-primary {
          border-color: ${themeColors.primaryColor} !important;
        }
        
        /* Specific overrides for settings menu */
        .bg-purple-100 {
          background-color: ${adjustOpacity(themeColors.primaryColor, 0.15)} !important;
        }
        
        .text-purple-900 {
          color: ${adjustBrightness(themeColors.primaryColor, 0.8)} !important;
        }
        
        .dark\\:bg-purple-900\\/50 {
          background-color: ${adjustOpacity(themeColors.primaryColor, 0.5)} !important;
        }
        
        .dark\\:text-purple-100 {
          color: ${adjustBrightness(themeColors.primaryColor, 1.2)} !important;
        }
      `;
    } catch (error) {
      console.error('Error applying direct styles:', error);
    }
  };

  // Função para determinar se uma cor é escura
  const isColorDark = (hexColor: string): boolean => {
    try {
      // Remove the hash if it exists
      const color = hexColor.replace('#', '');
      
      // Parse r, g, b values
      const r = parseInt(color.substr(0, 2), 16) / 255;
      const g = parseInt(color.substr(2, 2), 16) / 255;
      const b = parseInt(color.substr(4, 2), 16) / 255;
      
      // Calculate luminance using the relative luminance formula
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      // Return true if the color is dark (luminance < 0.5)
      return luminance < 0.5;
    } catch (error) {
      console.error('Error determining if color is dark:', error);
      return false;
    }
  };

  // Função para ajustar a opacidade de uma cor
  const adjustOpacity = (hexColor: string, opacity: number): string => {
    try {
      // Remove o # se existir
      const color = hexColor.replace('#', '');
      
      // Converter para RGB
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      
      // Retornar em formato HSL com o canal A (alpha)
      return `${r} ${g} ${b} / ${opacity}`;
    } catch (error) {
      console.error('Error adjusting opacity:', error);
      return hexColor;
    }
  };

  // Função para determinar se deve usar texto claro ou escuro em um fundo colorido
  const contrastColor = (hexColor: string): string => {
    try {
      // Remove the hash if it exists
      const color = hexColor.replace('#', '');
      
      // Parse r, g, b values
      const r = parseInt(color.substr(0, 2), 16) / 255;
      const g = parseInt(color.substr(2, 2), 16) / 255;
      const b = parseInt(color.substr(4, 2), 16) / 255;
      
      // Calculate luminance using the relative luminance formula
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      // Return white or black based on background luminance
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    } catch (error) {
      console.error('Error calculating contrast color:', error);
      return '#FFFFFF'; // Default to white text
    }
  };

  // Função para ajustar o brilho de uma cor (fator > 1 para clarear, < 1 para escurecer)
  const adjustBrightness = (hexColor: string, factor: number): string => {
    try {
      // Remove the hash if it exists
      const color = hexColor.replace('#', '');
      
      // Parse r, g, b values
      let r = parseInt(color.substr(0, 2), 16);
      let g = parseInt(color.substr(2, 2), 16);
      let b = parseInt(color.substr(4, 2), 16);
      
      // Adjust brightness
      r = Math.min(255, Math.round(r * factor));
      g = Math.min(255, Math.round(g * factor));
      b = Math.min(255, Math.round(b * factor));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error adjusting brightness:', error);
      return hexColor; // Return original color if there's an error
    }
  };

  // Update theme colors
  const updateThemeColors = (newColors: Partial<ThemeColors>) => {
    const updatedColors = { ...colors, ...newColors };
    setColors(updatedColors);
    applyThemeToDOM(updatedColors);
  };

  return (
    <ThemeContext.Provider value={{ 
      colors, 
      updateThemeColors,
      applyThemeToDOM
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Exportações nomeadas e padrão
export { ThemeContext };
export default ThemeContext; 