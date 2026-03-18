
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
             <h1 className="font-accent text-white/70 text-xl md:text-3xl 2xl:text-4xl tracking-[0.12em] leading-none">
                 CÓMO FUNCIONA
             </h1>
         </div>

         {/* Carousel Track */}
         <div ref={carouselTrackRef} className="flex gap-4 md:gap-20 pl-4 md:pl-[16vw] items-center h-full relative z-10">
            {[
                { title: "Tienda 3D", img: "/images/1.webp", desc: "Pasea por pasillos y rincones como en una boutique física. Descubre colecciones navegando en primera persona." },
                { title: "Visor 360°", img: "/images/2.webp", desc: "Gira cada prenda, acércate a los detalles. Todo lo que ves es ropa real que se envía a tu domicilio." },
                { title: "Pago seguro", img: "/images/3.webp", desc: "Checkout integrado en la experiencia. Pagas sin salir del mundo virtual y tu pedido llega a casa." },
                { title: "Tu avatar", img: "/images/5.webp", desc: "Diseña tu avatar y recorre la boutique en 3D. Lo que compras es ropa real que se envía a tu domicilio.", wide: true },
                { title: "Jukebox", img: "/images/7.webp", desc: "Música compartida en tiempo real. Todos los visitantes escuchan lo mismo. Ambiente de showroom." },
                { title: "Chat en vivo", img: "/images/8.webp", desc: "Conecta con otros compradores. Pregunta, comparte y compra en un entorno social." }
            ].map((item, i) => (
                <div key={i} className={`relative flex-shrink-0 bg-[#0b0d14] rounded-sm overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.45)] group transition-all duration-500 border border-white/10 ${item.wide ? 'w-[85vw] md:w-[68vw]' : 'w-[85vw] md:w-[56vw]'} h-[65vh] md:h-[75vh]`}>
                      {/* Full Background Image */}
                      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-50 group-hover:opacity-75" />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-90 transition-opacity duration-500"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="font-display text-xl md:text-3xl 2xl:text-4xl text-white mb-2 md:mb-3 leading-tight-display">{item.title}</h3>
                            <p className="text-gray-300/95 max-w-md font-body font-light text-sm md:text-base leading-relaxed-body opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
                      </div>
                </div>
            ))}

            {/* Final CTA Card */}
            <div className="relative flex-shrink-0 bg-[#0b0d14] rounded-sm overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.45)] group transition-all duration-500 w-[85vw] md:w-[56vw] h-[65vh] md:h-[75vh] flex items-center justify-center border border-white/10">
                  <div className="absolute inset-0 bg-[url('/images/7.webp')] bg-cover bg-center grayscale opacity-45 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  <div className="relative z-10 text-center p-10 md:p-12">
                      <h3 className="font-display text-2xl md:text-4xl 2xl:text-5xl text-white mb-8 md:mb-10 leading-tight-display">
                          Tu próxima <br/> <span className="italic font-light text-white/70">compra empieza aquí</span>
                      </h3>
                      <Link to="/store" className="font-accent inline-block px-10 py-4 md:px-14 md:py-5 bg-white text-black text-xs md:text-sm tracking-[0.12em] hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.01]">
                            Explorar la Tienda
                      </Link>
                  </div>
            </div>
        </div>
      </div>
  );
}
