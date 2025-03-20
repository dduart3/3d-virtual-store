import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";
import { Ground } from "./Ground";
import { Doors } from "./Doors";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { Annotation } from "../../../../shared/components/Annotation";
import { useSections } from "../hooks/useSections";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../../product-viewer/state/viewer";
import { CheckoutCounter } from "./CheckoutCounter";
import { Jukebox } from "./Jukebox";
import { useSectionProducts } from "../hooks/useProducts";
import { cartAtom, paymentModalOpenAtom } from "../../../cart/state/cart";
import { useToast } from "../../../../shared/context/ToastContext";
import { Colliders } from "./Colliders";
import { SectionModel } from "./SectionModel";
import { fadeRefAtom } from "../../../../shared/state/fade";

export const StoreScene = (props: GroupProps) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [, setViewerState] = useAtom(viewerStateAtom);
  const [fadeRef] = useAtom(fadeRefAtom);
  const [, setIsPaymentModalOpen] = useAtom(paymentModalOpenAtom);
  const [cart] = useAtom(cartAtom);
  const { showToast } = useToast();

  // Fetch all sections with their models
  const { data: sections, isLoading: sectionsLoading } = useSections();

  // Fetch products for the selected section
  const { data: products, isLoading: productsLoading } = useSectionProducts(selectedSection);

  // When products are loaded, update the viewer
  useEffect(() => {
    if (selectedSection && products && products.length > 0 && !productsLoading) {
      const handleSectionClick = async () => {
        // Start fade out transition
        if (fadeRef) {
          await fadeRef.fadeToBlack();
          
          // Add a delay to ensure the fade is complete and visible
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Now we're in the 'loading' state, update viewer state
          setViewerState({
            isOpen: true,
            currentIndex: 0,
            currentProduct: products[0],
            products: products,
            isLoading: true // Add loading state to viewer
          });
          
          // Reset selected section
          setSelectedSection(undefined);
        }
      };
      
      handleSectionClick();
    }
  }, [products, selectedSection, productsLoading, setViewerState, fadeRef]);

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
        <Model isCritical={true} modelPath="scene" />

        {sections?.map((section) => {
          console.log(section)
          return (
            <Select key={section.id} enabled={hoveredModel === section.id}>
              {/* Wrap each model in a RigidBody for collisions */}
              <SectionModel
                position={section.model.position}
                rotation={section.model.rotation}
                modelPath={section.model.path}
                scale={section.model.scale}
                onPointerOver={() => handlePointerOver(section.id)}
                onPointerOut={handlePointerOut}
                onClick={() => handleModelClick(section.id)}
                isCritical={true}
              />
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
            position={[-135.5, -0.5, -56.5]}
            onPointerOver={() => handlePointerOver("checkoutCounter")}
            onPointerOut={handlePointerOut}
            onClick={() => {
              if (cart.items.length > 0) {
                setIsPaymentModalOpen(true);
              } else {
                showToast("No hay productos en el carrito", "info");
              }
            }}
          />
          {hoveredModel === "checkoutCounter" && (
            <Annotation position={[-135.5, -0.5, -56.5]} content="Pagar" />
          )}
        </Select>

        <Select enabled={hoveredModel === "jukebox"}>
          <Jukebox
            position={[-157.5, -0.5, -51.9]}
            onPointerOver={() => handlePointerOver("jukebox")}
            onPointerOut={handlePointerOut}
            rotation={[0, Math.PI / 1, 0]}
            scale={1.5}
          />
          {hoveredModel === "jukebox" && (
            <Annotation
              position={[-157.5, -0.5, -51.9]}
              content="Escuchar musica"
            />
          )}
        </Select>

        <Ground />
        <Colliders />
      </group>
    </Selection>
  );
};
