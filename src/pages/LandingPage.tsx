import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../modules/auth/hooks/useAuth"; // Import auth hook

export function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth(); // Get current user from auth hook

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center">
      {/* Enhanced background with subtle pattern and animated gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/5 to-transparent opacity-70"></div>
      <div className="absolute top-[15%] right-[5%] w-32 h-32 border border-gray-700/30 rounded-full"></div>
      <div className="absolute bottom-[15%] left-[5%] w-40 h-40 border border-gray-700/20 rounded-full"></div>
      <div className="absolute top-[35%] left-[15%] w-3 h-3 bg-gray-400/20 rounded-full"></div>
      <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-gray-400/30 rounded-full"></div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gray-800/0 via-gray-400/30 to-gray-800/0"></div>
      <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>

      <div className="container max-w-5xl px-4 md:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          className="text-center mb-20"
        >
          {/* Stylized logo/icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-5 mx-auto"
          >
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border border-gray-400/20 rounded-full"></div>
              <div className="absolute inset-2 border border-gray-400/30 rounded-full"></div>
              <div className="absolute inset-4 border border-gray-400/40 rounded-full"></div>
              <div className="absolute inset-6 border border-white/50 rounded-full"></div>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extralight mb-8 tracking-[0.2em] uppercase">
            <span className="block text-2xl md:text-3xl tracking-[0.3em] text-gray-400 font-light mb-4">
              Uribe's
            </span>
            <span className="relative">
              Boutique
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
            </span>
          </h1>
          <div className="w-20 h-px bg-gray-500/50 mx-auto mb-8"></div>
          <p className="text-base md:text-lg text-gray-400 font-light tracking-wider max-w-2xl mx-auto leading-relaxed px-4">
            Descubre nuestra exclusiva experiencia de compra virtual con
            colecciones seleccionadas de prendas de moda premium.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          {/* HERE IS THE KEY MODIFICATION: Conditional rendering based on auth state */}
          {user ? (
            <>
              <Link
                to="/store"
                className="px-8 sm:px-10 py-4 w-full md:w-auto text-center bg-white text-gray-900 hover:bg-transparent hover:text-white rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Entrar a la Tienda</span>
                <div className="absolute inset-0 bg-white transform translate-y-0 group-hover:translate-y-full transition-transform duration-300"></div>
              </Link>

              <Link
                from="/"
                to="/profile"
                className="px-8 sm:px-10 py-4 w-full md:w-auto text-center bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Mi Perfil</span>
                <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 sm:px-10 py-4 w-full md:w-auto text-center bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Crear Cuenta</span>
                <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>

              <Link
                to="/login"
                className="px-8 sm:px-10 py-4 w-full md:w-auto text-center bg-white text-gray-900 hover:bg-transparent hover:text-white rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Iniciar Sesión</span>
                <div className="absolute inset-0 bg-white transform translate-y-0 group-hover:translate-y-full transition-transform duration-300"></div>
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-0 text-center"
        >
          {/* Enhanced feature boxes with hover effects */}
          <div className="p-6 sm:p-10 border-t border-r border-b border-l md:border-l-0 md:border-t md:border-r md:border-b-0 border-gray-800 group hover:bg-white/[0.02] transition-all duration-500">
            <div className="text-gray-400 mb-6 transform transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:text-white">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-normal mb-3 uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300">
              Experiencia Inmersiva
            </h3>
            <p className="text-gray-500 text-sm font-light group-hover:text-gray-400 transition-colors duration-300">
              Explora nuestra boutique virtual con entornos y productos 3D
              realistas.
            </p>
          </div>

          <div className="p-6 sm:p-10 border-t border-r border-b md:border-b-0 border-gray-800 group hover:bg-white/[0.02] transition-all duration-500">
            <div className="text-gray-400 mb-6 transform transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:text-white">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-sm font-normal mb-3 uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300">
              Colección Seleccionada
            </h3>
            <p className="text-gray-500 text-sm font-light group-hover:text-gray-400 transition-colors duration-300">
              Descubre artículos de moda premium cuidadosamente seleccionados
              por su calidad y estilo.
            </p>
          </div>

          <div className="p-6 sm:p-10 border-t border-r border-b md:border-r-0 border-gray-800 group hover:bg-white/[0.02] transition-all duration-500">
            <div className="text-gray-400 mb-6 transform transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:text-white">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-normal mb-3 uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300">
              Precios Exclusivos
            </h3>
            <p className="text-gray-500 text-sm font-light group-hover:text-gray-400 transition-colors duration-300">
              Disfruta de precios exclusivos para miembros y ofertas especiales
              en nuestros artículos de boutique.
            </p>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-32 border-t border-gray-800/50 pt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Column 1: About */}
            <div>
              <h4 className="text-white text-sm uppercase tracking-[0.15em] mb-6 font-light">
                Uribe's Boutique
              </h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Nuestra boutique virtual ofrece experiencias de compra
                inmersivas con productos premium seleccionados para clientes
                exclusivos. Descubre la moda del futuro hoy.
              </p>
            </div>

            {/* Column 2: Contact */}
            <div>
              <h4 className="text-white text-sm uppercase tracking-[0.15em] mb-6 font-light">
                Contacto
              </h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Av. Principal 123, Maracaibo
                <br />
                Venezuela
                <br />
                contacto@uribesboutique.com
                <br />
                +58 412 123 4567
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800/50 py-8 text-center">
            <p className="text-gray-500 text-sm font-light">
              © {new Date().getFullYear()} Uribe's Boutique. Todos los derechos
              reservados.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
