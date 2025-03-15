import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { ProductWithModel, parsePosition, parseRotation, parseScale } from '../../../../shared/types/app';

// Fetch products for a specific section
export function useSectionProducts(sectionId: string | undefined) {
  return useQuery<ProductWithModel[]>({
    queryKey: ['products', 'section', sectionId],
    queryFn: async () => {
      if (!sectionId) throw new Error('Section ID is required');
      
      // Get products for this section
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('section_id', sectionId);
      
      if (productsError) throw productsError;
      
      // Get models for these products
      const productIds = products.map(p => p.id);
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .in('product_id', productIds);
      
      if (modelsError) throw modelsError;
      
      // Join products with their models
      return products.map(product => {
        const model = models.find(m => m.product_id === product.id);
        if (!model) {
          throw new Error(`Model not found for product ${product.id}`);
        }
        
        return {
          ...product,
          model: {
            id: model.id,
            path: model.path,
            position: parsePosition(model.position),
            rotation: parseRotation(model.rotation),
            scale: parseScale(model.scale),
            label: model.label || undefined
          }
        };
      });
    },
    enabled: !!sectionId
  });
}

// Fetch a single product
export function useProduct(productId: string | undefined) {
  return useQuery<ProductWithModel>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      
      // Get product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // Get product model
      const { data: model, error: modelError } = await supabase
        .from('models')
        .select('*')
        .eq('product_id', productId)
        .single();
      
      if (modelError) throw modelError;
      
      return {
        ...product,
        model: {
          id: model.id,
          path: model.path,
          position: parsePosition(model.position),
          rotation: parseRotation(model.rotation),
          scale: parseScale(model.scale),
          label: model.label || undefined
        }
      };
    },
    enabled: !!productId
  });
}
