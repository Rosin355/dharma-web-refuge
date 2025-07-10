-- ===============================================
-- FIX SECURITY WARNINGS SUPABASE
-- ===============================================

-- 1. Fix Function Search Path Mutable warnings
-- Imposta search_path sicuro per tutte le funzioni

-- Fix per update_page_contents_updated_at
ALTER FUNCTION public.update_page_contents_updated_at() 
SET search_path = 'public';

-- Fix per update_updated_at_column  
ALTER FUNCTION public.update_updated_at_column()
SET search_path = 'public';

-- Fix per handle_new_user
ALTER FUNCTION public.handle_new_user()
SET search_path = 'public';

-- 2. Verifica che le funzioni esistano e siano sicure
SELECT 
    proname as function_name,
    proconfig as configuration
FROM pg_proc 
WHERE proname IN (
    'update_page_contents_updated_at',
    'update_updated_at_column', 
    'handle_new_user'
)
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ===============================================
-- ISTRUZIONI MANUALI DA SEGUIRE IN SUPABASE UI:
-- ===============================================

/*
1. AUTH OTP LONG EXPIRY:
   - Vai su: Authentication → Settings
   - Trova: "OTP Expiry Time"  
   - Cambia in: 3600 secondi (1 ora)
   - Salva

2. LEAKED PASSWORD PROTECTION:
   - Vai su: Authentication → Settings
   - Trova: "Leaked Password Protection"
   - Abilita: ✅ "Enable leaked password protection"
   - Salva
*/ 