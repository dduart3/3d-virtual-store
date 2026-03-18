
import React from 'react';


// Experiment Text (Pinned Sequence, White on Tunnel)
export const ExperimentOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="overflow-hidden mb-8 2xl:mb-12">
         <h3 className="font-accent text-gray-400/80 text-[10px] md:text-xs xl:text-sm 2xl:text-base tracking-[0.12em] reveal-text translate-y-full">
             Deja el scroll atrás
         </h3>
      </div>
      
      <div className="overflow-hidden">
         <h2 className="text-3xl md:text-5xl xl:text-6xl 2xl:text-8xl font-display leading-tight-display tracking-tight text-center reveal-text translate-y-full">
             Camina
         </h2>
      </div>
      <div className="overflow-hidden">
         <h2 className="text-3xl md:text-5xl xl:text-6xl 2xl:text-8xl font-display leading-tight-display tracking-tight text-center">
             <span className="block italic font-light text-gray-200/90 reveal-text translate-y-full">por la tienda</span>
         </h2>
      </div>
  </div>
);

// Features Text (Pinned Sequence, White on Tunnel)
export const FeaturesOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="feature-title-wrapper overflow-hidden mb-8 2xl:mb-12 transform-gpu origin-center">
         <h3 className="feature-title font-accent text-white/70 text-[10px] md:text-xs xl:text-sm 2xl:text-base tracking-[0.12em] reveal-text translate-y-full">
               Lo que nos impulsa
         </h3>
      </div>
      
      <div className="feature-body flex flex-col items-center">
          <div className="overflow-hidden">
             <h2 className="text-2xl md:text-4xl xl:text-5xl 2xl:text-7xl font-display mb-2 text-center text-white leading-tight-display reveal-text translate-y-full">
                   Fluido
             </h2>
          </div>
          <div className="overflow-hidden mb-8 2xl:mb-12">
             <h2 className="text-2xl md:text-4xl xl:text-5xl 2xl:text-7xl font-display text-center text-white leading-tight-display">
                 <span className="block italic font-light text-gray-200/90 reveal-text translate-y-full">y rápido</span>
             </h2>
          </div>

          <div className="flex gap-6 md:gap-12 2xl:gap-16 mt-4 2xl:mt-8 text-gray-100/90 font-accent font-light text-[10px] md:text-xs xl:text-sm overflow-hidden">
              <div className="flex gap-8 md:gap-16 2xl:gap-24 reveal-text translate-y-full">
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-white/70 rounded-full"></span>
                     <span>3D fluido</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-white/70 rounded-full"></span>
                     <span>Carga ligera</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-white/70 rounded-full"></span>
                     <span>Sin lag</span>
                  </div>
              </div>
          </div>
      </div>
  </div>
);

// Luxury Text Content - Left Side (Watch Section)
export const ProductLeftOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-20 container max-w-7xl 2xl:max-w-[90vw] mx-auto px-6 md:px-12 flex items-center justify-center md:justify-start pointer-events-none">
     <div className="w-full max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-2xl pointer-events-auto mt-20 md:mt-0 pl-8 md:pl-12">
        <h2 className="font-display text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-white mb-6 leading-tight-display tracking-[0.08em] uppercase">
           <span className="block font-luxury font-normal">Inmersión</span>
           <span className="block font-luxury font-normal italic">Digital</span>
        </h2>
        <p className="font-body text-gray-300 text-sm xl:text-base 2xl:text-lg font-light leading-relaxed-body max-w-sm xl:max-w-md mb-10 2xl:mb-14">
           Entra en una nueva era del retail donde el gaming se encuentra con el lujo. Interactúa, explora y colecciona artículos exclusivos en un mundo 3D totalmente inmersivo construido para el nativo digital.
        </p>
     </div>
  </div>
);

// Luxury Text Content - Top Center (Final State)
export const ProductTopOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-20 flex flex-col items-center pt-24 md:pt-32 2xl:pt-48 opacity-0 pointer-events-none">
      <h2 className="font-display text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-white mb-2 text-center px-6 leading-tight-display">
           MÁS QUE <br/> <span className="italic font-light text-white/70">UNA TIENDA ONLINE</span>
      </h2>
  </div>
);

// Sunglasses Text Content - Bottom Center (Final State)
export const ProductBottomOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-x-0 bottom-16 md:bottom-24 2xl:bottom-32 z-20 flex flex-col items-center opacity-0 pointer-events-none text-center">
      <h2 className="font-display text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-white mb-3 leading-tight-display">
           TU IDENTIDAD <br/> <span className="italic font-light text-white/70">EN EL MUNDO</span>
      </h2>
      <p className="font-body text-gray-300 text-[11px] md:text-xs xl:text-sm 2xl:text-base font-light leading-relaxed-body max-w-sm xl:max-w-md mt-4">
           Crea y personaliza tu avatar. Es tu presencia en la tienda virtual mientras exploras y compras prendas físicas.
      </p>


  </div>
);

// Luxury Text Content - Right Side (Final State)
export const ProductRightOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-y-0 right-0 z-20 w-full md:w-3/4 lg:w-1/2 flex flex-col justify-center items-end pr-6 md:pr-12 lg:pr-24 2xl:pr-32 opacity-0 pointer-events-none translate-x-0 md:translate-x-10 text-right mt-20 md:mt-0">
      <h2 className="font-display text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-white mb-6 leading-tight-display">
           Explora en 360° <br />
           <span className="italic font-light text-white/70">Antes de comprar.</span>
      </h2>
      <p className="font-body text-gray-300 text-sm xl:text-base 2xl:text-lg font-light leading-relaxed-body max-w-sm xl:max-w-md mb-10 2xl:mb-14">
           Cada prenda cobra vida al tocarla. Arrastra, gira y observa antes de comprar.
      </p>


  </div>
);
