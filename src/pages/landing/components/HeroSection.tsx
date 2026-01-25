
import { Link } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useAuth } from "../../../modules/auth/hooks/useAuth";

export function HeroSection({ isLoaded = true, heroRef }: { isLoaded?: boolean; heroRef: React.RefObject<HTMLDivElement> }) {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role_id === 1;

  // Refs
  // Internal refs for entrance animation (kept separate or we can merge if needed)
  const heroIconRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);



  // Animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (isLoaded && heroIconRef.current && heroTitleRef.current && heroDescRef.current && heroButtonsRef.current) {
      // Reset initial state explicitely to avoid conflicts
      gsap.set(heroIconRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(heroTitleRef.current, { opacity: 0, y: 30 });
      gsap.set(heroDescRef.current, { opacity: 0, y: 20 });
      gsap.set(heroButtonsRef.current, { opacity: 0, y: 20 });

      tl.to(heroIconRef.current, 
        { opacity: 1, scale: 1, duration: 1 }
      )
      .to(heroTitleRef.current,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .to(heroDescRef.current,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .to(heroButtonsRef.current,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    }
    return () => {
      tl.kill();
    };
  }, [isLoaded]);

  return (
    <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden pt-32">
        {/* Background Elements - Removed, now in LandingPage */}
        {/* Main Content */}
        <div className="container max-w-7xl 2xl:max-w-[90vw] px-4 md:px-8 relative z-10 flex flex-col items-center justify-center min-h-[60vh] mix-blend-difference">
            
            {/* Hero Header */}
            <div className="text-center mb-10 flex flex-col items-center">
              {/* Hero Icon (Phantom Destination) - Initially opacity-0 */}
              <div ref={heroIconRef} className="hero-icon mb-5 mx-auto opacity-0">
                <div className="relative w-16 h-16 2xl:w-24 2xl:h-24 mx-auto">
                    <div className="absolute inset-0 border-2 border-gray-500 rounded-full"></div>
                    <div className="absolute inset-2 border-2 border-gray-400 rounded-full"></div>
                    <div className="absolute inset-4 border-2 border-gray-300 rounded-full"></div>
                    <div className="absolute inset-6 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Title */}
              <h1 ref={heroTitleRef} className="hero-title font-luxury text-4xl md:text-6xl 2xl:text-8xl font-medium mb-8 tracking-[0.1em] uppercase text-white text-center opacity-0 drop-shadow-2xl">
                <span className="block text-2xl md:text-3xl 2xl:text-4xl tracking-[0.2em] text-gray-200 font-medium mb-4 drop-shadow-lg font-luxury">
                  Uribe's
                </span>
                <span className="relative inline-block font-luxury">
                  Boutique
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 2xl:w-24 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
                </span>
              </h1>
              
              <div className="hero-separator w-20 2xl:w-32 h-px bg-gray-500/50 mx-auto mb-8"></div>
              
              <p ref={heroDescRef} className="hero-desc font-body text-base md:text-xl 2xl:text-2xl text-gray-100 font-light tracking-wide max-w-2xl 2xl:max-w-4xl mx-auto leading-relaxed px-4 text-center opacity-0 drop-shadow-lg">
                Descubre nuestra exclusiva experiencia de compra virtual con
                colecciones seleccionadas de prendas de moda premium.
              </p>
            </div>

            {/* Action Buttons */}
            <div ref={heroButtonsRef} className="hero-buttons flex flex-col items-center w-full justify-center opacity-0">
              {/* Welcome message */}
              {user && profile?.first_name && (
                <p className="font-body text-xl md:text-2xl 2xl:text-3xl font-light text-white/90 mb-8 mt-2 tracking-wide text-center">
                  Bienvenido de nuevo, <span className="font-medium">{profile.first_name}</span>
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full">
                {user ? (
                  <>
                    <Link
                      to="/store"
                      className="font-luxury px-8 sm:px-10 2xl:px-14 py-4 2xl:py-6 w-full md:w-auto text-center bg-white text-gray-900 hover:bg-transparent hover:text-white border border-transparent hover:border-white rounded-none tracking-[0.15em] uppercase text-sm 2xl:text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Entrar a la Tienda</span>
                    </Link>
                    <Link
                      from="/"
                      to="/profile"
                      className="font-luxury px-8 sm:px-10 2xl:px-14 py-4 2xl:py-6 w-full md:w-auto text-center bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.15em] uppercase text-sm 2xl:text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Mi Perfil</span>
                    </Link>
                    {isAdmin && (
                      <a
                        href={`${
                          import.meta.env.VITE_ADMIN_DASHBOARD_URL
                        }/otp?email=${profile.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-luxury px-8 sm:px-10 2xl:px-14 py-4 2xl:py-6 w-full md:w-auto text-center bg-transparent text-amber-300 hover:text-amber-100 rounded-none tracking-[0.15em] uppercase text-sm 2xl:text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                      >
                         <div className="absolute inset-0 border border-amber-400/60"></div>
                         <span className="relative z-10">Panel de Administración</span>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="font-luxury px-8 sm:px-10 2xl:px-14 py-4 2xl:py-6 w-full md:w-auto text-center bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.15em] uppercase text-sm 2xl:text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Crear Cuenta</span>
                    </Link>
                    <Link
                      to="/login"
                      className="font-luxury px-8 sm:px-10 2xl:px-14 py-4 2xl:py-6 w-full md:w-auto text-center bg-white text-gray-900 hover:bg-transparent hover:text-white border border-transparent hover:border-white rounded-none tracking-[0.15em] uppercase text-sm 2xl:text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Iniciar Sesión</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
        
        </div>
      </section>
  );
}
