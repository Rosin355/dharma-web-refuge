import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TempleImage {
  id: string;
  filename: string;
  storage_url: string;
  alt_text: string | null;
  category: string | null;
  page_section: string | null;
}

interface UseTempleImagesReturn {
  images: TempleImage[];
  loading: boolean;
  error: string | null;
  getImagesByCategory: (category: string) => TempleImage[];
  refresh: () => Promise<void>;
}

export const useTempleImages = (pageSection: string = 'chi-siamo'): UseTempleImagesReturn => {
  const [images, setImages] = useState<TempleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('temple_images')
        .select('*')
        .eq('page_section', pageSection)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setImages(data || []);
    } catch (err) {
      console.error('Errore caricamento immagini tempio:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const getImagesByCategory = (category: string): TempleImage[] => {
    return images.filter(img => img.category === category);
  };

  const refresh = async () => {
    await fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, [pageSection]);

  return {
    images,
    loading,
    error,
    getImagesByCategory,
    refresh
  };
};

// Hook specifico per le immagini del carosello del tempio
export const useTempleCarouselImages = () => {
  const { images, loading, error, refresh } = useTempleImages('chi-siamo');
  
  // Mescola le immagini per il carosello
  const carouselImages = images.length > 0 ? 
    [...images].sort(() => Math.random() - 0.5).slice(0, 6) : 
    [];

  return {
    carouselImages,
    loading,
    error,
    refresh
  };
};

// Hook per immagini dei maestri
export const useMasterImages = () => {
  const { getImagesByCategory, loading, error, refresh } = useTempleImages('chi-siamo');
  
  return {
    masterImages: getImagesByCategory('maestri'),
    loading,
    error,
    refresh
  };
}; 