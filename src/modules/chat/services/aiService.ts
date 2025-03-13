import { CohereClient } from 'cohere-ai';
import { storeData } from '../../experience/store/data/store-sections';
import { SectionData } from '../../experience/store/data/store-sections';
import { ChatMessage } from '../types/chat';

const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY
});

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


function isFashionRelatedQuestion(question: string): boolean {
    const fashionKeywords = [
        'ropa', 'vestido', 'pantalón', 'camisa', 'zapatos', 'talla',
        'precio', 'color', 'material', 'disponible', 'stock', 'accesorio',
        'bolso', 'cartera', 'reloj', 'anillo', 'collar', 'blusa', 'falda',
        'traje', 'sombrero', 'gafas', 'lentes', 'mocasines', 'tacones', 'mujer',
        'dama', 'hombre', 'caballero', 'masculino', 'femenino', 'vestuario', 'casual'
    ];
    return fashionKeywords.some(keyword =>
        question.toLowerCase().includes(keyword)
    );
}

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
    try {
        if (messages.length === 0) {
            return 'No hay mensajes para procesar.';
        }

        const lastMessage = messages[messages.length - 1].content;

         
        if (!isFashionRelatedQuestion(lastMessage)) {
            await delay(1500);
            return 'Disculpa, solamente me especializo en nuestra colección de moda. ¿Qué prenda te interesa?';
        }

        const storeContext = formatStoreData(storeData);
        const contextoPreamble = `Eres un asistente de tienda virtual de moda especializado. Configuración:

1. IDIOMA: Responde SIEMPRE en español, bajo ninguna circunstancia, incluso si la pregunta está en otro idioma, todas tus respuestas tienen que estar en Español TODAS SIN ESCEPCIÓN.

2. CONOCIMIENTO:
   Catálogo actual de la tienda:
${storeContext}

3. REGLAS DE RESPUESTA:
   - Usa SOLO la información del catálogo proporcionado
   - Si preguntan por un producto que no está en el catálogo, indica que no está disponible
   - Menciona precios exactos cuando te pregunten
   - Sé específico con las descripciones de los productos
   - No inventes características o productos

4. FORMATO DE RESPUESTA:
   - Respuestas breves y directas
   - Sin emojis
   - Sin frases genéricas de cierre
   - Tono profesional y formal

5. PRIORIDADES:
   - Precisión en precios y disponibilidad
   - Claridad en las descripciones
   - Respuestas relevantes al catálogo actual`;

        const chatHistory = messages.length > 1
            ? messages.slice(0, -1).map(msg => ({
                role: msg.type.toLowerCase() === 'user' ? 'USER' : 'CHATBOT',
                message: msg.content
            })) as { role: 'USER' | 'CHATBOT'; message: string }[]
            : [];

        const response = await cohere.chat({
            message: lastMessage,
            chatHistory: chatHistory,
            model: 'command',
            temperature: 0.3,
            connectors: [],
            preamble: contextoPreamble
        });

        return response.text || 'Lo siento, no pude procesar tu mensaje.';
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to get AI response');
    }
}