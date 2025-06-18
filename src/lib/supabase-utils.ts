import { supabase } from '@/integrations/supabase/client';

/**
 * Testa la connessione a Supabase
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test connessione base
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Errore connessione Supabase:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('✅ Connessione Supabase riuscita!');
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('❌ Errore test connessione:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Errore sconosciuto',
      details: err
    };
  }
};

/**
 * Verifica se l'utente è autenticato
 */
export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Errore verifica autenticazione:', error);
      return { user: null, error };
    }
    
    return { user: session?.user || null, error: null };
  } catch (err) {
    console.error('❌ Errore check auth:', err);
    return { user: null, error: err };
  }
};

/**
 * Logout utente
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Errore logout:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err) {
    console.error('❌ Errore logout:', err);
    return { success: false, error: err };
  }
}; 