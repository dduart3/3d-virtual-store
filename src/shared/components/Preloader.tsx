
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Counter Animation Loop
    const counterObj = { val: 0 };
    const tl = gsap.timeline({
         onComplete: () => {
             // Let the parent know loading is done right when reveal starts
             // Ideally we want the hero animation to start AS the curtain moves up.
             // We can do this by calling onComplete slightly before the timeline ends or just let the parent generic "isLoaded" flag handle it.
             // Since the parent useEffect waits for isLoaded=true, we should set it true when we WANT the hero to start.
             onComplete(); 
             
             // After reveal, fully remove from DOM or just hide
             gsap.to(containerRef.current, { display: "none", delay: 1 });
         }
    });

    if (counterRef.current && overlayRef.current) {
         // Logo Pulse Animation (Independent)
         if (logoRef.current) {
             gsap.to(logoRef.current, {
                 opacity: 0.4,
                 duration: 1.5,
                 repeat: -1,
                 yoyo: true,
                 ease: "sine.inOut"
             });
         }

         // 1. Count from 0 to 100
         tl.to(counterObj, {
             val: 100,
             duration: 2,
             ease: "power2.out", 
             onUpdate: () => {
                 if (counterRef.current) {
                     const newVal = Math.floor(counterObj.val).toString();
                     if (counterRef.current.innerText !== newVal) {
                        counterRef.current.innerText = newVal;
                     }
                 }
             }
         })
         
         // 2. Logo & Counter Slide Up (Exit with Masking)
         .to([logoRef.current, counterRef.current], {
            yPercent: -100, // Move 100% up relative to self/parent mask
            duration: 1.2,
            ease: "power3.in",
            stagger: 0
         })

         // 3. Overlay Slides Up (Reveal) - Gap added
         .to(overlayRef.current, {
             yPercent: -100,
             duration: 2.2,
             ease: "power3.inOut"
         }, "+=0.1"); // Slight gap
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-auto">
        {/* Main Black Overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-[#050A19] w-full h-full flex flex-col justify-end items-end p-8 md:p-16">
            
            {/* Logo Bottom Left (Masked Wrapper) */}
            <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 w-16 h-16 md:w-24 md:h-24 overflow-hidden">
                <div ref={logoRef} className="w-full h-full relative opacity-100 flex items-center justify-center">
                    <div className="absolute w-full h-full border border-white/20 rounded-full"></div>
                    <div className="absolute w-[75%] h-[75%] border border-white/40 rounded-full"></div>
                    <div className="absolute w-[50%] h-[50%] border border-white/60 rounded-full"></div>
                    <div className="absolute w-[25%] h-[25%] border border-white/80 rounded-full"></div>
                    <div className="absolute w-[8%] h-[8%] bg-white rounded-full"></div> {/* Center Dot */}
                </div>
            </div>

            {/* Counter Number (Masked Wrapper) */}
            <div className="overflow-hidden">
                <h1 ref={counterRef} className="text-white font-luxury text-[15vw] leading-none tracking-tighter mix-blend-difference">
                    0
                </h1>
            </div>
            
        </div>
    </div>
  );
};
