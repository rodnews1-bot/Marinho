import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Initialize OpenAI Client
// DANGER: In a production environment, never expose API keys on the frontend.
// This should be proxied through a backend. We are doing this here strictly for the requested demo environment.
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Generates a simplified explanation for legal text using OpenAI
 * @param {string} text - The legal text to simplify
 * @param {string} docType - The type of document (e.g., 'Sentença', 'Despacho')
 * @returns {Promise<string>}
 */
export const simplifyLegalText = async (text, docType) => {
  if (!text) return "";

  // Truncate to avoid excessive token usage
  const truncatedText = text.substring(0, 4000);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5-turbo for speed and cost effectiveness
      messages: [
        {
          role: "system",
          content: `Você é um advogado especialista em explicar termos jurídicos para crianças e leigos. 
          Seu objetivo é pegar um texto jurídico complexo e traduzir para uma linguagem extremamente simples, amigável e direta.
          
          Regras:
          1. Use linguagem simples (nível 5ª série).
          2. Explique o que aconteceu de fato.
          3. Explique qual é o próximo passo.
          4. Se for uma notícia boa, comece com "Boa notícia!".
          5. Máximo de 3 frases.`
        },
        {
          role: "user",
          content: `Documento: ${docType}\n\nTexto original: "${truncatedText}"\n\nExplique isso para o meu cliente de forma simples.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    // Fallback if API fails
    return `Não foi possível gerar a explicação automática no momento. (Erro: ${error.message}). O documento ${docType} foi registrado e nossa equipe está à disposição.`;
  }
};