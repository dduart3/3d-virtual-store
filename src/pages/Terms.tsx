import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function TermsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-white min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/5 to-transparent opacity-70"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gray-800/0 via-gray-400/30 to-gray-800/0"></div>
      
      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-12 text-center"
        >
          <Link 
            to="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Volver al Inicio</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-6">
            Términos y Condiciones
          </h1>
          <div className="w-16 h-px bg-gray-500/50 mx-auto mb-8"></div>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Última actualización: {new Date("4/6/2025").toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
          className="prose prose-invert prose-gray max-w-none"
        >
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">1. Introducción</h2>
              <p className="text-gray-400 leading-relaxed">
                Bienvenido a Uribe's Boutique. Estos Términos y Condiciones rigen su acceso y uso de nuestra plataforma, incluyendo nuestro sitio web, aplicaciones móviles, servicios y funcionalidades (colectivamente, "la Plataforma"). Al acceder o utilizar nuestra Plataforma, usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice nuestra Plataforma.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma. Su uso continuado de la Plataforma después de cualquier modificación constituye su aceptación de los términos modificados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">2. Uso de la Plataforma</h2>
              <p className="text-gray-400 leading-relaxed">
                Al utilizar nuestra Plataforma, usted declara y garantiza que:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Tiene al menos 18 años de edad o la mayoría de edad legal en su jurisdicción.</li>
                <li>Proporcionará información precisa, actualizada y completa durante el proceso de registro y mantendrá actualizada dicha información.</li>
                <li>Utilizará la Plataforma de conformidad con todas las leyes y regulaciones aplicables.</li>
                <li>No utilizará la Plataforma para fines ilegales o no autorizados.</li>
                <li>No intentará interferir con el funcionamiento adecuado de la Plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">3. Cuentas de Usuario</h2>
              <p className="text-gray-400 leading-relaxed">
                Para acceder a ciertas funciones de nuestra Plataforma, deberá crear una cuenta. Usted es responsable de mantener la confidencialidad de su información de cuenta, incluyendo su contraseña, y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nos reservamos el derecho de suspender o terminar su cuenta, eliminar su contenido y restringir su uso de todos o algunos de los servicios si determinamos, a nuestra discreción, que ha violado estos Términos y Condiciones o si su conducta o contenido podría dañar nuestra reputación y buena voluntad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">4. Productos y Transacciones</h2>
              <p className="text-gray-400 leading-relaxed">
                Todos los productos ofrecidos en nuestra Plataforma están sujetos a disponibilidad. Nos reservamos el derecho de discontinuar cualquier producto en cualquier momento y de limitar las cantidades de cualquier producto que ofrecemos.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Los precios de los productos están sujetos a cambios sin previo aviso. Hacemos todo lo posible para garantizar que la información del producto, incluyendo precios y disponibilidad, sea precisa. Sin embargo, pueden ocurrir errores. En caso de un error en el precio de un producto, nos reservamos el derecho de rechazar o cancelar cualquier pedido.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Al realizar un pedido, usted acepta proporcionar información de compra actual, completa y precisa. Nos reservamos el derecho de rechazar o cancelar un pedido por cualquier motivo, incluyendo limitaciones de producto, errores en la información del producto o precio, o problemas identificados por nuestro departamento de fraude y crédito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">5. Política de Devoluciones y Reembolsos</h2>
              <p className="text-gray-400 leading-relaxed">
                Aceptamos devoluciones de productos no usados y en su estado original dentro de los 14 días posteriores a la recepción. Para iniciar una devolución, comuníquese con nuestro servicio de atención al cliente. Los gastos de envío para devoluciones corren por cuenta del cliente, a menos que el producto recibido sea defectuoso o incorrecto.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Una vez que recibamos e inspeccionemos el artículo devuelto, procesaremos su reembolso. El reembolso se aplicará al método de pago original utilizado para la compra. El tiempo para que aparezca el reembolso en su cuenta depende de las políticas de su institución financiera.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">6. Propiedad Intelectual</h2>
              <p className="text-gray-400 leading-relaxed">
                La Plataforma y todo su contenido, características y funcionalidades son propiedad de Uribe's Boutique, sus licenciantes u otros proveedores y están protegidos por leyes de derechos de autor, marcas registradas, patentes, secretos comerciales y otras leyes de propiedad intelectual.
              </p>
              <p className="text-gray-400 leading-relaxed">
                No puede reproducir, distribuir, modificar, crear trabajos derivados, exhibir públicamente, ejecutar públicamente, republicar, descargar, almacenar o transmitir cualquier material de nuestra Plataforma, excepto según lo permitido por estos Términos y Condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">7. Limitación de Responsabilidad</h2>
              <p className="text-gray-400 leading-relaxed">
                En ningún caso Uribe's Boutique, sus directores, empleados, socios, agentes, proveedores o afiliados serán responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Su acceso o uso o incapacidad para acceder o usar la Plataforma.</li>
                <li>Cualquier conducta o contenido de terceros en la Plataforma.</li>
                <li>Cualquier contenido obtenido de la Plataforma.</li>
                <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">8. Ley Aplicable</h2>
              <p className="text-gray-400 leading-relaxed">
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de Colombia, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier acción legal que surja de estos términos se presentará exclusivamente en los tribunales ubicados en Bogotá, Colombia, y usted consiente a la jurisdicción personal en dichos tribunales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">9. Contacto</h2>
              <p className="text-gray-400 leading-relaxed">
                Si tiene alguna pregunta sobre estos Términos y Condiciones, comuníquese con nosotros en:
              </p>
              <p className="text-gray-300 mt-4">
                Uribe's Boutique<br />
                Email: <a href="mailto:info@uribesboutique.pages.dev" className="text-white hover:text-gray-300 transition-colors duration-300">info@uribesboutique.pages.dev</a><br />
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TermsPage;
