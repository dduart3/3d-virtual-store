import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseRefs {
  hero?: React.RefObject<HTMLElement | HTMLDivElement>; 
  godRays?: React.RefObject<HTMLDivElement>; // NEW
  watchGroup: React.RefObject<THREE.Group>;
  sunglassesGroup: React.RefObject<THREE.Group>;
  dressGroup: React.RefObject<THREE.Group>;
  textLeft: React.RefObject<HTMLDivElement>;
  textTop: React.RefObject<HTMLDivElement>;
  textBottom: React.RefObject<HTMLDivElement>;
  textRight: React.RefObject<HTMLDivElement>;
  overlay: React.RefObject<HTMLDivElement>;
  experimentText: React.RefObject<HTMLDivElement>;
  featuresText: React.RefObject<HTMLDivElement>;
  carousel: React.RefObject<HTMLDivElement>;
  carouselTrack: React.RefObject<HTMLDivElement>;
  footer: React.RefObject<HTMLDivElement>;
  tunnel: React.RefObject<any>;
  featuresBg: React.RefObject<HTMLDivElement>;
  particles: React.RefObject<any>;
}

export const useShowcaseTimeline = (refs: ShowcaseRefs) => {
  // Helper to update opacity of a model group
  const updateOpacity = (group: THREE.Group | null, opacity: number) => {
    if (!group) return;
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        materials.forEach((mat) => {
           const material = mat as THREE.Material & { opacity: number; transparent: boolean };
           material.transparent = true;
           material.opacity = opacity;
           material.needsUpdate = true;
        });
      }
    });
  };

  useLayoutEffect(() => {
    // 1. Validation: Ensure all refs exist
    if (!refs.watchGroup.current || !refs.sunglassesGroup.current || !refs.dressGroup.current || 
        !refs.textLeft.current || !refs.textTop.current || !refs.textBottom.current || !refs.textRight.current ||
        !refs.overlay.current || !refs.experimentText.current || !refs.featuresText.current || 
        !refs.carousel.current || !refs.carouselTrack.current || !refs.footer.current || !refs.tunnel.current) return;

    // 2. Context: Create a scope for easy cleanup
    const ctx = gsap.context(() => {
        // Initialize opacities
        if (refs.hero?.current) gsap.set(refs.hero.current, { opacity: 1, pointerEvents: "auto" }); 
        if (refs.godRays?.current) gsap.set(refs.godRays.current, { opacity: 1 }); 

        updateOpacity(refs.watchGroup.current, 0); // Start Hidden
        updateOpacity(refs.sunglassesGroup.current, 0);
        updateOpacity(refs.dressGroup.current, 0);
        
        // Visibility
        if (refs.sunglassesGroup.current) refs.sunglassesGroup.current.visible = true;
        if (refs.dressGroup.current) refs.dressGroup.current.visible = true;

        // Reset Text Opacity - Start Hidden
        if (refs.textLeft.current) gsap.set(refs.textLeft.current, { opacity: 0, x: -30 });

        // Proxy object for GSAP to animate
        const opacityValues = { watch: 0, sunglasses: 0, dress: 0 }; // Watch starts at 0

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#watch-section",
            start: "top top",
            end: "+=2500%", 
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true, 
          }
        });

        if (refs.hero?.current) {
           const cx = gsap.utils.selector(refs.hero.current);
           
           tl
            // 0a. Hero Items Exit
            .fromTo(cx('.hero-icon'), { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 0.5, ease: "power2.inOut", immediateRender: false }, "start")
            .fromTo(cx('.hero-title'), { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 1.5, ease: "power2.inOut", immediateRender: false }, "start+=0.5")
            .fromTo(cx('.hero-separator'), { opacity: 1, scaleX: 1 }, { opacity: 0, scaleX: 0, duration: 1, ease: "power2.inOut", immediateRender: false }, "start+=0.6")
            .fromTo(cx('.hero-desc'), { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 1.5, ease: "power2.inOut", immediateRender: false }, "start+=0.7")
            .fromTo(cx('.hero-buttons'), { opacity: 1, y: 0 }, { opacity: 0, y: 20, duration: 1.5, ease: "power2.inOut", immediateRender: false }, "start+=0.8")
            
            // 0b. God Rays Fade OUT -> but stop at 0.3 opacity
            .to(refs.godRays?.current || {}, { opacity: 0.3, duration: 2, ease: "power2.inOut" }, "start+=1.5")
            
            // Disable interactions
            .set(refs.hero.current, { pointerEvents: "none" });
        }
        
        // 0.5. Watch & Text Entrance (After Hero is gone)
        tl.add("watchEntry", ">-0.5") // Slight overlap with end of hero fade
        .to(opacityValues, {
            watch: 1,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => updateOpacity(refs.watchGroup.current, opacityValues.watch)
        }, "watchEntry")
        .to(refs.watchGroup.current!.position, {
            x: 1.2, // Move to visual center
            duration: 1.5,
            ease: "power2.out"
        }, "watchEntry")
        .to(refs.watchGroup.current!.rotation, {
            y:-0.8,
            duration: 1.5,
            ease: "power2.out"
        }, "watchEntry")


        .to(refs.textLeft.current, {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out"
        }, "watchEntry")
        
        // Hold for viewing
        .to({}, { duration: 1 })

        

        // 1. Move Watch to Center & Lay Down
        .add("watchMove") // Mark entry point for watch animation
        .to(refs.watchGroup.current!.position, {
          x: 1.2,
          y: -0.28, 
          z: 0, 
          duration: 2.5,
          ease: "power2.inOut"
        }, "watchMove")
        .to(refs.watchGroup.current!.rotation, {
          x: 0,          
          y: 0,             
          z: Math.PI / 2,  
          duration: 2.5,
          ease: "power2.inOut"
        }, "watchMove")
        
        // 2. Fade Out Left Text
        .to(refs.textLeft.current, {
          opacity: 0,
          x: -50,
          duration: 1.5,
          ease: "power2.out"
        }, "watchMove")

        // 3. Fade In Top Text (towards end of movement)
        // Starts 1.5s into the 2.5s movement
        .to(refs.textTop.current, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out"
        }, "watchMove+=1")
        
        // --- Phase 2: Switch to Sunglasses ---
        
        // 4. Move Watch Away (Left)
        .to(refs.watchGroup.current!.position, {
          x: -5,
          y: 0,
          duration: 1.5,
          ease: "power2.in"
        }, "switch")
        .to(refs.watchGroup.current!.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.5,
            ease: "power2.in"
        }, "switch")
        .to(refs.textTop.current, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power2.in"
        }, "switch")

        // Ensure Sunglasses become visible right before entering
        .set(refs.sunglassesGroup.current, { visible: true }, "switch+=0.1")

        // 5. Sunglasses Enter (From Right)
        .to(refs.sunglassesGroup.current!.position, {
            x: 0,
            y: -5,
            z: -50,   
            duration: 2,
            ease: "power2.out"
        }, "switch+=0.5")
        .to(opacityValues, {
            sunglasses: 1,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => updateOpacity(refs.sunglassesGroup.current, opacityValues.sunglasses)
        }, "switch+=0.5")
        .to(refs.sunglassesGroup.current!.rotation, {
            x: 0, 
            y: Math.PI / 1,   
            z: 3.14,   
            duration: 2,
            ease: "power2.out"
        }, "switch+=0.5")

        // 6. Fade In Bottom Text
        .to(refs.textBottom.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, "switch+=1.5")
        
        // --- Phase 3: Switch to Dress ---
        
        // 7. Sunglasses Fade Out & Exit
        .to(refs.sunglassesGroup.current!.position, {
            x: 0,
            y: 20, 
            duration: 1.5,
            ease: "power2.in"
        }, "switch2")
        .to(opacityValues, {
            sunglasses: 0,
            duration: 1.5,
            ease: "power2.in",
            onUpdate: () => updateOpacity(refs.sunglassesGroup.current, opacityValues.sunglasses)
        }, "switch2")
        .to(refs.textBottom.current, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.in"
        }, "switch2")

        // 8. Dress Enter (From Left)
        .set(refs.dressGroup.current, { visible: true }, "switch2+=0.1")
        .to(refs.dressGroup.current!.position, {
            x: 0, 
            y: 0,    
            z: 3,    
            duration: 2,
            ease: "power2.out"
        }, "switch2+=0.5")
        .to(opacityValues, {
            dress: 1,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => updateOpacity(refs.dressGroup.current, opacityValues.dress)
        }, "switch2+=0.5")
        .to(refs.dressGroup.current!.rotation, {
            y: 101.2, 
            duration: 2,
            ease: "power2.out"
        }, "switch2+=0.5")

        // 9. Text Right Enter
        .to(refs.textRight.current, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "switch2+=1")

        // 10. Exit All (Fade Out)
        .to(opacityValues, {
            dress: 0,
            duration: 1.5,
            ease: "power2.in",
            onUpdate: () => updateOpacity(refs.dressGroup.current, opacityValues.dress)
        }, "switch3")
        .to(refs.textRight.current, {
            opacity: 0,
            x: 50, 
            duration: 1.5,
            ease: "power2.in"
        }, "switch3")
        
        // 11. White Overlay Step 1 (Enter as Line)
        
        // 11. White Overlay Step 1 (Enter as Line)
        .fromTo(refs.overlay.current, 
            { scaleX: 0, scaleY: 1, opacity: 1 }, 
            { 
              scaleX: 1, 
              opacity: 1, 
              duration: 1.5, 
              delay: 1,
              ease: "power3.inOut" 
            }, 
            "switch3+=0.5"
        )
        // 12. Expand to Rectangle
        .to(refs.overlay.current, {
            scaleY: 100, 
            delay: 0.1,
            duration: 1,
            ease: "power3.inOut"
        })

        // 13. White Overlay Step 2 (Fill Screen)
        .to(refs.overlay.current, {
            scaleY: 2000, 
            scaleX: 1,    
            duration: 2,
            ease: "power3.inOut"
        }, "overlayFill")
        // 13b. Reveal Tunnel & Fade Out Overlay
        .to(refs.overlay.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "overlayFill+=1")
        .to(refs.tunnel.current, {
            uOpacity: 0.6, // Tunnel visible for Experiment/Features
            duration: 1,
            ease: "power2.inOut"
        }, "overlayFill+=1")

        // 14. Experiment Text Enter (Cinematic Blur & Slide)
        .set(refs.experimentText.current, { opacity: 1 }) // Make container visible
        .fromTo(refs.experimentText.current!.querySelectorAll('.reveal-text'), 
            {
                y: "150%",
                filter: "blur(20px)",
                scale: 1.5,
                opacity: 0,
                transformOrigin: "center center"
            },
            {
                y: "0%",
                filter: "blur(0px)",
                scale: 1,
                opacity: 1,
                duration: 1.5,
                stagger: 0.2, // Distinct delay for each line
                ease: "expo.out"
            }, 
            "overlayFill+=1.2"
        )
        
        // Short pause
        .to({}, { duration: 0.2 })

        // 15. Experiment Text Exit (Staggered Up)
        .to(refs.experimentText.current!.querySelectorAll('.reveal-text'), {
            y: "-100%",
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.in"
        })
        .set(refs.experimentText.current, { opacity: 0 }) // Hide container after

        // 16. Features Text Enter (Staggered Lines)
        .set(refs.featuresText.current, { opacity: 1 }) 
        .to(refs.featuresText.current!.querySelectorAll('.reveal-text'), {
            y: "0%",
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        })
        
        // 17. Exit Features Text (All content goes down)
        .to(refs.featuresText.current!.querySelectorAll('.reveal-text'), {
            y: "100%", // all text moves down
            duration: 1,
            stagger: 0.05,
            ease: "power2.inOut"
        }, "carouselEnter")

        // Reveal Carousel Container (which now includes the header)
        .to(refs.carousel.current, {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        }, "carouselEnter+=0.5")
        
        // Fade out tunnel (to reveal black background -> now dark blue space) for Carousel
        .to(refs.tunnel.current, {
            uOpacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "carouselEnter+=0.5")
        
        // Show Features Background & Particles
        .to(refs.featuresBg.current, {
             opacity: 1,
             duration: 2,
             ease: "power2.inOut"
        }, "carouselEnter+=0.5")
        // Animate Sparkles Opacity
        .to(refs.particles.current, { 
             opacity: 1, 
             duration: 2
        }, "carouselEnter+=0.5")

        // 18. Scroll Carousel

        // 18. Scroll Carousel
        .to(refs.carouselTrack.current, {
            x: () => -((refs.carouselTrack.current?.scrollWidth || 0) - window.innerWidth + (window.innerWidth * 0.1)), 
            duration: 5, 
            ease: "none" 
        })
        
        // 19. Footer Slide Up (Parallax Effect)
        .to(refs.footer.current, {
           y: "0%", 
           duration: 1.5,
           ease: "power3.out"
        });

    });

    return () => ctx.revert(); // Context handles cleanup
    
  }, [refs]); 
};
