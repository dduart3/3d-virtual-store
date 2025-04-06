import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getProductThumbnailUrl } from '../../modules/experience/store/utils/supabaseStorageUtils';


interface SectionWithRandomProduct {
  section_name: string;
  product_id: string; // Changed to string to match your DB structure
  product_name: string;
  thumbnail_url: string;
}

export function useSectionsWithRandomProducts() {
  const [data, setData] = useState<SectionWithRandomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSectionsWithRandomProducts = async () => {
      try {
        setLoading(true);
        const { data: sectionsData, error: sectionsError } = await supabase.rpc(
          'get_sections_with_random_products'
        );

        if (sectionsError) {
          throw new Error(sectionsError.message);
        }

        // Add thumbnail URLs to each product
        const sectionsWithThumbnails = sectionsData.map((item: any) => ({
          ...item,
          thumbnail_url: getProductThumbnailUrl(item.product_id)
        }));

        setData(sectionsWithThumbnails);
      } catch (err) {
        console.error('Error fetching sections with random products:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsWithRandomProducts();
  }, []);

  return { data, loading, error };
}
