import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  section_title: string | null;
  content_type: string;
  content: string;
  editor_instructions: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePageContent = (pageName: string) => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_name', pageName)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setContents(data || []);
    } catch (err) {
      console.error('Errore caricamento contenuti:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento contenuti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [pageName]);

  // Funzione helper per ottenere un contenuto specifico
  const getContent = (sectionKey: string, fallback: string = ''): string => {
    const content = contents.find(c => c.section_key === sectionKey);
    return content?.content || fallback;
  };

  // Funzione per aggiornare un contenuto (solo per admin)
  const updateContent = async (sectionKey: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('page_contents')
        .update({ 
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq('page_name', pageName)
        .eq('section_key', sectionKey);

      if (error) throw error;

      // Aggiorna lo stato locale
      setContents(prev => prev.map(c => 
        c.section_key === sectionKey 
          ? { ...c, content: newContent, updated_at: new Date().toISOString() }
          : c
      ));

      return true;
    } catch (err) {
      console.error('Errore aggiornamento contenuto:', err);
      setError(err instanceof Error ? err.message : 'Errore aggiornamento');
      return false;
    }
  };

  return {
    contents,
    loading,
    error,
    getContent,
    updateContent,
    refetch: fetchContents
  };
}; 