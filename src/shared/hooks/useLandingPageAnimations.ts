import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LandingPageAnimationElements {
  // Navbar elements
  newsletter?: HTMLElement | null;
  logo?: HTMLElement | null;
  logoIcon?: HTMLElement | null;
  logoText?: HTMLElement | null;
  language?: HTMLElement | null;
  languageText?: HTMLElement | null;
  navigation?: HTMLElement | null;
  
  // Hero elements
  heroText?: HTMLElement | null;
  japaneseText?: HTMLElement | null;
  
  // Navbar refs for scroll animations
  normalNav?: HTMLElement | null;
  minimalNav?: HTMLElement | null;
  header?: HTMLElement | null;
  
  // Scroll state callback
  onScrollChange?: (isScrolled: boolean) => void;

  // Horizontal Scroll Elements
  pinnedSection?: HTMLElement | null;
  horizontalWrapper?: HTMLElement | null;

  section4?: HTMLElement | null;
  section4LeftText?: HTMLElement | null;
  section4RightText?: HTMLElement | null;
  section4Cube?: HTMLElement | null;
  section4CubeWrapper?: HTMLElement | null;
  section4Paragraph?: HTMLElement | null;
  section5?: HTMLElement | null;
}

/**
 * Complete GSAP Timeline for Landing Page
 * Organizes all animations in a single, maintainable timeline
 */
