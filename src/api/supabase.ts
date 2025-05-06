import { supabase } from '@/lib/supabase';

// Este arquivo será removido. Use @/lib/supabase diretamente em vez deste.
export const createClient = () => {
  console.warn('src/api/supabase.ts está deprecated. Use @/lib/supabase diretamente em vez deste.');
  return supabase;
};
