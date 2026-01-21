
import { Link } from "@tanstack/react-router";

interface FeaturesCarouselProps {
  carouselRef: React.RefObject<HTMLDivElement>;
  carouselTrackRef: React.RefObject<HTMLDivElement>;
}

export function FeaturesCarousel({ carouselRef, carouselTrackRef }: FeaturesCarouselProps) {
  return (
      <div ref={carouselRef} className="absolute inset-0 z-[70] translate-y-[100px] opacity-0 pointer-events-auto flex flex-col">
         
         {/* Carousel Header (Enhanced Title, No Button) */}
         <div className="absolute top-12 left-0 w-full px-8 md:px-16 z-0 pointer-events-none">
             <h1 className="text-white text-6xl md:text-9xl font-serif tracking-tighter opacity-20 leading-none">
                 CARACTERÍSTICAS
             </h1>
         </div>

         {/* Carousel Track */}
         <div ref={carouselTrackRef} className="flex gap-16 md:gap-32 pl-[20vw] items-center h-full relative z-10">
            {[
                { title: "Mundo Inmersivo", img: "/images/1.webp", desc: "Adéntrate en un entorno 3D ilimitado y de alta fidelidad creado para la inmersión." },
                { title: "Interacción 3D", img: "/images/2.webp", desc: "Experimenta los productos en su forma real con un visor 3D totalmente interactivo." },
                { title: "Pagos Seguros", img: "/images/3.webp", desc: "Procesamiento de transacciones fluido y seguro a través de nuestra pasarela de pago encriptada." },
                { title: "Creador de Avatares", img: "/images/5.webp", desc: "Crea tu identidad digital única con nuestro profundo sistema de personalización de personajes.", wide: true },
                { title: "Transmisión de Música", img: "/images/7.webp", desc: "Sumérgete en una experiencia auditiva compartida con transmisión de música sincronizada." },
                { title: "Conexión en Vivo", img: "/images/8.webp", desc: "Conéctate instantáneamente con una comunidad global a través de comunicación WebSocket en tiempo real." }
            ].map((item, i) => (
                <div key={i} className={`relative flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow-2xl group transition-all duration-500 ${item.wide ? 'w-[70vw]' : 'w-[50vw] md:w-[60vw]'} h-[75vh]`}>
                      {/* Full Background Image */}
                      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                 <span className="w-8 h-px bg-amber-500"></span>
                                 <span className="text-amber-500 text-xs tracking-[0.2em] uppercase">Sistema 0{i+1}</span>
                            </div>
                            <h3 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-none">{item.title}</h3>
                            <p className="text-gray-300 max-w-md font-light text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
                      </div>
                </div>
            ))}

            {/* Final CTA Card */}
            <div className="relative flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow-2xl group transition-all duration-500 w-[50vw] md:w-[60vw] h-[75vh] flex items-center justify-center border border-white/10">
                  <div className="absolute inset-0 bg-[url('/images/7.webp')] bg-cover bg-center grayscale opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  <div className="relative z-10 text-center p-8">
                      <h3 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
                          Explorar <br/> <span className="italic font-light text-white/70">Colección</span>
                      </h3>
                      <Link to="/store" className="inline-block px-12 py-5 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors transform hover:scale-105 duration-300">
                            Entrar a la Tienda
                      </Link>
                  </div>
            </div>
        </div>
      </div>
  );
}
