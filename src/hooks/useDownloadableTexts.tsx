import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DownloadableText = Database['public']['Tables']['downloadable_texts']['Row'];
type DownloadableTextInsert = Database['public']['Tables']['downloadable_texts']['Insert'];
type DownloadableTextUpdate = Database['public']['Tables']['downloadable_texts']['Update'];

export const useDownloadableTexts = (filters?: {
  published?: boolean;
  category?: string;
  language?: string;
  search?: string;
  tags?: string[];
}) => {
  const queryClient = useQueryClient();

  const { data: texts = [], isLoading, error } = useQuery({
    queryKey: ['downloadable-texts', filters],
    queryFn: async () => {
      let query = supabase
        .from('downloadable_texts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters?.published !== undefined) {
        query = query.eq('published', filters.published);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.language) {
        query = query.eq('language', filters.language);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DownloadableText[];
    },
  });

  const createText = useMutation({
    mutationFn: async (newText: DownloadableTextInsert) => {
      const { data, error } = await supabase
        .from('downloadable_texts')
        .insert(newText)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadable-texts'] });
    },
  });

  const updateText = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DownloadableTextUpdate }) => {
      const { data, error } = await supabase
        .from('downloadable_texts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadable-texts'] });
    },
  });

  const deleteText = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('downloadable_texts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadable-texts'] });
    },
  });

  return {
    texts,
    isLoading,
    error,
    createText,
    updateText,
    deleteText,
  };
};

export const useDownloadableText = (slug: string) => {
  const { data: text, isLoading, error } = useQuery({
    queryKey: ['downloadable-text', slug],
    queryFn: async () => {
      if (!slug || slug.trim() === '') {
        throw new Error('Slug non valido');
      }
      const { data, error } = await supabase
        .from('downloadable_texts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          throw new Error('Testo non trovato');
        }
        throw error;
      }
      if (!data) {
        throw new Error('Testo non trovato');
      }
      return data as DownloadableText;
    },
    enabled: !!slug && slug.trim() !== '',
    retry: false,
  });

  return {
    text: text || null,
    isLoading,
    error: error as Error | null,
  };
};
