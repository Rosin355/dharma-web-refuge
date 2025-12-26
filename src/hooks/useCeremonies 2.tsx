import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];
type CeremonyInsert = Database['public']['Tables']['ceremonies']['Insert'];
type CeremonyUpdate = Database['public']['Tables']['ceremonies']['Update'];

export const useCeremonies = (statusFilter?: string) => {
  const queryClient = useQueryClient();

  const { data: ceremonies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['ceremonies', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('ceremonies')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Ceremony[];
    },
  });

  const createCeremony = useMutation({
    mutationFn: async (newCeremony: CeremonyInsert) => {
      const { data, error } = await supabase
        .from('ceremonies')
        .insert(newCeremony)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceremonies'] });
    },
  });

  const updateCeremony = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CeremonyUpdate }) => {
      const { data, error } = await supabase
        .from('ceremonies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceremonies'] });
    },
  });

  const deleteCeremony = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ceremonies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceremonies'] });
    },
  });

  return {
    ceremonies,
    isLoading,
    error,
    refetch,
    createCeremony,
    updateCeremony,
    deleteCeremony,
  };
};

export const useCeremonyRegistrations = (ceremonyId?: string) => {
  const queryClient = useQueryClient();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['ceremony-registrations', ceremonyId],
    queryFn: async () => {
      let query = supabase
        .from('ceremony_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (ceremonyId) {
        query = query.eq('ceremony_id', ceremonyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!ceremonyId,
  });

  const createRegistration = useMutation({
    mutationFn: async (registration: {
      ceremony_id: string;
      full_name: string;
      email: string;
      phone?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('ceremony_registrations')
        .insert(registration)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceremony-registrations'] });
    },
  });

  return {
    registrations,
    isLoading,
    createRegistration,
  };
};