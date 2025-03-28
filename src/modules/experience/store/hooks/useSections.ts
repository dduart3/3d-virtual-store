import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { parsePosition, parseRotation, parseScale } from '../../types/model';
import { SectionWithModel } from '../types/section';
import { getSectionModelUrl } from '../utils/supabaseStorageUtils';
// Fetch all sections with their models
export function useSections() {
  return useQuery<SectionWithModel[]>({
    queryKey: ['sections'],
    queryFn: async () => {
      // Get all sections
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .order('name');
     
      if (sectionsError) throw sectionsError;
     
      // Get models for these sections
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .is('product_id', null)
        .not('section_id', 'is', null);
     
      if (modelsError) throw modelsError;
     
      // Join sections with their models
      return sections.map(section => {
        const model = models.find(m => m.section_id === section.id);
        if (!model) {
          throw new Error(`Model not found for section ${section.id}`);
        }
       
        return {
          ...section,
          model: {
            id: model.id,
            path: getSectionModelUrl(section.id), // Use the utility function
            position: parsePosition(model.position),
            rotation: parseRotation(model.rotation),
            scale: parseScale(model.scale),
            label: model.label || undefined
          }
        };
      });
    }
  });
}

// Fetch a single section with its model
export function useSection(sectionId: string | undefined) {
  return useQuery<SectionWithModel>({
    queryKey: ['section', sectionId],
    queryFn: async () => {
      if (!sectionId) throw new Error('Section ID is required');
     
      // Get section
      const { data: section, error: sectionError } = await supabase
        .from('sections')
        .select('*')
        .eq('id', sectionId)
        .single();
     
      if (sectionError) throw sectionError;
     
      // Get section model
      const { data: model, error: modelError } = await supabase
        .from('models')
        .select('*')
        .eq('section_id', sectionId)
        .is('product_id', null)
        .single();
     
      if (modelError) throw modelError;
     
      return {
        ...section,
        model: {
          id: model.id,
          path: getSectionModelUrl(sectionId), // Use the utility function
          position: parsePosition(model.position),
          rotation: parseRotation(model.rotation),
          scale: parseScale(model.scale),
          label: model.label || undefined
        }
      };
    },
    enabled: !!sectionId
  });
}
