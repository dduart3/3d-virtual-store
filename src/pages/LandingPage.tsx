import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { supabase } from "../lib/supabase";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Product } from "../modules/experience/store/types/product";
import { getProductThumbnailUrl } from "../modules/experience/store/utils/supabaseStorageUtils";
import { useSectionsWithRandomProducts } from "../shared/hooks/useSectionWithRandomProducts";

export function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const { user, profile } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { data: sectionsWithProducts, loading: _sectionsLoading } = useSectionsWithRandomProducts();
  
  // Check if user is an admin
  const isAdmin = profile?.role_id === 1;

  useEffect(() => {
    setLoaded(true);
    
    // Fetch random featured products
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase.rpc('get_random_products', { limit_count: 4 });
          
        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        const productsWithThumbnails = data.map((product: any)=> {
          return{
            ...product,
            thumbnail_url: getProductThumbnailUrl(product.id)
          }
        })
        
        setFeaturedProducts(productsWithThumbnails || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchFeaturedProducts();
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

      {/* Main Content Container */}
      <div className="container max-w-6xl px-4 md:px-8 py-20 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          className="text-center  mb-10"
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

   {/* Action Buttons */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
  transition={{
    duration: 0.8,
    delay: 0.4,
    ease: [0.165, 0.84, 0.44, 1],
  }}
  className="flex flex-col items-center"
>
  {/* Welcome message - Only shown when user is logged in */}
  {user && profile?.first_name && (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="text-xl md:text-2xl font-light text-white/90 mb-8 mt-2 tracking-wide"
    >
      Bienvenido de nuevo, <span className="font-normal">{profile.first_name}</span>
    </motion.p>
  )}

  {/* Buttons container */}
  <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full">
    {/* Conditional rendering based on auth state */}
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
        {/* Admin Dashboard Button - Only shown to admins */}
        {isAdmin && (
          <a
            href={`${
              import.meta.env.VITE_ADMIN_DASHBOARD_URL
            }/otp?email=${profile.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 sm:px-10 py-4 w-full md:w-auto text-center bg-amber-100/0 text-amber-300 hover:text-gray-900 rounded-none tracking-[0.2em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Elegant darker gold border */}
            <div className="absolute inset-0 border border-amber-400/60"></div>
            {/* Subtle corner accents in darker gold */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-500/70"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-amber-500/70"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-amber-500/70"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-amber-500/70"></div>
            <span className="relative z-10">Panel de Administración</span>
            {/* Hover effect - light gold fill */}
            <div className="absolute inset-0 bg-amber-200/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        )}
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
  </div>
</motion.div>

                {/* Features Section */}
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <h3 className="text-sm font-normal mb-3 uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300">
              Envío Seguro
            </h3>
            <p className="text-gray-500 text-sm font-light group-hover:text-gray-400 transition-colors duration-300">
              Entrega rápida y segura de tus compras con seguimiento en tiempo real.
            </p>
          </div>
        </motion.div>

        {/* Sections Preview */}
        {sectionsWithProducts && sectionsWithProducts.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="mt-32"
    >
      <div className="text-center mb-16">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
          Explora Nuestras Secciones
        </h2>
        <div className="w-16 h-px bg-gray-500/50 mx-auto mb-6"></div>
        <p className="text-gray-400 font-light max-w-2xl mx-auto">
          Descubre nuestras diferentes secciones de moda con productos seleccionados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionsWithProducts.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="group relative overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors duration-300"
          >
            <div className="h-64 bg-gray-800 flex items-center justify-center relative overflow-hidden">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.product_name}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="text-gray-600 group-hover:text-gray-500 transition-colors duration-300">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              
            </div>
            <div className="p-4">
              <h3 className="text-sm font-light tracking-wider mb-1 truncate">{item.section_name}</h3>
              <div className="mt-3">
                <Link
                  to="/store"
                  className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center"
                >
                  <span>Ir a la tienda</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
                Productos Destacados
              </h2>
              <div className="w-16 h-px bg-gray-500/50 mx-auto mb-6"></div>
              <p className="text-gray-400 font-light max-w-2xl mx-auto">
                Descubre nuestras últimas incorporaciones y productos más populares.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group relative overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors duration-300"
                >
                  <div className="h-64 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="text-gray-600 group-hover:text-gray-500 transition-colors duration-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-light tracking-wider mb-1 truncate">{product.name}</h3>
                    <p className="text-gray-400 text-sm">${product.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/store"
                className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <span>Ver Todos los Productos</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="mt-32 pt-16 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] mb-6">Sobre Nosotros</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Uribe's Boutique es una tienda de moda premium que ofrece las últimas tendencias en ropa y accesorios. Nuestra misión es proporcionar a nuestros clientes una experiencia de compra única y personalizada.
              </p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/store" className="text-gray-500 text-sm hover:text-white transition-colors duration-300">
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors duration-300">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors duration-300">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] mb-6">Contacto</h3>
              <p className="text-gray-500 text-sm font-light mb-4">
                ¿Tienes alguna pregunta? Contáctanos en:
                <br />
                <a href="mailto:info@uribesboutique.pages.dev" className="text-white hover:text-gray-300 transition-colors duration-300">
                  info@uribesboutique.pages.dev
                </a>
              </p>
              <div className="flex space-x-4">
                <a target="_blank"
                  rel="noopener noreferrer" href="https://www.instagram.com/uribesboutique" className="text-gray-500 hover:text-white transition-colors duration-300">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a target="_blank"
                  rel="noopener noreferrer" href="https://www.facebook.com/profile.php?id=61573912029854" className="text-gray-500 hover:text-white transition-colors duration-300">
                  <FaFacebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Uribe's Boutique. Todos los derechos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

