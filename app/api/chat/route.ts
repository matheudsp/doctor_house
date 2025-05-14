import { NextResponse } from "next/server";
import { aimlapi, ChatMessage } from "@/lib/aimlapi";
import { createMensagem } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, consultaId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: true, errorMessage: "Formato de mensagens inválido" },
        { status: 400 }
      );
    }

    // Limita a quantidade de mensagens para evitar exceder o limite de tokens
    const limitedMessages = messages.slice(-10);

    // Adiciona instruções específicas para o modelo
    const processedMessages: ChatMessage[] = [
      {
        role: "system",
        content: `Você é um assistente médico especializado em diagnósticos. Sua função é ajudar a estabelecer diagnósticos com base em sintomas e informações clínicas. 
        
        Siga estas regras:
        1. Faça perguntas claras e específicas, uma de cada vez.
        2. Explore detalhes relevantes sobre sintomas, duração, fatores de agravo/alívio.
        3. Investigue histórico médico relevante.
        4. Quando tiver informações suficientes, forneça um diagnóstico preliminar.
        5. Não use jargão médico excessivo; mantenha a linguagem acessível.
        6. Não solicite exames ou testes diagnósticos específicos, apenas trabalhe com as informações fornecidas.
        7. Termine com "DIAGNÓSTICO:" seguido do diagnóstico preliminar quando acreditar ter informações suficientes para tal.`,
      },
      ...limitedMessages,
    ];

    // Faz a chamada para a API da AIMLAPI
    const completion = await aimlapi.createChatCompletion({
      model: "gpt-4o-mini",
      messages: processedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Determina se é uma pergunta ou um diagnóstico com base no conteúdo
    let category = "question";
    if (assistantMessage.includes("DIAGNÓSTICO:")) {
      category = "diagnosis";
    }

    // Se houver um ID de consulta, salvar a mensagem no banco de dados
    if (consultaId) {
      await createMensagem({
        consulta_id: consultaId,
        role: "assistant",
        content: assistantMessage,
        category,
      });
    }

    return NextResponse.json({
      response: assistantMessage,
      category,
    });
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    return NextResponse.json(
      {
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}