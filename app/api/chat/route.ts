import { type NextRequest, NextResponse } from "next/server";
import { aimlapi, type ChatMessage } from "@/lib/aimlapi";

// Opção para desabilitar a simulação e usar a API real
const SIMULATION_MODE = false;

// Respostas simuladas para desenvolvimento (ainda mantidas para fallback)
const simulatedResponses = [
  "Entendo. Poderia me dizer mais sobre quando esses sintomas começaram e se há algum fator que os piora ou melhora?",
  "Com base nos sintomas descritos, estou considerando algumas possibilidades. Você tem histórico de alergias ou problemas respiratórios?",
  "Obrigado pelas informações. Você mencionou febre - poderia me dizer qual a temperatura máxima registrada e há quanto tempo está com febre?",
  "Entendo. Considerando os sintomas apresentados, os principais diagnósticos diferenciais incluem infecção viral respiratória, sinusite bacteriana e reação alérgica. Vamos discutir cada um deles e o tratamento recomendado.",
];

// Contador para alternar entre respostas simuladas
let responseIndex = 0;

export async function POST(req: NextRequest) {
  try {
    // Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Erro ao analisar o corpo da requisição:", parseError);
      return NextResponse.json({ error: "Formato de requisição inválido" }, { status: 400 });
    }

    const { messages, consultaId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagens inválido" }, { status: 400 });
    }

    // Usar modo de simulação para desenvolvimento rápido
    if (SIMULATION_MODE) {
      // Obter a próxima resposta simulada e incrementar o índice
      const response = simulatedResponses[responseIndex];
      responseIndex = (responseIndex + 1) % simulatedResponses.length;

      // Determinar a categoria da resposta
      const category = responseIndex === 3 ? "diagnosis" : "question";

      // Simular um pequeno atraso para parecer mais realista
      await new Promise((resolve) => setTimeout(resolve, 500));

      return NextResponse.json({
        response,
        category,
        simulation: true,
      });
    }

    // Usar a API AIMLAPI
    try {
      // Formatar mensagens para o formato esperado pela API AIMLAPI
      const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Adicionar mensagem de sistema para contextualizar
      const systemMessage: ChatMessage = {
        role: "system",
        content: "Você é um assistente médico especializado em diagnósticos. Sua função é fazer perguntas relevantes para ajudar a estabelecer um diagnóstico preciso. Faça perguntas específicas, uma por vez, para elucidar o quadro clínico. Responda em português."
      };

      // Verificamos se já existe uma mensagem de sistema, caso contrário adicionamos
      const hasSystemMessage = formattedMessages.some(msg => msg.role === "system");
      const apiMessages = hasSystemMessage ? formattedMessages : [systemMessage, ...formattedMessages];

      // Chamada à API AIMLAPI
      const completion = await aimlapi.createChatCompletion({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 256,
      });

      const responseContent = completion.choices[0].message.content;

      // Determinar se a resposta é uma pergunta ou um diagnóstico
      // Isto é uma heurística simples e pode precisar ser refinada
      const isQuestion = responseContent.endsWith("?") || 
                         !responseContent.includes("diagnóstico") ||
                         !responseContent.includes("tratamento");
      
      const category = isQuestion ? "question" : "diagnosis";

      return NextResponse.json({
        response: responseContent,
        category,
        simulation: false,
      });
    } catch (apiError) {
      console.error("Erro na chamada à API AIMLAPI:", apiError);
      
      // Fallback para respostas simuladas em caso de erro na API
      const response = simulatedResponses[responseIndex];
      responseIndex = (responseIndex + 1) % simulatedResponses.length;
      
      return NextResponse.json({
        response,
        category: "question",
        simulation: true,
        error: true,
        errorMessage: apiError instanceof Error ? apiError.message : "Erro na comunicação com a API",
      });
    }
  } catch (error) {
    console.error("Erro na API de chat:", error);

    // Mesmo em caso de erro, retornar um JSON válido
    return NextResponse.json(
      {
        response: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        category: "question",
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 200 },
    ); // Usar status 200 para garantir que o cliente receba um JSON válido
  }
}