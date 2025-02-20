import { GroupProps } from "@react-three/fiber";
import { Model } from "../Model";
import { Floor } from "./models/Floor";
import { Doors } from "./models/Doors";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { useState } from "react";
import { Annotation } from "../Annotation";
import { getCatalogForModel } from "../../modules/catalog/data/catalog";
import { ViewerScene } from '../../modules/product-viewer/components/ViewerScene'
import { useAtom } from 'jotai'
import { viewerStateAtom } from '../../modules/product-viewer/state/viewer'


type ModelConfig = {
  id: string;
  name: string;
  path: string;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
};

const defaultModelConfig = {
  label: "Ver articulos",
};

const MODELS: ModelConfig[] = [
  {
    ...defaultModelConfig,
    id: "checkout",
    name: "Checkout Counter",
    path: "/misc/checkout-counter",
    position: [-139.5, 0, -56.5],
    rotation: [0, 0, 0],
    label: "Pagar",
  },
  {
    ...defaultModelConfig,
    id: "suits",
    name: "Men's Suits",
    path: "/displays/wardrobes/suits-wardrobe",
    position: [-146, -0.46, -51.1],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "pants",
    name: "Men's Pants",
    path: "/displays/wardrobes/pants-wardrobe",
    position: [-152, -0.46, -51.1],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "shirts",
    name: "Men's Shirts",
    path: "/displays/wardrobes/shirts-wardrobe",
    position: [-158, -0.46, -51.1],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "hats",
    name: "Men's Hats",
    path: "/displays/tables/hats-table",
    position: [-148, -0.46, -55.6],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "menShoes",
    name: "Men's Shoes",
    path: "/displays/tables/men-shoes-table",
    position: [-153.8, -0.46, -55.6],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "menAccessories",
    name: "Men's Accessories",
    path: "/displays/tables/men-accesories-table",
    position: [-157, -0.46, -55.6],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "blouses",
    name: "Women's Blouses",
    path: "/displays/wardrobes/blouses-wardrobe",
    position: [-158, -0.46, -66.9],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "dresses",
    name: "Women's Dresses",
    path: "/displays/wardrobes/dresses-wardrobe",
    position: [-152, -0.46, -66.9],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "skirts",
    name: "Women's Skirts",
    path: "/displays/wardrobes/skirts-wardrobe",
    position: [-146, -0.46, -66.9],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "womenAccessories",
    name: "Women's Accessories",
    path: "/displays/tables/women-accesories-table",
    position: [-157, -0.46, -62.6],
    rotation: [0, 0, 0],
  },
  {
    ...defaultModelConfig,
    id: "womenShoes",
    name: "Women's Shoes",
    path: "/displays/tables/women-shoes-table",
    position: [-151.8, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
  },
  {
    ...defaultModelConfig,
    id: "bags",
    name: "Women's Bags",
    path: "/displays/tables/bags-table",
    position: [-146.1, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
  },
];

export const Scene = (props: GroupProps) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const [, setViewerState] = useAtom(viewerStateAtom)

  const handleModelClick = (id: string) => {
    const catalog = getCatalogForModel(id)
    setViewerState({
      isOpen: true,
      currentProduct: catalog[0],
      catalog: catalog,
      currentIndex: 0
    })
  }
  const handlePointerOver = (id: string) => {
    setHoveredModel(id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredModel(null);
    document.body.style.cursor = "default";
  };

  return (
    <Selection>
      <EffectComposer autoClear={false} multisampling={8}>
        <Outline
          blur
          edgeStrength={5}
          visibleEdgeColor={0xffffff}
          hiddenEdgeColor={0x00ff00}
        />
      </EffectComposer>

      <group {...props}>
        <Model modelPath="scene" />

        {MODELS.map(({ id, path, position, label, rotation }) => (
          <Select key={id} enabled={hoveredModel === id}>
            <Model
              modelPath={path}
              position={position}
              rotation={rotation}
              onPointerOver={() => handlePointerOver(id)}
              onPointerOut={handlePointerOut}
            />
            {hoveredModel === id && (
              <Annotation position={position} content={label} />
            )}
          </Select>
        ))}

        <Doors />
        <Floor rotation={[-Math.PI / 2, 0, 0]} position={[-165, -1, -60]} />
        <ViewerScene />
      </group>
    </Selection>
  );
};



