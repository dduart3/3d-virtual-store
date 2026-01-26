
import React from 'react';


// Experiment Text (Pinned Sequence, White on Tunnel)
export const ExperimentOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="overflow-hidden mb-8 2xl:mb-12">
         <h3 className="text-gray-300 text-sm md:text-base lg:text-xs xl:text-lg 2xl:text-xl font-medium tracking-[0.4em] uppercase reveal-text translate-y-full drop-shadow-md">
             Siguiente Generación
         </h3>
      </div>
      
      <div className="overflow-hidden">
         <h2 className="text-4xl md:text-6xl lg:text-4xl xl:text-7xl 2xl:text-[9rem] font-serif leading-none tracking-tight text-center reveal-text translate-y-full drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
             Experimenta
         </h2>
      </div>
      <div className="overflow-hidden">
         <h2 className="text-4xl md:text-6xl lg:text-4xl xl:text-7xl 2xl:text-[9rem] font-serif leading-none tracking-tight text-center">
             <span className="block italic font-light text-gray-200 reveal-text translate-y-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Compras Inmersivas</span>
         </h2>
      </div>
  </div>
);

// Features Text (Pinned Sequence, White on Tunnel)
export const FeaturesOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="feature-title-wrapper overflow-hidden mb-8 2xl:mb-12 transform-gpu origin-center">
         <h3 className="feature-title text-amber-400 text-sm md:text-base lg:text-xs xl:text-lg 2xl:text-xl font-medium tracking-[0.4em] uppercase reveal-text translate-y-full drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
               Características Clave
         </h3>
      </div>
      
      <div className="feature-body flex flex-col items-center">
          <div className="overflow-hidden">
             <h2 className="text-3xl md:text-5xl lg:text-3xl xl:text-6xl 2xl:text-8xl font-serif mb-2 text-center text-white leading-tight reveal-text translate-y-full drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                   Rendimiento
             </h2>
          </div>
          <div className="overflow-hidden mb-8 2xl:mb-12">
             <h2 className="text-3xl md:text-5xl lg:text-3xl xl:text-6xl 2xl:text-8xl font-serif text-center text-white leading-tight">
                 <span className="block italic font-light text-gray-200 reveal-text translate-y-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Inigualable</span>
             </h2>
          </div>

          <div className="flex gap-8 md:gap-16 2xl:gap-24 mt-4 2xl:mt-8 text-gray-100 font-light tracking-widest text-xs md:text-sm lg:text-xxs xl:text-base 2xl:text-lg uppercase overflow-hidden drop-shadow-md">
              <div className="flex gap-8 md:gap-16 2xl:gap-24 reveal-text translate-y-full">
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                     <span>3D en Tiempo Real</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                     <span>Carga Instantánea</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                     <span>UI Premium</span>
                  </div>
              </div>
          </div>
      </div>
  </div>
);

// Luxury Text Content - Left Side (Initial)
export const ProductLeftOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-20 container max-w-7xl 2xl:max-w-[90vw] mx-auto px-6 md:px-12 flex items-center justify-center md:justify-start pointer-events-none">
     <div className="w-full max-w-lg md:max-w-xl lg:max-w-md xl:max-w-2xl 2xl:max-w-3xl pointer-events-auto mt-20 md:mt-0">
        <div className="w-12 2xl:w-20 h-px bg-amber-500/80 mb-6 2xl:mb-8"></div>
        <h3 className="font-luxury text-amber-500/90 text-xs md:text-sm lg:text-xxs xl:text-base 2xl:text-xl font-medium tracking-[0.3em] uppercase mb-4 pl-1">
           Armonía Virtual
        </h3>
        <h2 className="font-luxury text-4xl md:text-6xl lg:text-4xl xl:text-7xl 2xl:text-9xl font-medium text-white mb-6 leading-tight">
           Inmersión <br />
           <span className="italic font-light text-white/70">Digital</span>
        </h2>
        <p className="font-body text-gray-300 text-lg lg:text-sm xl:text-xl 2xl:text-2xl font-light leading-relaxed max-w-sm lg:max-w-sm xl:max-w-xl 2xl:max-w-2xl mb-10 2xl:mb-14 border-l border-white/10 pl-6 backdrop-blur-sm">
           Entra en una nueva era del retail donde el gaming se encuentra con el lujo. 
           Interactúa, explora y colecciona artículos exclusivos en un mundo 3D totalmente inmersivo construido para el nativo digital.
        </p>


     </div>
  </div>
);

