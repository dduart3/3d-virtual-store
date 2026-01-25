
import * as THREE from "three";
import { useRef } from "react";
import { Float, Sparkles } from "@react-three/drei";
import { useShowcaseTimeline } from "../../../shared/hooks/useShowcaseTimeline"; 
import { Model } from "../../../shared/components/Model";
import { LowTechTunnel } from "../../../shared/components/LowTechTunnel";

export const ShowcaseScene = ({ 
  textLeftRef, 
  textTopRef,
  textBottomRef,
  textRightRef,
  overlayRef,
  experimentTextRef,
  featuresTextRef,
  carouselRef,
  carouselTrackRef,
  footerRef,
  featuresBgRef,
  particlesRef,
  heroRef,
  godRaysRef // New ref
}: { 
  heroRef: React.RefObject<HTMLDivElement>,
  godRaysRef: React.RefObject<HTMLDivElement>, // New ref type
  textLeftRef: React.RefObject<HTMLDivElement>, 
  textTopRef: React.RefObject<HTMLDivElement>,
  textBottomRef: React.RefObject<HTMLDivElement>,
  textRightRef: React.RefObject<HTMLDivElement>,
  overlayRef: React.RefObject<HTMLDivElement>,
  experimentTextRef: React.RefObject<HTMLDivElement>,
  featuresTextRef: React.RefObject<HTMLDivElement>,
  carouselRef: React.RefObject<HTMLDivElement>,
  carouselTrackRef: React.RefObject<HTMLDivElement>,
  footerRef: React.RefObject<HTMLDivElement>,
  featuresBgRef: React.RefObject<HTMLDivElement>,
  particlesRef: React.RefObject<any>
}) => {
  const watchGroupRef = useRef<THREE.Group>(null);
  const sunglassesGroupRef = useRef<THREE.Group>(null);
  const dressGroupRef = useRef<THREE.Group>(null);
  const tunnelRef = useRef<any>(null); // Internal ref

  /* 
     REFACTORED: Animation logic moved to useShowcaseTimeline hook.
     This keeps component clean and handles GSAP Context automatically.
  */
  useShowcaseTimeline({
    hero: heroRef, 
    godRays: godRaysRef, // Pass to hook
    watchGroup: watchGroupRef,
    sunglassesGroup: sunglassesGroupRef,
    dressGroup: dressGroupRef,
    textLeft: textLeftRef,
    textTop: textTopRef,
    textBottom: textBottomRef,
    textRight: textRightRef,
    overlay: overlayRef,
    experimentText: experimentTextRef,
    featuresText: featuresTextRef,
    carousel: carouselRef,
    carouselTrack: carouselTrackRef,
    footer: footerRef,
    tunnel: tunnelRef,
    featuresBg: featuresBgRef,
    particles: particlesRef
  });

  return (
    <group>
        {/* Ambient Floating Particles (Life & Movement) */}
        <Sparkles 
            count={150} 
            scale={15} 
            size={2} 
            speed={0.4} 
            opacity={0.3} 
            color="#ffffff"
            noise={0.1}
        />

        <group ref={watchGroupRef} position={[5, -1, 0]} rotation={[0, 2, 0.1]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
                <Model 
                    modelPath="/models/products/men-accessories/seiko.glb" 
                    scale={22} 
                />
            </Float>
        </group>

        {/* Sunglasses Group */}
        <group ref={sunglassesGroupRef} position={[5, 0, 0]} rotation={[0, 0.5, 0]} visible={false}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Model
                    modelPath="/models/products/men-accessories/aviator-sunglasses.glb"
                    scale={-2} // Reverted to User's preference
                />
            </Float>
        </group>

        {/* Dress Group - Initially Hidden (Opacity 0) */}
        <group ref={dressGroupRef} position={[0, -20, 0]} rotation={[0, 0, 0]} visible={false}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
                <Model
                    modelPath="/models/products/women-blouses/blouse.glb"
                    scale={1.5} 
                />
            </Float>
        </group>
        <LowTechTunnel ref={tunnelRef} opacity={0} />
        <Sparkles ref={particlesRef} opacity={0} count={300} scale={20} size={6} speed={0.2} noise={0.1} color="#a0c0ff" />
    </group>
  );
};
