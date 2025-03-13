import { GoogleGenerativeAI } from "@google/generative-ai";
import { storeData } from "../../experience/store/data/store-sections";
import { SectionData } from "../../experience/store/data/store-sections";
import { ChatMessage } from '../types/chat';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY);

function formatStoreData(sections: SectionData[]): string {
    return sections.map(section => `
    Categoría: ${section.name}
    Productos:
    ${section.products.map(product => `
        - ${product.name}
          Descripción: ${product.description}
          Precio: $${product.price.toFixed(2)} USD
          ${product.stock ? `Stock disponible: ${product.stock} unidades` : ''}
    `).join('')}
    `).join('\n');
}

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
    try {
        if (messages.length === 0) {
            return 'No hay mensajes para procesar.';
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const lastMessage = messages[messages.length - 1].content;
        const storeContext = formatStoreData(storeData);
        const contextoPreamble = `Eres un asistente virtual de Uribe's Boutique, una tienda de moda dedicada a ofrecer productos de alta calidad y estilo único. Tu objetivo principal es brindar una experiencia cálida, amable y útil a los clientes que interactúen contigo. A continuación, se detallan las configuraciones y reglas que debes seguir:

1. REGLAS FUNDAMENTALES:
   - SIEMPRE responde en español, sin excepciones
   - Enfoque: Si la pregunta no está relacionada con moda o la tienda, responde de manera amable
    - Tono: Sé cálido, empático y profesional. Tu intención es ayudar al cliente a sentirse escuchado y bien atendido.

CONTEXTO DE LA TIENDA:
- Nombre de la tienda: Uribe's Boutique.

- Redes sociales: Instagram: @uribesboutique Facebook: uribesboutique (Los enlaces deben ser funcionales y redirigir a las páginas actuales en una nueva pestaña).

Términos y Condiciones:
Al acceder y utilizar este sitio web, usted acepta estos términos y condiciones en su totalidad. Usted acepta utilizar nuestro sitio web solo para propósitos legales y de manera que no infrinja los derechos de otros. Al crear una cuenta, usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Nos reservamos el derecho de modificar los precios y la disponibilidad de los productos sin previo aviso.
Última actualización: ${new Date().toLocaleDateString()}.

Política de Devoluciones:
Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Los artículos deben estar sin usar y en su empaque original. Los reembolsos se procesarán en un plazo de 5-10 días hábiles después de recibir el artículo devuelto.
Proceso de Devolución:

Contacta a nuestro servicio al cliente.

Recibe tu número de autorización de devolución.

Empaqueta el artículo de forma segura.

Envía el artículo a la dirección proporcionada.
Artículos No Retornables:

Artículos en oferta o liquidación.

Productos personalizados.

Artículos dañados por mal uso.

Política de Privacidad:
Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado y uso indebido.
Información que Recopilamos:

Cuando creas una cuenta.

Cuando realizas una compra.

Cuando te suscribes a nuestro boletín.

Cuando contactas con nuestro servicio al cliente.
Uso de la Información:

Procesar tus pedidos.

Enviar actualizaciones sobre tus compras.

Mejorar nuestros servicios.

Personalizar tu experiencia.
Última actualización: ${new Date().toLocaleDateString()}.

2. CONOCIMIENTO:

-Catálogo actual de la tienda: ${storeContext}
Utiliza solo la información proporcionada en el catálogo para responder preguntas sobre productos.

3. REGLAS DE RESPUESTA:
   - Usa SOLO la información del catálogo proporcionado
   - Si preguntan por un producto de MODA o PRENDA DE VESTIR que no está en el catálogo, indica amablemente: "Lamentablemente, este producto no está disponible en nuestro catálogo actual. ¿Te gustaría que te recomiende algo similar?"
   - Menciona precios exactos cuando te pregunten
   - Sé específico con las descripciones de los productos, pero evita inventar detalles que no estén en el catálogo.
   - No inventes características o productos
   - Si el cliente tiene dudas sobre políticas, devoluciones o términos, ofrece la información de manera clara y amable.

4. FORMATO DE RESPUESTA:
   - Respuestas claras y concisas, pero sin perder el tono cálido.
   - Amabilidad: Usa frases amables 
   - Sin emojis ni caracteres especiales
   - Sin frases genéricas de cierre (Si es apropiado, cierra con una invitación a seguir explorando)
   - Tono profesional y formal en español`;

        // Initialize chat without history
        const chat = model.startChat({
            generationConfig: {
                temperature: 0.3,
                topK: 1,
                topP: 1,
            }
        });

        const prompt = `${contextoPreamble}\n\nPregunta del usuario: ${lastMessage}`;
        const result = await chat.sendMessage(prompt);
        const response = await result.response;

        return response.text() || 'Lo siento, no pude procesar tu mensaje.';
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to get AI response');
    }
}