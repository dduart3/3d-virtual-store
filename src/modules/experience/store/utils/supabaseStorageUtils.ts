import { supabase } from "../../../../lib/supabase";

export const getProductThumbnailUrl = (productId: string) => {
  return supabase.storage
    .from("store")
    .getPublicUrl(`products/${productId}/thumbnail.webp`).data.publicUrl;
};

export const getProductModelUrl = (productId: string) => {
  return supabase.storage
    .from("store")
    .getPublicUrl(`products/${productId}/model.glb`).data.publicUrl;
};

export const getSectionModelUrl = (sectionId: string) => {
  return supabase.storage
    .from("store")
    .getPublicUrl(`sections/${sectionId}/model.glb`).data.publicUrl;
};
