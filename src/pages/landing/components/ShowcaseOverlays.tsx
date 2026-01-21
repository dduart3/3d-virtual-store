
import React from 'react';


// Experiment Text (Pinned Sequence, White on Tunnel)
export const ExperimentOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="overflow-hidden mb-8">
         <h3 className="text-gray-300 text-sm font-medium tracking-[0.4em] uppercase reveal-text translate-y-full drop-shadow-md">
             Siguiente Generación
         </h3>
      </div>
      
      <div className="overflow-hidden">
         <h2 className="text-5xl md:text-8xl font-serif leading-none tracking-tight text-center reveal-text translate-y-full drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
             Experimento
         </h2>
      </div>
      <div className="overflow-hidden">
         <h2 className="text-5xl md:text-8xl font-serif leading-none tracking-tight text-center">
             <span className="block italic font-light text-gray-200 reveal-text translate-y-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Compras Inmersivas</span>
         </h2>
      </div>
  </div>
);

// Features Text (Pinned Sequence, White on Tunnel)
export const FeaturesOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center opacity-0 pointer-events-none text-white">
      <div className="feature-title-wrapper overflow-hidden mb-8 transform-gpu origin-center">
         <h3 className="feature-title text-amber-400 text-sm font-medium tracking-[0.4em] uppercase reveal-text translate-y-full drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
               Características Clave
         </h3>
      </div>
      
      <div className="feature-body flex flex-col items-center">
          <div className="overflow-hidden">
             <h2 className="text-4xl md:text-7xl font-serif mb-2 text-center text-white leading-tight reveal-text translate-y-full drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                   Rendimiento
             </h2>
          </div>
          <div className="overflow-hidden mb-8">
             <h2 className="text-4xl md:text-7xl font-serif text-center text-white leading-tight">
                 <span className="block italic font-light text-gray-200 reveal-text translate-y-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Inigualable</span>
             </h2>
          </div>

          <div className="flex gap-8 md:gap-16 mt-4 text-gray-100 font-light tracking-widest text-xs md:text-sm uppercase overflow-hidden drop-shadow-md">
              <div className="flex gap-8 md:gap-16 reveal-text translate-y-full">
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
  <div ref={domRef} className="absolute inset-0 z-20 container max-w-6xl mx-auto px-6 md:px-12 flex items-center pointer-events-none">
     <div className="max-w-xl pointer-events-auto">
        <div className="w-12 h-px bg-amber-500/80 mb-6"></div>
        <h3 className="font-luxury text-amber-500/90 text-sm font-medium tracking-[0.3em] uppercase mb-4 pl-1">
           Armonía Virtual
        </h3>
        <h2 className="font-luxury text-5xl md:text-7xl font-medium text-white mb-6 leading-tight">
           Inmersión <br />
           <span className="italic font-light text-white/70">Digital</span>
        </h2>
        <p className="font-body text-gray-300 text-lg font-light leading-relaxed max-w-sm mb-10 border-l border-white/10 pl-6 backdrop-blur-sm">
           Entra en una nueva era del retail donde el gaming se encuentra con el lujo. 
           Interactúa, explora y colecciona artículos exclusivos en un mundo 3D totalmente inmersivo construido para el nativo digital.
        </p>
        <button className="font-luxury group flex items-center gap-3 text-white text-sm tracking-[0.2em] uppercase border-b border-transparent hover:border-white pb-1 transition-all duration-300">
           <span>Iniciar Experiencia</span>
           <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" />
           </svg>
        </button>

        {/* Watch Specs Card */}
        <div className="mt-12 flex items-center gap-6 p-4 border border-white/10 bg-black/20 backdrop-blur-sm rounded w-full max-w-sm">
            {/* Product Preview Circle */}
            <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/50 shrink-0 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                 <span className="text-amber-500 font-luxury text-xl">G.01</span>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-amber-500/80 text-[9px] tracking-[0.2em] uppercase mb-1 font-body">Edición</h4>
                    <p className="font-luxury text-white text-base tracking-wide">Genesis.01</p>
                </div>
                <div>
                     <h4 className="text-amber-500/80 text-[9px] tracking-[0.2em] uppercase mb-1 font-body">Material</h4>
                     <p className="font-luxury text-white text-base tracking-wide">Oro Digital</p>
                </div>
            </div>
        </div>
     </div>
  </div>
);

// Luxury Text Content - Top Center (Final State)
export const ProductTopOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-0 z-20 flex flex-col items-center pt-24 opacity-0 pointer-events-none">
      <h2 className="font-luxury text-4xl md:text-6xl font-medium text-white mb-2 text-center">
           MÁS ALLÁ DE <br/> <span className="italic font-light text-white/70">LA REALIDAD</span>
      </h2>
  </div>
);

