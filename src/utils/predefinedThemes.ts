import { ThemeColors } from '@/context/ThemeContext';

// Tema padrão/inicial
export const defaultTheme: ThemeColors = {
  primaryColor: '#6E56CF',   // Púrpura principal
  secondaryColor: '#4A36A0', // Púrpura secundário
  textColor: '#FFFFFF',      // Texto branco em botões coloridos
  backgroundColor: '#F9FAFB', // Background geral (cinza muito claro)
  cardColor: '#FFFFFF',      // Cards brancos
  mutedColor: '#F1F5F9',     // Áreas destacadas sutis
  accentColor: '#0EA5E9',    // Azul como destaque adicional
  borderColor: '#E2E8F0',    // Bordas em cinza suave
};

// Coleção de temas pré-definidos de alta qualidade
export const predefinedThemes: { name: string; colors: ThemeColors; description: string }[] = [
  {
    name: 'Violet Harmony',
    description: 'Elegante tema violeta com acentos suaves',
    colors: defaultTheme
  },
  {
    name: 'Ocean Blue',
    description: 'Tons de azul profundo inspirados no oceano',
    colors: {
      primaryColor: '#0369A1',   // Azul oceano profundo
      secondaryColor: '#065986', // Azul oceano mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F0F9FF', // Fundo azulado muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#E0F2FE',     // Azul muito claro para áreas destacadas
      accentColor: '#06B6D4',    // Azul ciano para acentos
      borderColor: '#BAE6FD',    // Azul claro para bordas
    }
  },
  {
    name: 'Forest Green',
    description: 'Tons de verde inspirados na natureza e florestas',
    colors: {
      primaryColor: '#166534',   // Verde floresta
      secondaryColor: '#14532D', // Verde floresta mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F0FDF4', // Fundo verde muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#DCFCE7',     // Verde muito claro para áreas destacadas
      accentColor: '#059669',    // Verde esmeralda para acentos
      borderColor: '#A7F3D0',    // Verde claro para bordas
    }
  },
  {
    name: 'Sunset Orange',
    description: 'Cores quentes inspiradas no pôr do sol',
    colors: {
      primaryColor: '#EA580C',   // Laranja intenso
      secondaryColor: '#C2410C', // Laranja mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FFF7ED', // Fundo alaranjado muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#FFEDD5',     // Laranja muito claro para áreas destacadas
      accentColor: '#F97316',    // Laranja brilhante para acentos
      borderColor: '#FED7AA',    // Laranja claro para bordas
    }
  },
  {
    name: 'Ruby Red',
    description: 'Tons sofisticados de vermelho rubi',
    colors: {
      primaryColor: '#BE123C',   // Vermelho rubi
      secondaryColor: '#9F1239', // Vermelho rubi mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FFF1F2', // Fundo rosa muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#FFE4E6',     // Rosa muito claro para áreas destacadas
      accentColor: '#E11D48',    // Vermelho vibrante para acentos
      borderColor: '#FDA4AF',    // Rosa claro para bordas
    }
  },
  {
    name: 'Dark Mode',
    description: 'Tema escuro com acentos em azul',
    colors: {
      primaryColor: '#2563EB',   // Azul brilhante
      secondaryColor: '#1D4ED8', // Azul mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#0F172A', // Fundo azul escuro
      cardColor: '#1E293B',      // Cards cinza azulado escuro
      mutedColor: '#334155',     // Cinza azulado para áreas destacadas
      accentColor: '#38BDF8',    // Azul ciano claro para acentos
      borderColor: '#475569',    // Cinza médio para bordas
    }
  },
  {
    name: 'Monochrome',
    description: 'Elegante tema monocromático em tons de cinza',
    colors: {
      primaryColor: '#374151',   // Cinza escuro
      secondaryColor: '#1F2937', // Cinza mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F9FAFB', // Fundo cinza muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#F3F4F6',     // Cinza muito claro para áreas destacadas
      accentColor: '#4B5563',    // Cinza médio para acentos
      borderColor: '#E5E7EB',    // Cinza claro para bordas
    }
  },
  {
    name: 'Lavender Dreams',
    description: 'Tons suaves de lavanda e lilás',
    colors: {
      primaryColor: '#8B5CF6',   // Lavanda/lilás
      secondaryColor: '#7C3AED', // Lavanda mais escura
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F5F3FF', // Fundo lavanda muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#EDE9FE',     // Lavanda muito claro para áreas destacadas
      accentColor: '#A78BFA',    // Lavanda claro para acentos
      borderColor: '#DDD6FE',    // Lavanda muito claro para bordas
    }
  },
  {
    name: 'Teal Tranquility',
    description: 'Tons tranquilos de azul-esverdeado',
    colors: {
      primaryColor: '#0D9488',   // Teal médio
      secondaryColor: '#0F766E', // Teal mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F0FDFA', // Fundo teal muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#CCFBF1',     // Teal muito claro para áreas destacadas
      accentColor: '#14B8A6',    // Teal brilhante para acentos
      borderColor: '#99F6E4',    // Teal claro para bordas
    }
  },
  {
    name: 'Golden Sunrise',
    description: 'Tons quentes de dourado e amarelo',
    colors: {
      primaryColor: '#D97706',   // Âmbar/dourado
      secondaryColor: '#B45309', // Âmbar mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FFFBEB', // Fundo amarelo muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#FEF3C7',     // Amarelo muito claro para áreas destacadas
      accentColor: '#F59E0B',    // Âmbar brilhante para acentos
      borderColor: '#FDE68A',    // Amarelo claro para bordas
    }
  },
  {
    name: 'Royal Purple',
    description: 'Tons ricos de roxo real com acentos dourados',
    colors: {
      primaryColor: '#7E22CE',   // Roxo real
      secondaryColor: '#6B21A8', // Roxo mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FAF5FF', // Fundo roxo muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#F3E8FF',     // Roxo muito claro para áreas destacadas
      accentColor: '#EAB308',    // Dourado para acentos (contraste)
      borderColor: '#E9D5FF',    // Roxo claro para bordas
    }
  },
  {
    name: 'Modern Mint',
    description: 'Refrescante tema verde menta com cinzas neutros',
    colors: {
      primaryColor: '#10B981',   // Verde menta
      secondaryColor: '#059669', // Verde menta escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#ECFDF5', // Fundo verde menta muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#D1FAE5',     // Verde menta claro para áreas destacadas
      accentColor: '#34D399',    // Verde menta brilhante para acentos
      borderColor: '#A7F3D0',    // Verde menta claro para bordas
    }
  },
  {
    name: 'Berry Bliss',
    description: 'Tons vibrantes de rosa e roxo berry',
    colors: {
      primaryColor: '#DB2777',   // Rosa pink
      secondaryColor: '#BE185D', // Rosa pink escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FDF2F8', // Fundo rosa muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#FCE7F3',     // Rosa claro para áreas destacadas
      accentColor: '#EC4899',    // Rosa vibrante para acentos
      borderColor: '#FBCFE8',    // Rosa claro para bordas
    }
  },
  {
    name: 'Nordic Frost',
    description: 'Tema gélido inspirado nas paisagens nórdicas',
    colors: {
      primaryColor: '#3B82F6',   // Azul gelo
      secondaryColor: '#2563EB', // Azul gelo escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#F0F9FF', // Fundo azul gelo muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#DBEAFE',     // Azul gelo claro para áreas destacadas
      accentColor: '#60A5FA',    // Azul gelo brilhante para acentos
      borderColor: '#BFDBFE',    // Azul gelo claro para bordas
    }
  },
  {
    name: 'Dark Chocolate',
    description: 'Rico tema marrom chocolate com tons âmbar',
    colors: {
      primaryColor: '#78350F',   // Marrom chocolate
      secondaryColor: '#451A03', // Marrom chocolate escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#FFFBEB', // Fundo âmbar muito claro
      cardColor: '#FFFFFF',      // Cards brancos
      mutedColor: '#FEF3C7',     // Âmbar claro para áreas destacadas
      accentColor: '#D97706',    // Âmbar para acentos
      borderColor: '#FDE68A',    // Âmbar claro para bordas
    }
  },
  {
    name: 'Dark Elegance',
    description: 'Tema escuro sofisticado com toques de roxo',
    colors: {
      primaryColor: '#8B5CF6',   // Roxo vibrante
      secondaryColor: '#7C3AED', // Roxo mais escuro
      textColor: '#FFFFFF',      // Texto branco
      backgroundColor: '#1E1B4B', // Fundo azul-escuro
      cardColor: '#312E81',      // Cards roxo escuro
      mutedColor: '#4338CA',     // Roxo médio para áreas destacadas
      accentColor: '#A78BFA',    // Roxo claro para acentos
      borderColor: '#6366F1',    // Roxo-azulado para bordas
    }
  }
]; 