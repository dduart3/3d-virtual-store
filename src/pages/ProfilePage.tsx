import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PersonalInfo } from "../modules/profile/components/PersonalInfo";
import { OrderHistory } from "../modules/profile/components/OrderHistory";
import { useAuth } from "../modules/auth/hooks/useAuth";

export function ProfilePage() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'orders'>('personal');
  const { signOut, isSigningOut } = useAuth();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Enhanced background with subtle pattern and animated gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/5 to-transparent opacity-70"></div>
      <div className="absolute top-[15%] right-[5%] w-32 h-32 border border-gray-700/30 rounded-full"></div>
      <div className="absolute bottom-[15%] left-[5%] w-40 h-40 border border-gray-700/20 rounded-full"></div>
      <div className="absolute top-[35%] left-[15%] w-3 h-3 bg-gray-400/20 rounded-full"></div>
      <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-gray-400/30 rounded-full"></div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gray-800/0 via-gray-400/30 to-gray-800/0"></div>
      <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-gray-800/0 via-gray-400/20 to-gray-800/0"></div>

      <div className="container max-w-5xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase">
              Mi Perfil
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent mt-2"></div>
            </h1>
            <div className="flex gap-4">
              <Link
                to="/"
                className="px-6 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300"
              >
                Inicio
              </Link>
              <Link
                to="/store"
                className="px-6 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300"
              >
                Tienda
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-6 py-2 bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSigningOut ? "Saliendo..." : "Cerrar Sesión"}
                </span>
                <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-white/10 mb-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-3 text-sm tracking-[0.1em] uppercase font-light transition-all duration-300 ${
                activeTab === 'personal' 
                  ? 'text-white border-b-2 border-white -mb-px' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 text-sm tracking-[0.1em] uppercase font-light transition-all duration-300 ${
                activeTab === 'orders' 
                  ? 'text-white border-b-2 border-white -mb-px' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Historial de Pedidos
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
        >
          {activeTab === 'personal' ? (
            <PersonalInfoStyled />
          ) : (
            <OrderHistoryStyled />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Styled wrapper for PersonalInfo to apply the landing page aesthetic
function PersonalInfoStyled() {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-none p-8">
      <PersonalInfo />
    </div>
  );
}

// Styled wrapper for OrderHistory to apply the landing page aesthetic
function OrderHistoryStyled() {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-none p-8">
      <OrderHistory />
    </div>
  );
}