// Sunglasses Text Content - Bottom Center (Final State)
export const ProductBottomOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-x-0 bottom-24 z-20 flex flex-col items-center opacity-0 pointer-events-none text-center">
      <h3 className="font-luxury text-amber-500/90 text-sm font-medium tracking-[0.3em] uppercase mb-4">
           Identidad Virtual
      </h3>
      <h2 className="font-luxury text-4xl md:text-6xl font-medium text-white mb-2">
           ESTÉTICA <br/> <span className="italic font-light text-white/70">DEL AVATAR</span>
      </h2>
      <p className="font-body text-gray-300 text-sm font-light tracking-wider max-w-sm mt-4 px-4">
           Cura tu persona digital con accesorios de alta fidelidad. Tu estilo, tus reglas, renderizados en impresionante detalle 4K directamente en tu navegador.
      </p>

      {/* Sunglasses Features Pill with Avatar */}
      <div className="mt-8 flex items-center gap-6 bg-black/40 backdrop-blur-md pl-4 pr-8 py-3 rounded-full border border-white/10 shadow-2xl">
         {/* Avatar Circle */}
         <div className="relative w-12 h-12 rounded-full border border-amber-500/50 overflow-hidden shrink-0 group hover:scale-110 transition-transform duration-300">
             <img 
                 src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
                 alt="Avatar Preview" 
                 className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay"></div>
         </div>

         <div className="h-8 w-px bg-white/10"></div>

         <div className="flex gap-8">
             <div className="flex flex-col items-center">
                 <span className="text-gray-400 text-[9px] tracking-[0.2em] uppercase font-body">Fidelidad</span>
                 <span className="text-white font-medium font-luxury tracking-wider text-sm">Fotorealista</span>
             </div>
             <div className="flex flex-col items-center">
                 <span className="text-gray-400 text-[9px] tracking-[0.2em] uppercase font-body">Personalización</span>
                 <span className="text-white font-medium font-luxury tracking-wider text-sm">Infinita</span>
             </div>
         </div>
      </div>
  </div>
);

// Luxury Text Content - Right Side (Final State)
export const ProductRightOverlay = ({ domRef }: { domRef: React.RefObject<HTMLDivElement> }) => (
  <div ref={domRef} className="absolute inset-y-0 right-0 z-20 w-1/2 flex flex-col justify-center items-end pr-12 md:pr-24 opacity-0 pointer-events-none translate-x-10 text-right">
      <div className="w-12 h-px bg-amber-500/80 mb-6 mr-1"></div>
      <h3 className="font-luxury text-amber-500/90 text-sm font-medium tracking-[0.3em] uppercase mb-4 pr-1">
           Moda Interactiva
      </h3>
      <h2 className="font-luxury text-5xl md:text-7xl font-medium text-white mb-6 leading-tight">
           Costura <br />
           <span className="italic font-light text-white/70">Digital</span>
      </h2>
      <p className="font-body text-gray-300 text-lg font-light leading-relaxed max-w-sm mb-10 border-r border-white/10 pr-6 backdrop-blur-sm">
           Rompe los límites de la tela física. Experimenta la simulación de tela en tiempo real que da vida a cada prenda. Sin fricción, solo puro estilo.
      </p>

      {/* Dress Physics HUD */}
      <div className="flex flex-col items-end gap-2">
          <div className="bg-white/5 backdrop-blur-md p-5 border-r-2 border-amber-500 w-72 shadow-lg flex gap-4">
              {/* Simulation Visual */}
              <div className="w-12 h-12 rounded bg-black/50 border border-white/10 relative overflow-hidden flex-shrink-0">
                 <div className="absolute inset-0 opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                 <div className="absolute inset-0 border border-amber-500/30 rounded grid grid-cols-2 grid-rows-2">
                     <div className="border-[0.5px] border-amber-500/20"></div>
                     <div className="border-[0.5px] border-amber-500/20"></div>
                     <div className="border-[0.5px] border-amber-500/20"></div>
                     <div className="border-[0.5px] border-amber-500/20"></div>
                 </div>
              </div>
              
              <div className="flex-1">
                 <div className="flex justify-between mb-2 items-end">
                     <span className="text-gray-300 text-[10px] uppercase tracking-[0.2em] font-body">Físicas Sim</span>
                     <span className="text-amber-500 text-[9px] font-bold animate-pulse">ACTIVO</span>
                 </div>
                 <div className="w-full bg-gray-800/50 h-1 rounded-full overflow-hidden mb-2">
                       <div className="w-[98%] h-full bg-gradient-to-r from-amber-600 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-gray-500 text-[9px] uppercase tracking-wider">Fluidez</span>
                     <span className="text-white text-[9px] font-mono">Tiempo Real</span>
                 </div>
              </div>
          </div>
          <div className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-mono mr-1">Simulación de Tela v2.4</div>
      </div>
  </div>
);
