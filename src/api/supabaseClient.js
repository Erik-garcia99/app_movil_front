// Cliente de Supabase para React Native
import { SUPABASE_CONFIG } from '../constants/config';

/**
 * Inicializar cliente de Supabase
 * Requiere: npm install @supabase/supabase-js
 */

export const initSupabaseClient = async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
    
    return supabase;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    throw error;
  }
};

// Exportar instancia singleton
let supabaseInstance = null;

export const getSupabaseClient = async () => {
  if (!supabaseInstance) {
    supabaseInstance = await initSupabaseClient();
  }
  return supabaseInstance;
};
