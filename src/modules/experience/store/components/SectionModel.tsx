import { CuboidCollider } from "@react-three/rapier";
import { Model, ModelProps } from "../../../../shared/components/Model";
// Create Sets of IDs for each section type
export const TABLE_IDS = new Set([
  'men-accessories',
  'women-accessories',
  'women-bags',
  'men-hats',
  'men-shoes',
  'women-shoes'
]);

export const WARDROBE_IDS = new Set([
  'women-blouses',
  'men-shirts',
  'women-skirts',
  'men-pants',
  'men-suits',
  'women-dresses'

]);

// Get section type
function getSectionModelType(sectionId: string): 'table' | 'wardrobe' | 'unknown' {
  if (TABLE_IDS.has(sectionId)) return 'table';
  if (WARDROBE_IDS.has(sectionId)) return 'wardrobe';
  return 'unknown';
}


export const SectionModel = ({ 
    modelPath, 
    isCritical = false,
    ...props 
  }: ModelProps) => {
    const sectionModelType = getSectionModelType(modelPath.split('/').pop()!);
  return (
    <group {...props}>
      {sectionModelType === 'table' && (
        <CuboidCollider
        args={[1, 0.5, 0.8]} // Width, height, depth - use much smaller values
        position={[1, 0.6, -0.8]} // Centered on the model
      />
      )}

      {sectionModelType === 'wardrobe' && (
        <CuboidCollider
        args={[2.4, 1, 0.5]} // Width, height, depth - use much smaller values
        position={[2.4, 1.1, -0.7]} // Centered on the model
      />
      )}
      
      <Model
        modelPath={modelPath}
        isCritical={true}
      />
    </group>
  );
};
