import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Event = Tables<'events'>;
export type EventBooking = Tables<'event_bookings'>;
export type EventInsert = TablesInsert<'events'>;
export type EventUpdate = TablesUpdate<'events'>;
export type EventBookingInsert = TablesInsert<'event_bookings'>;
export type EventBookingUpdate = TablesUpdate<'event_bookings'>;

interface EventsState {
  events: Event[];
  bookings: EventBooking[];
  loading: boolean;
  error: string | null;
}

export const useEvents = () => {
  const [state, setState] = useState<EventsState>({
    events: [],
    bookings: [],
    loading: false,
    error: null
  });

  // Carica tutti gli eventi
  const loadEvents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      setState(prev => ({ ...prev, events: data || [], loading: false }));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento eventi';
      console.error('Errore loadEvents:', error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Carica eventi pubblicati (per frontend)
  const loadPublishedEvents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Carica tutti gli eventi (senza filtro status per ora)
      console.log('Caricamento eventi dal database...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      console.log(`✅ Caricati ${data?.length || 0} eventi dal database`);
      setState(prev => ({ ...prev, events: data || [], loading: false }));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento eventi';
      console.error('Errore loadPublishedEvents:', error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Carica un singolo evento
  const loadEvent = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento evento';
      console.error('Errore loadEvent:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Crea un nuovo evento
  const createEvent = useCallback(async (eventData: EventInsert) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        events: [...prev.events, data].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione evento';
      console.error('Errore createEvent:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Aggiorna un evento
  const updateEvent = useCallback(async (id: string, eventData: EventUpdate) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        events: prev.events.map(event => 
          event.id === id ? data : event
        ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'aggiornamento evento';
      console.error('Errore updateEvent:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Elimina un evento
  const deleteEvent = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        events: prev.events.filter(event => event.id !== id)
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione evento';
      console.error('Errore deleteEvent:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Carica prenotazioni per un evento
  const loadEventBookings = useCallback(async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_bookings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento prenotazioni';
      console.error('Errore loadEventBookings:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Carica tutte le prenotazioni (per admin)
  const loadAllBookings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('event_bookings')
        .select(`
          *,
          events (
            title,
            start_date,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({ ...prev, bookings: data || [], loading: false }));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento prenotazioni';
      console.error('Errore loadAllBookings:', error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Crea una prenotazione
  const createBooking = useCallback(async (bookingData: EventBookingInsert) => {
    try {
      const { data, error } = await supabase
        .from('event_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        bookings: [data, ...prev.bookings]
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione prenotazione';
      console.error('Errore createBooking:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Aggiorna una prenotazione
  const updateBooking = useCallback(async (id: string, bookingData: EventBookingUpdate) => {
    try {
      const { data, error } = await supabase
        .from('event_bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        bookings: prev.bookings.map(booking => 
          booking.id === id ? data : booking
        )
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'aggiornamento prenotazione';
      console.error('Errore updateBooking:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Elimina una prenotazione
  const deleteBooking = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        bookings: prev.bookings.filter(booking => booking.id !== id)
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione prenotazione';
      console.error('Errore deleteBooking:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    loadEvents,
    loadPublishedEvents,
    loadEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    loadEventBookings,
    loadAllBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    clearError
  };
}; 