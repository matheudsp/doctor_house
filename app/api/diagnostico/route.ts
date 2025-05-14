// app/api/diagnostico/route.ts
import { NextResponse } from "next/server";
import { aimlapi } from "@/lib/aimlapi";
import { updateConsulta } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversation, consultaId } = body;

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: true, errorMessage: "Formato de conversa inválido" },
        { status: 400 }
      );
    }

    // Gera diagnóstico com base na conversa
    const diagnostico = await aimlapi.analyzeMedicalConversation(conversation);

    // Se houver um ID de consulta, atualiza os dados no banco de dados
    if (consultaId) {
      await updateConsulta(consultaId, {
        diagnostico_principal: diagnostico.diagnosticoPrincipal.nome,
        diagnosticos_diferenciais: diagnostico.diagnosticosDiferenciais,
        recomendacoes: {
          tratamentoFarmacologico: diagnostico.recomendacoes.tratamentoFarmacologico,
          tratamentoNaoFarmacologico: diagnostico.recomendacoes.tratamentoNaoFarmacologico,
          acompanhamento: diagnostico.recomendacoes.acompanhamento,
          examesAdicionais: diagnostico.examesAdicionais
        },
        status: "concluida"
      });
    }

    return NextResponse.json(diagnostico);
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);
    return NextResponse.json(
      {
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido ao gerar diagnóstico",
      },
      { status: 500 }
    );
  }
}