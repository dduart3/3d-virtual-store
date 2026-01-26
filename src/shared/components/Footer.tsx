import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%", // Start when top of footer hits 90% viewport height (almost immediately)
          toggleActions: "play none none reset" // Play on enter, reset on leave back (so it plays again)
        }
      });

      tl.fromTo(headlineRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(columnsRef.current?.children || [], 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 
        "-=0.8"
      )
      .fromTo(logoRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)" },
        "-=0.6"
      )
      .fromTo(giantTextRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 2, ease: "power3.out" },
        "-=1.2"
      )
      .fromTo(creditRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=1.5"
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full min-h-screen flex flex-col pt-32 bg-[#050505] text-white overflow-hidden relative border-t border-white/5">
      
      {/* Top Section */}
      <div className="container mx-auto max-w-[90vw] px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-20 relative z-10">
        
        {/* Brand Headline (Left) */}
        <div ref={headlineRef} className="w-full md:w-1/3">
           <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-[10px] 2xl:text-xs tracking-[0.2em] uppercase mb-8 text-gray-400">
               Uribe's Boutique
           </div>
           <h2 className="text-xl md:text-3xl 2xl:text-5xl font-serif font-light leading-tight text-white/90">
              Moda digital que <span className="italic font-luxury text-gray-400">florece</span> con estilo e innovación.
           </h2>
        </div>

        {/* Links Columns (Right) */}
        <div ref={columnsRef} className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24 2xl:gap-32 w-full md:w-auto">
           {/* Explore */}
           <div className="flex flex-col gap-6 2xl:gap-8">
              <h4 className="text-[10px] 2xl:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Explorar</h4>
              <ul className="flex flex-col gap-3 2xl:gap-4">
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Nuestra Historia</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Galería</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Blog</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Eventos</Link></li>
              </ul>
           </div>

           {/* Support */}
           <div className="flex flex-col gap-6 2xl:gap-8">
              <h4 className="text-[10px] 2xl:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Soporte</h4>
              <ul className="flex flex-col gap-3 2xl:gap-4">
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Contacto</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">FAQs</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Envíos</Link></li>
                <li><Link to="/store" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Reembolsos</Link></li>
              </ul>
           </div>

           {/* Quick Links */}
           <div className="flex flex-col gap-6 2xl:gap-8">
              <h4 className="text-[10px] 2xl:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Enlaces Rápidos</h4>
              <ul className="flex flex-col gap-3 2xl:gap-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Medium</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm 2xl:text-base font-light">Pinterest</a></li>
              </ul>
           </div>
        </div>
      </div>

      {/* Bottom Section - Giant Text & Logo */}
      <div className="flex-1 flex flex-col justify-end items-center relative w-full overflow-hidden mt-12 2xl:mt-24 pb-0">
           
           {/* Design Credit */}
           <div ref={creditRef} className="w-full text-center z-20 mb-12">
               <p className="text-[10px] 2xl:text-xs text-gray-500 tracking-[0.3em] uppercase font-medium">
                   Diseñado por Onyx. Todos los derechos reservados.
               </p>
           </div>
           
           <div className="relative flex items-end justify-center w-full translate-y-[15%] md:translate-y-[12%]">
               {/* Logo to the left of text */}
               <div ref={logoRef} className="hidden md:flex flex-col justify-center items-center mb-[4vw] mr-[2vw]">
                    <div className="relative w-16 h-16 md:w-32 md:h-32 2xl:w-48 2xl:h-48">
                        <div className="absolute inset-0 border-[3px] border-gray-400/30 rounded-full"></div>
                        <div className="absolute inset-4 border-[3px] border-gray-400/40 rounded-full"></div>
                        <div className="absolute inset-8 border-[3px] border-gray-400/50 rounded-full"></div>
                        <div className="absolute inset-12 border-[3px] border-white/80 rounded-full"></div>
                    </div>
               </div>

               <h1 ref={giantTextRef} className="font-luxury text-[19vw] md:text-[26vw] 2xl:text-[28vw] leading-[0.8] text-white tracking-tight select-none pointer-events-none">
                   Uribe's
               </h1>
           </div>
      </div>
    </footer>
  );
}
