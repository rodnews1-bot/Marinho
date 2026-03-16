import OpenAI from 'openai';

export const generateDocument = async (context, type, clientName, cpf) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const assistantId = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

  if (!apiKey || !assistantId) {
    throw new Error("Chave API ou ID do Assistente da OpenAI não configurados no painel.");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true 
  });

  const instructions = `Cliente: ${clientName} (CPF: ${cpf}).
Por favor, aja como a Inteligência Artificial Marinho e gere o seguinte documento com base nos Fatos Extraídos:\n
TIPO DE DOCUMENTO SOLICITADO: ${type}\n
----- FATOS E PROVAS (Extraídos do Drive) -----
${context}
-----------------------------------------------

Requisitos do Sistema:
1. Devolva APENAS o texto da peça formatado profissionalmente em markdown ou texto plano.
2. Não inclua conversas ou recados para o advogado. Comece com a formatação oficial aplicável da peça.`;

  try {
    // 1. Cria a conversa (Thread)
    const thread = await openai.beta.threads.create();

    // 2. Adiciona a mensagem do Advogado na Thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: instructions
    });

    // 3. Roda o Assistente treinado pelo Cliente (asst_82Wwqn11az8QzLkTL1iV25U3)
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    // 4. Aguarda ele terminar de digitar (Polling)
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    // Polling seguro loop (max 2 min)
    const startTime = Date.now();
    while (runStatus.status !== "completed") {
       await new Promise(resolve => setTimeout(resolve, 3000));
       runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
       
       if (runStatus.status === "failed" || runStatus.status === "cancelled") {
         throw new Error(`O assistente falhou ou foi cancelado (Status: ${runStatus.status}).`);
       }

       if (Date.now() - startTime > 120000) {
         throw new Error("A Inteligência Artificial ultrapassou o limite de tempo (Timeout de 2 min).");
       }
    }

    // 5. Puxa a resposta final
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.filter(m => m.role === 'assistant')[0];
    
    if (lastMessage && lastMessage.content[0].text) {
        return lastMessage.content[0].text.value;
    }

    throw new Error("Resposta da IA veio vazia.");
  } catch (error) {
    console.error("Erro na OpenAI Assistants API:", error);
    throw new Error(error.message || "Não foi possível conectar com o seu Assistente Customizado.");
  }
};
