import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ErrorPage({ error }: { error?: Error })  {
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
          <div className="mb-8">
            <svg className="w-16 h-16 mx-auto text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] uppercase mb-6">
            Algo salió mal
          </h1>
          
          <div className="w-20 h-px bg-gray-500/50 mx-auto mb-8"></div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 mb-12 max-w-2xl mx-auto">
            <p className="text-base text-red-200 font-light tracking-wider leading-relaxed">
              {error?.message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 sm:px-10 py-4 bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Intentar de nuevo</span>
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <Link
              to="/"
              className="px-8 sm:px-10 py-4 bg-white text-gray-900 hover:bg-transparent hover:text-white rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Volver al inicio</span>
              <div className="absolute inset-0 bg-white transform translate-y-0 group-hover:translate-y-full transition-transform duration-300"></div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-gray-500 text-sm font-light">
            Si el problema persiste, por favor contacta a soporte.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
