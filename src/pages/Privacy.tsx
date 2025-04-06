import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function PrivacyPage() {
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
            Política de Privacidad
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
                En Uribe's Boutique, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, procesamos y protegemos su información personal cuando utiliza nuestra plataforma, incluyendo nuestro sitio web, aplicaciones móviles y servicios relacionados (colectivamente, "la Plataforma").
              </p>
              <p className="text-gray-400 leading-relaxed">
                Al acceder o utilizar nuestra Plataforma, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con esta política, le pedimos que no utilice nuestra Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">2. Información que Recopilamos</h2>
              <p className="text-gray-400 leading-relaxed">
                Podemos recopilar los siguientes tipos de información:
              </p>
              <h3 className="text-lg font-light text-white mt-6 mb-3">2.1 Información Personal</h3>
              <p className="text-gray-400 leading-relaxed">
                Información que usted nos proporciona directamente, como:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Información de identificación (nombre, dirección de correo electrónico, número de teléfono, dirección postal)</li>
                <li>Información de pago (número de tarjeta de crédito, información bancaria)</li>
                <li>Información de perfil (foto de perfil, preferencias de compra)</li>
                <li>Comunicaciones que mantiene con nosotros</li>
              </ul>

              <h3 className="text-lg font-light text-white mt-6 mb-3">2.2 Información Automática</h3>
              <p className="text-gray-400 leading-relaxed">
                Información recopilada automáticamente cuando utiliza nuestra Plataforma, como:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Información del dispositivo (tipo de dispositivo, sistema operativo, identificadores únicos)</li>
                <li>Información de registro (direcciones IP, fechas y horas de acceso, actividades en la Plataforma)</li>
                <li>Información de ubicación (con su consentimiento)</li>
                <li>Información de cookies y tecnologías similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">3. Cómo Utilizamos su Información</h2>
              <p className="text-gray-400 leading-relaxed">
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Proporcionar, mantener y mejorar nuestra Plataforma</li>
                <li>Procesar transacciones y enviar notificaciones relacionadas</li>
                <li>Personalizar su experiencia y proporcionar contenido y ofertas adaptadas a sus intereses</li>
                <li>Comunicarnos con usted, responder a sus consultas y proporcionar servicio al cliente</li>
                <li>Enviar información promocional y de marketing (con su consentimiento)</li>
                <li>Proteger la seguridad e integridad de nuestra Plataforma</li>
                <li>Cumplir con obligaciones legales y resolver disputas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">4. Compartir su Información</h2>
              <p className="text-gray-400 leading-relaxed">
                Podemos compartir su información personal en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Con proveedores de servicios que nos ayudan a operar nuestra Plataforma (procesadores de pago, servicios de entrega, servicios de alojamiento)</li>
                <li>Con socios comerciales con su consentimiento</li>
                <li>En respuesta a un proceso legal o cuando sea necesario para cumplir con la ley</li>
                <li>Para proteger nuestros derechos, privacidad, seguridad o propiedad, así como los de nuestros usuarios y terceros</li>
                <li>En relación con una transacción corporativa (fusión, adquisición, venta de activos)</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                No vendemos su información personal a terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">5. Cookies y Tecnologías Similares</h2>
              <p className="text-gray-400 leading-relaxed">
                Utilizamos cookies y tecnologías similares para recopilar información sobre su actividad, navegador y dispositivo. Estas tecnologías nos ayudan a proporcionar funciones, recordar sus preferencias, analizar el uso de nuestra Plataforma y personalizar el contenido.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando se envían cookies. Sin embargo, si desactiva o rechaza las cookies, algunas partes de nuestra Plataforma pueden volverse inaccesibles o no funcionar correctamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">6. Seguridad de la Información</h2>
              <p className="text-gray-400 leading-relaxed">
                Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger la información personal contra acceso no autorizado, destrucción o alteración. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">7. Retención de Datos</h2>
              <p className="text-gray-400 leading-relaxed">
                Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta Política de Privacidad, a menos que se requiera o permita un período de retención más largo por ley.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">8. Sus Derechos y Opciones</h2>
              <p className="text-gray-400 leading-relaxed">
                Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, que pueden incluir:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2 mt-4">
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta o incompleta</li>
                <li>Eliminar su información personal</li>
                <li>Restringir u oponerse al procesamiento de su información</li>
                <li>Solicitar la portabilidad de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                Para ejercer estos derechos, comuníquese con nosotros utilizando la información de contacto proporcionada al final de esta política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">9. Privacidad de los Niños</h2>
              <p className="text-gray-400 leading-relaxed">
                Nuestra Plataforma no está dirigida a personas menores de 18 años y no recopilamos a sabiendas información personal de niños menores de 18 años. Si descubrimos que hemos recopilado información personal de un niño menor de 18 años, tomaremos medidas para eliminar esa información lo más rápido posible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">10. Cambios a esta Política</h2>
              <p className="text-gray-400 leading-relaxed">
                Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de información o por otras razones operativas, legales o regulatorias. Le notificaremos cualquier cambio material publicando la nueva Política de Privacidad en esta página y, cuando sea apropiado, le notificaremos por correo electrónico o mediante un aviso en nuestra Plataforma.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Le recomendamos que revise esta Política de Privacidad periódicamente para estar informado sobre cómo protegemos su información.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light tracking-wider border-b border-gray-800 pb-3 mb-6">11. Contacto</h2>
              <p className="text-gray-400 leading-relaxed">
                Si tiene preguntas, comentarios o inquietudes sobre esta Política de Privacidad o nuestras prácticas de privacidad, comuníquese con nosotros en:
              </p>
              <p className="text-gray-300 mt-4">
                Uribe's Boutique<br />
                Email: <a href="mailto:privacidad@uribesboutique.pages.dev" className="text-white hover:text-gray-300 transition-colors duration-300">privacidad@uribesboutique.pages.dev</a><br />
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyPage;
