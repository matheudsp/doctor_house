import { type NextRequest, NextResponse } from "next/server";
import { aimlapi, type ChatMessage } from "@/lib/aimlapi";



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

    const { conversation, consultaId } = body;

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json({ error: "Formato de conversa inválido" }, { status: 400 });
    }

    // Usar a API AIMLAPI para obter diagnóstico
    try {
      // Formatar mensagens para o formato esperado pela API
      const formattedMessages: ChatMessage[] = conversation.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Chamar método específico para análise médica
      const diagnostico = await aimlapi.analyzeMedicalConversation(formattedMessages);

      return NextResponse.json({
        ...diagnostico,
        simulation: false,
      });
    } catch (apiError) {
      console.error("Erro na análise diagnóstica via API AIMLAPI:", apiError);
      
      // Fallback para diagnóstico simulado em caso de erro na API
      return NextResponse.json({
        diagnosticoPrincipal: {
          nome: "Erro na Análise Diagnóstica",
          descricao: "Não foi possível processar o diagnóstico. Por favor, tente novamente ou revise as informações fornecidas.",
        },
        diagnosticosDiferenciais: [
          {
            nome: "Problema de Conexão",
            probabilidade: 95,
            descricao: "Houve um problema na comunicação com o serviço de análise diagnóstica.",
          },
        ],
        evidencias: {
          sintomas: ["Error", "API Error"],
          exameFisico: [],
          examesComplementares: [],
        },
        recomendacoes: {
          tratamentoFarmacologico: [],
          tratamentoNaoFarmacologico: ["Tente novamente a análise"],
          acompanhamento: ["Consulte um médico presencialmente"],
        },
        examesAdicionais: [],
        simulation: true,
        error: true,
        errorMessage: apiError instanceof Error ? apiError.message : "Erro na análise diagnóstica",
      });
    }
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);

    // Mesmo em caso de erro, retornar um JSON válido
    return NextResponse.json(
      {
        diagnosticoPrincipal: {
          nome: "Erro no Processamento",
          descricao: "Ocorreu um erro ao processar as informações clínicas.",
        },
        diagnosticosDiferenciais: [
          {
            nome: "Indeterminado",
            probabilidade: 100,
            descricao: "Não foi possível processar os diagnósticos diferenciais.",
          },
        ],
        evidencias: {
          sintomas: [],
          exameFisico: [],
          examesComplementares: [],
        },
        recomendacoes: {
          tratamentoFarmacologico: [],
          tratamentoNaoFarmacologico: ["Tente novamente ou busque atendimento médico presencial"],
          acompanhamento: ["Consulta médica presencial recomendada"],
        },
        examesAdicionais: [],
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 200 },
    ); // Usar status 200 para garantir que o cliente receba um JSON válido
  }
}