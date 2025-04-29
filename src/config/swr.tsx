import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

// Configuração global do SWR
export const swrConfig = {
  // Revalidar ao focar a janela
  revalidateOnFocus: true,
  
  // Revalidar ao reconectar
  revalidateOnReconnect: true,
  
  // Tempo de revalidação em segundos (5 minutos)
  dedupingInterval: 300000,
  
  // Tentar novamente automaticamente em caso de erro
  shouldRetryOnError: true,
  
  // Número máximo de tentativas
  errorRetryCount: 3,
  
  // Manter dados desatualizados ao revalidar
  keepPreviousData: true,
  
  // Função global de tratamento de erros
  onError: (error: unknown, key: string) => {
    console.error(`SWR Error for ${key}:`, error);
  },
  
  // Função global de tratamento de dados
  onSuccess: (_data: unknown, _key: string) => {
    // Pode ser usado para logging ou analytics
  }
} as const;

// Componente de provider do SWR
export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}; 