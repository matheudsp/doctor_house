import { type NextRequest, NextResponse } from "next/server";
import { aimlapi, type ChatMessage } from "@/lib/aimlapi";
import { updateConsulta, getMensagensByConsultaId } from "@/lib/db";

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

    const { consultaId } = body;

    if (!consultaId || typeof consultaId !== 'number') {
      return NextResponse.json({ error: "ID de consulta inválido ou não fornecido" }, { status: 400 });
    }

    try {
      // Buscar o histórico completo de mensagens do banco de dados para análise
      const mensagens = await getMensagensByConsultaId(consultaId);
      
      if (!mensagens || mensagens.length === 0) {
        return NextResponse.json({ error: "Não há mensagens para essa consulta" }, { status: 404 });
      }

      // Converter mensagens do banco para o formato esperado pela API
      const conversation: ChatMessage[] = mensagens.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
        category: msg.category as "question" | "diagnosis" | undefined
      }));

      // Adicionar instrução específica para análise diagnóstica
      const diagnosticPrompt: ChatMessage = {
        role: "system",
        content: `Você é um assistente médico especializado em diagnósticos. 
        Com base na conversa anterior, forneça um diagnóstico detalhado com diagnósticos diferenciais, 
        evidências clínicas e recomendações terapêuticas. 
        Seja preciso e baseie-se nas evidências apresentadas durante a consulta.`
      };
      
      // Chamar método específico para análise médica
      const diagnostico = await aimlapi.analyzeMedicalConversation([
        diagnosticPrompt,
        ...conversation
      ]);

      // Atualizar a consulta no banco de dados com o diagnóstico
      await updateConsulta(consultaId, {
        status: "concluida",
        diagnostico_principal: diagnostico.diagnosticoPrincipal.nome,
        diagnosticos_diferenciais: diagnostico.diagnosticosDiferenciais,
        recomendacoes: diagnostico.recomendacoes
      });

      return NextResponse.json({
        ...diagnostico,
        consultaId,
        simulation: false,
      });
    } catch (apiError) {
      console.error("Erro na análise diagnóstica via API AIMLAPI:", apiError);
      
      // Fallback para diagnóstico de erro em caso de falha na API
      const fallbackDiagnostico = {
        diagnosticoPrincipal: {
          nome: "Erro na Análise Diagnóstica",
          descricao: "Não foi possível processar o diagnóstico. Por favor, tente novamente ou revise as informações fornecidas.",
        },
        diagnosticosDiferenciais: [
          {
            nome: "Problema de Processamento",
            probabilidade: 95,
            descricao: "Houve um problema na comunicação com o serviço de análise diagnóstica.",
          },
        ],
        evidencias: {
          sintomas: ["Erro de Processamento"],
          exameFisico: [],
          examesComplementares: [],
        },
        recomendacoes: {
          tratamentoFarmacologico: [],
          tratamentoNaoFarmacologico: ["Tente novamente a análise"],
          acompanhamento: ["Consulte um médico presencialmente"],
        },
        examesAdicionais: [],
        consultaId,
        simulation: true,
        error: true,
        errorMessage: apiError instanceof Error ? apiError.message : "Erro na análise diagnóstica",
      };

      // Mesmo em caso de erro, atualizamos o status da consulta
      try {
        await updateConsulta(consultaId, {
          status: "arquivada", // Marcamos como arquivada para indicar problema
        });
      } catch (dbError) {
        console.error("Erro adicional ao atualizar status da consulta:", dbError);
      }

      return NextResponse.json(fallbackDiagnostico, { status: 500 });
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
      { status: 500 },
    );
  }
}