
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Footer } from "../shared/components/Footer";
import { Preloader } from "../shared/components/Preloader";
import { HeroSection } from "./landing/components/HeroSection";
import { ShowcaseScene } from "./landing/components/ShowcaseScene";
import { FeaturesCarousel } from "./landing/components/FeaturesCarousel";
import { 
    ExperimentOverlay, 
    FeaturesOverlay, 
    ProductLeftOverlay, 
    ProductTopOverlay, 
    ProductBottomOverlay, 
    ProductRightOverlay 
} from "./landing/components/ShowcaseOverlays";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [is3DInView, setIs3DInView] = useState(true);
  const watchSectionRef = useRef<HTMLElement>(null);

  // Refs for 3D Scene and Overlays
  const watchTextLeftRef = useRef<HTMLDivElement>(null);
  const watchTextTopRef = useRef<HTMLDivElement>(null);
  const sunglassesTextBottomRef = useRef<HTMLDivElement>(null);
  const dressTextRightRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  
  const experimentTextRef = useRef<HTMLDivElement>(null);
  const featuresTextRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const featuresBgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIs3DInView(entry.isIntersecting);
      },
      { rootMargin: "100px" } 
    );
    
    if (watchSectionRef.current) {
      observer.observe(watchSectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-gray-950 text-white ${!isLoaded ? 'h-screen overflow-hidden' : ''}`}>
      <Preloader onComplete={() => setIsLoaded(true)} />
      
      <HeroSection isLoaded={isLoaded} />

      {/* 3D Models Section - Luxury Watch Showcase */}
      <section id="watch-section" ref={watchSectionRef} className="relative w-full h-screen bg-[#050505] text-white overflow-hidden">
         {/* Background Visuals */}
         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/80 pointer-events-none z-0"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/80 pointer-events-none z-0"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(50,50,50,0.1),transparent_50%)] z-0"></div>
         {/* Ambient Blue Glow for visual depth */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,30,80,0.5),transparent_60%)] z-0 mix-blend-screen pointer-events-none"></div>
         
         {/* Features Background (Dark Blue Space Gradient) - Initially hidden */}
         <div ref={featuresBgRef} className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#020617] to-black z-0 opacity-0 pointer-events-none"></div>

         <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 35 }} gl={{ alpha: true }} frameloop={is3DInView ? "always" : "never"}>
               <Environment preset="city" />
               <ambientLight intensity={0.5} />
               <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow color="#fff0db" />
               <pointLight position={[-2, 0, 2]} intensity={0.5} color="#bad7ff" />
               <spotLight position={[-5, 2, -2]} intensity={4} color="#3b82f6" angle={0.6} penumbra={0.5} />
               
               <ShowcaseScene 
                  textLeftRef={watchTextLeftRef} 
                  textTopRef={watchTextTopRef} 
                  textBottomRef={sunglassesTextBottomRef}
                  textRightRef={dressTextRightRef}
                  overlayRef={whiteOverlayRef}
                  experimentTextRef={experimentTextRef}
                  featuresTextRef={featuresTextRef}
                  carouselRef={carouselRef}
                  carouselTrackRef={carouselTrackRef}
                  footerRef={footerRef}
                  featuresBgRef={featuresBgRef}
                  particlesRef={particlesRef}
               />

               <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={8} blur={3} far={4} color="#000000" />
            </Canvas>
         </div>
         
         {/* White Overlay Transition */}
         <div 
            ref={whiteOverlayRef}
            className="absolute z-50 bg-white w-[100vw] h-[2px] rounded-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 pointer-events-none origin-center"
         ></div>

         <ExperimentOverlay domRef={experimentTextRef} />
         <FeaturesOverlay domRef={featuresTextRef} />
         
         <FeaturesCarousel 
            carouselRef={carouselRef} 
            carouselTrackRef={carouselTrackRef} 
         />

         {/* Product Info Overlays */}
         <ProductLeftOverlay domRef={watchTextLeftRef} />
         <ProductTopOverlay domRef={watchTextTopRef} />
         <ProductBottomOverlay domRef={sunglassesTextBottomRef} />
         <ProductRightOverlay domRef={dressTextRightRef} />

      </section>

      {/* Footer Section - Hidden initially, animated by scroll */}
      <div ref={footerRef} className="fixed bottom-0 left-0 w-full h-screen z-[100] translate-y-full will-change-transform bg-[#050505]">
         <Footer />
      </div>
    </div>
  );
}