// Luxury Text Content - Top Center (Final State)
export const ProductTopOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-20 flex flex-col items-center pt-24 md:pt-32 2xl:pt-48 opacity-0 pointer-events-none">
      <h2 className="font-luxury text-3xl md:text-5xl lg:text-3xl xl:text-6xl 2xl:text-8xl font-medium text-white mb-2 text-center px-4">
           MÁS ALLÁ DE <br/> <span className="italic font-light text-white/70">LA REALIDAD</span>
      </h2>
  </div>
);

// Sunglasses Text Content - Bottom Center (Final State)
export const ProductBottomOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-x-0 bottom-16 md:bottom-24 2xl:bottom-32 z-20 flex flex-col items-center opacity-0 pointer-events-none text-center">
      <h3 className="font-luxury text-amber-500/90 text-xs md:text-sm lg:text-xxs xl:text-base 2xl:text-xl font-medium tracking-[0.3em] uppercase mb-4">
           Identidad Virtual
      </h3>
      <h2 className="font-luxury text-3xl md:text-5xl lg:text-3xl xl:text-6xl 2xl:text-8xl font-medium text-white mb-2">
           ESTÉTICA <br/> <span className="italic font-light text-white/70">DEL AVATAR</span>
      </h2>
      <p className="font-body text-gray-300 text-xs md:text-sm lg:text-xxs xl:text-base 2xl:text-xl font-light tracking-wider max-w-sm lg:max-w-sm xl:max-w-lg 2xl:max-w-2xl mt-4 px-4 bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded p-2">
           Cura tu persona digital con accesorios de alta fidelidad. Tu estilo, tus reglas, renderizados en impresionante detalle 4K directamente en tu navegador.
      </p>


  </div>
);

// Luxury Text Content - Right Side (Final State)
export const ProductRightOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-y-0 right-0 z-20 w-full md:w-3/4 lg:w-1/2 flex flex-col justify-center items-end pr-6 md:pr-12 lg:pr-24 2xl:pr-32 opacity-0 pointer-events-none translate-x-0 md:translate-x-10 text-right mt-20 md:mt-0">
      <div className="w-12 2xl:w-20 h-px bg-amber-500/80 mb-6 2xl:mb-8 mr-1"></div>
      <h3 className="font-luxury text-amber-500/90 text-xs md:text-sm lg:text-xxs xl:text-base 2xl:text-xl font-medium tracking-[0.3em] uppercase mb-4 pr-1">
           Moda Interactiva
      </h3>
      <h2 className="font-luxury text-4xl md:text-6xl lg:text-4xl xl:text-7xl 2xl:text-9xl font-medium text-white mb-6 leading-tight">
           Costura <br />
           <span className="italic font-light text-white/70">Digital</span>
      </h2>
      <p className="font-body text-gray-300 text-base md:text-lg lg:text-sm xl:text-xl 2xl:text-2xl font-light leading-relaxed max-w-sm lg:max-w-sm xl:max-w-lg 2xl:max-w-xl mb-10 2xl:mb-14 border-r border-white/10 pr-6 backdrop-blur-sm">
           Rompe los límites de la tela física. Experimenta la simulación de tela en tiempo real que da vida a cada prenda. Sin fricción, solo puro estilo.
      </p>


  </div>
);
