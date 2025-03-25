import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NotFoundPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      {/* Enhanced background with subtle pattern and animated gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/5 to-transparent opacity-70"></div>
      <div className="absolute top-[15%] right-[5%] w-32 h-32 border border-gray-700/30 rounded-full"></div>
      <div className="absolute bottom-[15%] left-[5%] w-40 h-40 border border-gray-700/20 rounded-full"></div>
      <div className="absolute top-[35%] left-[15%] w-3 h-3 bg-gray-400/20 rounded-full"></div>
      <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-gray-400/30 rounded-full"></div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gray-800/0 via-gray-400/30 to-gray-800/0"></div>
      <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>

      <div className="container max-w-5xl px-4 md:px-8 py-20 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-[0.2em]">
            404
          </h1>
          <div className="w-20 h-px bg-gray-500/50 mx-auto mb-8"></div>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-6">
            Página no encontrada
          </h2>
          <p className="text-base md:text-lg text-gray-400 font-light tracking-wider max-w-2xl mx-auto leading-relaxed px-4 mb-12">
            La página que estás buscando no existe o ha sido movida a otra ubicación.
          </p>

          <Link
            to="/"
            className="px-8 sm:px-10 py-4 inline-block bg-white text-gray-900 hover:bg-transparent hover:text-white rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            <span className="relative z-10">Volver al inicio</span>
            <div className="absolute inset-0 bg-white transform translate-y-0 group-hover:translate-y-full transition-transform duration-300"></div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16"
        >
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 border border-gray-400/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border border-gray-400/30 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
            <div className="absolute inset-4 border border-gray-400/40 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
            <div className="absolute inset-6 border border-white/50 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
