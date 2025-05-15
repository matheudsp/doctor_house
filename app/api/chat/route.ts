import { type NextRequest, NextResponse } from "next/server";
import { aimlapi, type ChatMessage } from "@/lib/aimlapi";
import { createMensagem, getMensagensByConsultaId, createConsulta } from "@/lib/db";

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

    // Criar nova consulta se não houver consultaId
    let activeConsultaId = consultaId;
    if (!activeConsultaId) {
      try {
        const novaConsulta = await createConsulta();
        activeConsultaId = novaConsulta.id;
      } catch (dbError) {
        console.error("Erro ao criar nova consulta:", dbError);
        return NextResponse.json({ error: "Erro ao criar consulta" }, { status: 500 });
      }
    }

    // Formatar mensagens para o formato esperado pela API AIMLAPI
    const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      category: msg.category
    }));

    // Verificar se existe mensagem de sistema, caso contrário adicionar
    const systemMessage: ChatMessage = {
      role: "system",
      content: `Você é um assistente médico especializado em diagnósticos. 
      Sua função é fazer perguntas relevantes para ajudar a estabelecer um diagnóstico preciso. 
      Faça perguntas específicas, uma por vez, para elucidar o quadro clínico. 
      Mantenha suas respostas concisas e focadas. Responda em português.`
    };

    const hasSystemMessage = formattedMessages.some(msg => msg.role === "system");
    const apiMessages = hasSystemMessage ? formattedMessages : [systemMessage, ...formattedMessages];

    try {
      // Salvar mensagem do usuário no banco de dados (se for a última mensagem)
      if (activeConsultaId && formattedMessages.length > 0) {
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (lastMessage.role === "user") {
          await createMensagem({
            consulta_id: activeConsultaId,
            role: lastMessage.role,
            content: lastMessage.content,
            category: lastMessage.category || "question"
          });
        }
      }

      // Chamar API AIMLAPI
      const completion = await aimlapi.createChatCompletion({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 256,
      });

      const responseContent = completion.choices[0].message.content;

      // Determinar categoria da resposta com uma lógica mais robusta
      let category = "question";
      
      // Verifica se parece um diagnóstico com base em palavras-chave
      if (
        responseContent.toLowerCase().includes("diagnóstico") ||
        responseContent.toLowerCase().includes("possível condição") ||
        responseContent.toLowerCase().includes("suspeita de") ||
        responseContent.toLowerCase().includes("tratamento") ||
        responseContent.toLowerCase().includes("recomendo que") ||
        (responseContent.toLowerCase().includes("exame") && !responseContent.endsWith("?"))
      ) {
        category = "diagnosis";
      } else if (responseContent.includes("?")) {
        category = "question";
      }

      // Criar objeto de resposta
      const responseMessage: ChatMessage = {
        role: "assistant",
        content: responseContent,
        category
      };

      // Salvar resposta do assistente no banco de dados
      if (activeConsultaId) {
        await createMensagem({
          consulta_id: activeConsultaId,
          role: "assistant",
          content: responseContent,
          category
        });
      }

      return NextResponse.json({
        response: responseContent,
        category,
        message: responseMessage,
        consultaId: activeConsultaId,
        simulation: false,
      });
    } catch (apiError) {
      console.error("Erro na chamada à API AIMLAPI:", apiError);
      
      return NextResponse.json({
        category: "question",
        error: true,
        consultaId: activeConsultaId,
        errorMessage: apiError instanceof Error ? apiError.message : "Erro na comunicação com a API",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro na API de chat:", error);

    return NextResponse.json(
      {
        response: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        category: "question",
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// Rota GET para buscar histórico de mensagens
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const consultaId = parseInt(url.searchParams.get("consultaId") || "");
    
    if (isNaN(consultaId)) {
      return NextResponse.json({ error: "ID de consulta inválido" }, { status: 400 });
    }
    
    const mensagens = await getMensagensByConsultaId(consultaId);
    
    return NextResponse.json(mensagens);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}