import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../shared/components/Model";
import { Ground } from "./Ground";
import { Doors } from "./Doors";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { Annotation } from "../../../shared/components/Annotation";
import { useSections, useSectionProducts } from "../../../lib/api";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../../product-viewer/state/viewer";
import { fadeRefAtom } from "../../../shared/state/fade";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CheckoutCounter } from "./CheckoutCounter";

export const StoreScene = (props: GroupProps) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [, setViewerState] = useAtom(viewerStateAtom);
  const [fadeRef] = useAtom(fadeRefAtom);

  // Fetch all sections with their models
  const { data: sections, isLoading: sectionsLoading } = useSections();

  // Fetch products for the selected section
  const { data: products, isLoading: productsLoading } =
    useSectionProducts(selectedSection);

  // When products are loaded, update the viewer
  useEffect(() => {
    if (selectedSection && products && products.length > 0) {
      // Fade out
      fadeRef?.fadeToBlack();

      // Update viewer state after fade
      setTimeout(() => {
        setViewerState({
          isOpen: true,
          currentIndex: 0,
          currentProduct: products[0],
          products: products,
        });

        fadeRef?.fadeFromBlack();

        // Reset selected section
        setSelectedSection(undefined);
      }, 1000);
    }
  }, [products, selectedSection, setViewerState, fadeRef]);

  const handleModelClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handlePointerOver = (id: string) => {
    setHoveredModel(id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredModel(null);
    document.body.style.cursor = "default";
  };

  if (sectionsLoading) return null;

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

        {sections?.map((section) => {
          return (
            <Select key={section.id} enabled={hoveredModel === section.id}>
              {/* Wrap each model in a RigidBody for collisions */}
              <RigidBody
                type="fixed"
                position={section.model.position}
                rotation={section.model.rotation}
                colliders={false}
              >
                <CuboidCollider
                  args={[1, 0.5, 0.8]} // Width, height, depth - use much smaller values
                  position={[1, 0.5, -0.75]} // Centered on the model
                />
                <Model
                  modelPath={section.model.path}
                  scale={section.model.scale}
                  onPointerOver={() => handlePointerOver(section.id)}
                  onPointerOut={handlePointerOut}
                  onClick={() => handleModelClick(section.id)}
                />
              </RigidBody>

              {hoveredModel === section.id && (
                <Annotation
                  position={section.model.position}
                  content={"Ver articulos"}
                />
              )}
            </Select>
          );
        })}
        <Doors />
        <Select enabled={hoveredModel === "checkoutCounter"}>
          <CheckoutCounter
            position={[-139.5, 0, -56.5]}
            onPointerOver={() => handlePointerOver("checkoutCounter")}
            onPointerOut={handlePointerOut}
          />
          {hoveredModel === "checkoutCounter" && (
            <Annotation position={[-139.5, 0, -56.5]} content="Pagar" />
          )}
        </Select>

        <Ground/>
      </group>
    </Selection>
  );
};