export function useLandingPageAnimations(elements: LandingPageAnimationElements) {
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasAnimatedRef = useRef(false);

  // Content for the cube faces
  const cubeTexts = [
    "In September 2025, Big Picture Company executed Baemin's 'Affordable & Fast' campaign in the key commercial district of Hannam-dong through an out-of-home (OOH) advertising installation.", // Face 1 (Front)
    "Our modern architectural approach seamlessly integrates digital experiences with physical spaces, creating immersive retail environments.", // Face 2 (Right)
    "Sustainable materials meet cutting-edge design in our latest collection, defining the future of eco-conscious luxury fashion.", // Face 3 (Back)
    "Global connectivity drives our creative vision, bringing together diverse cultural influences into a unified aesthetic language."  // Face 4 (Left)
  ];

  useEffect(() => {
    // Check if required elements are available
    const hasElements = elements.newsletter || elements.logo || elements.heroText;
    
    if (!hasElements || hasAnimatedRef.current) {
      return;
    }

    // ============================================
    // MASTER TIMELINE - Initial Page Load
    // ============================================
    const masterTL = gsap.timeline({ paused: true });

    // Phase 1: Navbar Animations (0s - 1.2s)
    const navbarPhase = gsap.timeline();
    
    if (elements.newsletter) {
      navbarPhase.from(elements.newsletter, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power2.out",
      }, 0);
    }

    if (elements.logo) {
      navbarPhase.from(elements.logo, {
        opacity: 0,
        y: -30,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.out",
      }, 0.2);
    }

    if (elements.language) {
      navbarPhase.from(elements.language, {
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: "power2.out",
      }, 0);
    }

    if (elements.navigation) {
      navbarPhase.from(elements.navigation, {
        opacity: 0,
        y: -20,
        duration: 0.7,
        ease: "power2.out",
      }, 0.4);
    }

    masterTL.add(navbarPhase, 0);

    // Phase 2: Hero Content Animations (0.8s - 2.5s)
    const heroPhase = gsap.timeline();

    if (elements.heroText) {
      heroPhase.from(elements.heroText, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
      }, 0);
    }

    if (elements.japaneseText) {
      heroPhase.from(elements.japaneseText, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 1.2,
        ease: "power3.out",
      }, 0.3);
    }

    masterTL.add(heroPhase, 0.8);

    // Store and play master timeline
    masterTimelineRef.current = masterTL;
    hasAnimatedRef.current = true;
    masterTL.play();

    // ============================================
    // SCROLL TRIGGER - Smooth Navbar Transition (Up/Down)
    // ============================================
    if (elements.normalNav && elements.minimalNav && elements.header && typeof window !== "undefined") {
      // Set initial states
      gsap.set(elements.normalNav, {
        opacity: 1,
        y: 0,
        display: "block"
      });
      gsap.set(elements.minimalNav, {
        opacity: 0,
        y: -30, // Start from above
        display: "none"
      });


      let normalNavAnimation: gsap.core.Tween | null = null;
      let minimalNavAnimation: gsap.core.Tween | null = null;
      let headerAnimation: gsap.core.Tween | null = null;

      // Use ScrollTrigger to detect scroll position
      const scrollTL = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=100",
          scrub: false,
          onEnter: () => {
            // Scrolling down - normal nav disappears up, minimal nav appears from above
            if (elements.onScrollChange) {
              elements.onScrollChange(true);
            }

            // Kill any existing animations
            if (normalNavAnimation) normalNavAnimation.kill();
            if (minimalNavAnimation) minimalNavAnimation.kill();
            if (headerAnimation) headerAnimation.kill();

            // Normal nav fades out and moves up smoothly
            normalNavAnimation = gsap.to(elements.normalNav!, {
              opacity: 0,
              y: -30, // Move up as it fades
              duration: 0.7,
              ease: "power2.out", // Smooth ease out
              onComplete: () => {
                if (elements.normalNav) {
                  elements.normalNav.style.display = "none";
                }
              }
            });

            // Minimal nav appears from above and fades in
            if (elements.minimalNav) {
              elements.minimalNav.style.display = "flex";
              gsap.set(elements.minimalNav, { 
                opacity: 0, 
                y: -30 // Start from above
              });
              
              minimalNavAnimation = gsap.to(elements.minimalNav, {
                opacity: 1,
                y: 0, // Move to position
                duration: 0.8,
                delay: 0.15, // Slight overlap for smoother transition
                ease: "power2.out" // Smooth ease out
              });
            }

            // Animate header background smoothly
            headerAnimation = gsap.to(elements.header!, {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              duration: 0.7,
              ease: "power2.out"
            });
          },
          onLeaveBack: () => {
            // Scrolling up - minimal nav disappears up, normal nav appears from above
            if (elements.onScrollChange) {
              elements.onScrollChange(false);
            }

            // Kill any existing animations
            if (normalNavAnimation) normalNavAnimation.kill();
            if (minimalNavAnimation) minimalNavAnimation.kill();
            if (headerAnimation) headerAnimation.kill();

            // Minimal nav fades out and moves up smoothly
            minimalNavAnimation = gsap.to(elements.minimalNav!, {
              opacity: 0,
              y: -30, // Move up as it fades
              duration: 0.7,
              ease: "power2.out", // Smooth ease out
              onComplete: () => {
                if (elements.minimalNav) {
                  elements.minimalNav.style.display = "none";
                }
              }
            });

            // Normal nav appears from above and fades in
            if (elements.normalNav) {
              elements.normalNav.style.display = "block";
              gsap.set(elements.normalNav, { 
                opacity: 0, 
                y: -30 // Start from above
              });
              
              normalNavAnimation = gsap.to(elements.normalNav, {
                opacity: 1,
                y: 0, // Move to position
                duration: 0.8,
                delay: 0.15, // Slight overlap for smoother transition
                ease: "power2.out" // Smooth ease out
              });
            }

            // Animate header background back smoothly
            headerAnimation = gsap.to(elements.header!, {
              backgroundColor: "transparent",
              boxShadow: "none",
              duration: 0.7,
              ease: "power2.out"
            });
          },
        },
      });

      scrollTimelineRef.current = scrollTL;
    }

    // ============================================
    // HORIZONTAL SCROLL SECTION
    // ============================================
    if (elements.pinnedSection && elements.horizontalWrapper) {
      

      const horizontalTL = gsap.timeline();

      // Step 1: Stepped Horizontal Movement with Pins
      // Move to Section 2
      horizontalTL.to(elements.horizontalWrapper, {
        xPercent: -25,
        duration: 1,
        ease: "power2.inOut"
      });
      
      // Pin Section 2
      horizontalTL.to({}, { duration: 0.5 }); // Reduced pin

      // Move to Section 3
      horizontalTL.to(elements.horizontalWrapper, {
        xPercent: -50,
        duration: 1,
        ease: "power2.inOut"
      });

      // Pin Section 3
      horizontalTL.to({}, { duration: 0.5 }); // Reduced pin

      // Move to Section 4
      horizontalTL.to(elements.horizontalWrapper, {
        xPercent: -75,
        duration: 1,
        ease: "power2.inOut"
      });

      // SECTION 4 ANIMATIONS (Sequenced AFTER movement)
      // These coincide with the "hold" phase where the section is pinned
      
      // 1. Text Split moving out
      if (elements.section4LeftText && elements.section4RightText) {
         horizontalTL.to(elements.section4LeftText, {
            x: -550,
            opacity: 1,
            duration: 1, 
            ease: "power2.inOut",
            onComplete: () => {
               // Trigger smooth cube entrance automatically when text finishes splitting
               // Animate Scale AND Rotation on the WRAPPER to emphasize 3D volume
               if (elements.section4CubeWrapper) {
                 gsap.to(elements.section4CubeWrapper, {
                   scale: 1,
                   opacity: 1,
                   rotationY: 0, // Settle to 0 
                   rotationX: 0, // Settle flat
                   duration: 1.5,
                   ease: "power3.out",
                   overwrite: "auto"
                 });
               }
            }
         }, ">"); 

         horizontalTL.to(elements.section4RightText, {
            x: 550,
            opacity: 1,
            duration: 1, 
            ease: "power2.inOut"
         }, "<"); 
      }

      // 2. Cube Scale Up spacer
      // We add a small empty gap in the timeline so rotation doesn't start *immediately* while it's scaling
      // WE USE THIS SPACER TO TRIGGER THE REVERSE EXIT ANIMATION
      horizontalTL.to({}, { 
        duration: 0.2, // Reduced spacer
        onReverseComplete: () => {
           // When scrolling back up (before text starts joining), hide the cube
           // This maintains consistency: Cube Down -> Text Closes
           if (elements.section4CubeWrapper) {
             gsap.to(elements.section4CubeWrapper, {
               scale: 0,
               opacity: 0,
               rotationY: 45, // Rotate back to angled state
               rotationX: 10,
               duration: 0.5,
               overwrite: "auto"
             });
           }
        } 
      }); 

      // 3. Cube Rotation (After cube is fully scaled)
      // IMPORTANT: Target the INNER CUBE element, not the wrapper!
      if (elements.section4Cube) {
        horizontalTL.to(elements.section4Cube, {
          rotationY: 180, // Rotate through 3 faces
          duration: 2, 
          ease: "none",
          onUpdate: function() {
            // Update paragraph text based on rotation progress
            if (elements.section4Paragraph) {
              const progress = this.progress(); 
              let currentFace = 0;

              if (progress < 0.33) {
                currentFace = 0;
              } else if (progress < 0.66) {
                currentFace = 1;
              } else {
                currentFace = 2;
              }

              // Update text content
              elements.section4Paragraph.textContent = cubeTexts[currentFace];
              
              // Fade in paragraph
              gsap.to(elements.section4Paragraph, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                overwrite: true
              });
            }
          }
        }, ">"); 
      }

      // 4. Section 5 Parallax Reveal (Slides UP over the pinned section)
      // Since we added -mt-[100vh] in CSS, this section is technically overlapping.
      // We animate y from 100% (pushed down) to 0% (covering).
      if (elements.section5) {
         horizontalTL.to(elements.section5, {
            y: "0%", 
            duration: 1, // Becomes visible faster
            ease: "none"
         });
         
         // 5. Hold Phase (Keeps Section 5 pinned/locked for a moment after fully covering)
         horizontalTL.to({}, { duration: 0.1 }); // Significantly reduced final pin
      }

      // Master ScrollTrigger driving the whole Timeline
      ScrollTrigger.create({
        animation: horizontalTL,
        trigger: elements.pinnedSection,
        start: "top top",
        end: () => "+=" + (elements.horizontalWrapper ? elements.horizontalWrapper.scrollWidth * 1.5 : 4000), // Reduced distance
        pin: true,
        scrub: 1, 
        invalidateOnRefresh: true,
      });

      
      // Initial Setup only (Animations moved to main TL above)
      if (elements.section4LeftText && elements.section4RightText && elements.section4) {
        
        // Initial setup for Paragraph
        if (elements.section4Paragraph) {
          gsap.set(elements.section4Paragraph, { opacity: 0, y: 30 });
        }

        // Initial setup for Cube Wrapper - this handles entrance scale & twist
        if (elements.section4CubeWrapper) {
          gsap.set(elements.section4CubeWrapper, { 
            rotationY: 45, 
            rotationX: 10,
            scale: 0, 
            opacity: 0 
          });
        }
        
        // Initial setup for Inner Cube - starts flat (relative to wrapper)
        if (elements.section4Cube) {
           gsap.set(elements.section4Cube, { rotationY: 0 });
        }
        
        // Initial setup for Section 5 - Pushed down to wait for reveal
        if (elements.section5) {
           gsap.set(elements.section5, { y: "100%" });
        }

        // Previous ScrollTriggers removed as they are now part of horizontalTL
      }
      }




    // Cleanup
    return () => {
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
        masterTimelineRef.current = null;
      }
      if (scrollTimelineRef.current) {
        scrollTimelineRef.current.kill();
        scrollTimelineRef.current = null;
      }
      if (typeof window !== "undefined" && ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === document.body) {
            trigger.kill();
          }
        });
      }
    };
  }, [
    elements.newsletter,
    elements.logo,
    elements.language,
    elements.navigation,
    elements.heroText,
    elements.japaneseText,
    elements.normalNav,
    elements.minimalNav,
    elements.header,
    elements.pinnedSection,
    elements.horizontalWrapper,
  ]);

  return {
    masterTimeline: masterTimelineRef.current,
    scrollTimeline: scrollTimelineRef.current,
  };
}
