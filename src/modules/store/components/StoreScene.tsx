import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../shared/components/Model";
import { Floor } from "./Floor";
import { Doors } from "./Doors";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { useState } from "react";
import { Annotation } from "../../../shared/components/Annotation";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../../product-viewer/state/viewer";
import { CheckoutCounter } from "./CheckoutCounter";
import { fadeRefAtom } from "../../../shared/state/fade";
import { getAllSectionModels, getProductsBySection } from "../data/store-sections";
import { SectionId } from "../types/store";

export const StoreScene = (props: GroupProps) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [, setViewerState] = useAtom(viewerStateAtom);
  const [fadeRef] = useAtom(fadeRefAtom);

  const handlePointerOver = (id: string) => {
    setHoveredModel(id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredModel(null);
    document.body.style.cursor = "default";
  };

  const handleModelClick = (id: SectionId) => {
    
    
    fadeRef?.fadeToBlack();

    setTimeout(() => {
      const products = getProductsBySection(id);
      setViewerState({
        isOpen: true,
        currentProduct: products[0] ?? null,
        products: products ?? null,
        currentIndex: 0,
      });
      
      fadeRef?.fadeFromBlack();
    }, 1000);
    
  };

  const models = getAllSectionModels()

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

        {models.map(({ id, path, position, label, rotation }) => (
          <Select key={id} enabled={hoveredModel === id}>
            <Model
              modelPath={path}
              position={position}
              rotation={rotation}
              onPointerOver={() => handlePointerOver(id)}
              onPointerOut={handlePointerOut}
              onClick={() => handleModelClick(id)}
            />
            {hoveredModel === id && (
              <Annotation
                position={position}
                content={label ? label : "Ver articulos"}
              />
            )}
          </Select>
        ))}

        <Select enabled={hoveredModel === "checkout-counter"}>
          <CheckoutCounter
            position={[-139.5, 0, -56.5]}
            onPointerOver={() => handlePointerOver("checkout-counter")}
            onPointerOut={handlePointerOut}
          />
          {hoveredModel === "checkout-counter" && (
            <Annotation position={[-139.5, 0, -56.5]} content={"Pagar"} />
          )}
        </Select>

        <Doors />
        <Floor rotation={[-Math.PI / 2, 0, 0]} position={[-165, -1, -60]} />
      </group>
    </Selection>
  );
};
