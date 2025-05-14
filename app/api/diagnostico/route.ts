import { type NextRequest, NextResponse } from "next/server"

// Modo de simulação - não depende da API OpenAI
const SIMULATION_MODE = true

export async function POST(req: NextRequest) {
  try {
    // Parse request body safely
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Erro ao analisar o corpo da requisição:", parseError)
      return NextResponse.json({ error: "Formato de requisição inválido" }, { status: 400 })
    }

    const { conversation, consultaId } = body

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json({ error: "Formato de conversa inválido" }, { status: 400 })
    }

    // Usar modo de simulação para evitar chamadas à API OpenAI
    if (SIMULATION_MODE) {
      // Simular um pequeno atraso para parecer mais realista
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Diagnóstico simulado
      const mockDiagnostico = {
        diagnosticoPrincipal: {
          nome: "Síndrome Gripal",
          descricao:
            "Infecção viral aguda do trato respiratório com duração de até 7 dias, caracterizada por febre, tosse e outros sintomas respiratórios.",
        },
        diagnosticosDiferenciais: [
          {
            nome: "COVID-19",
            probabilidade: 65,
            descricao: "Infecção causada pelo SARS-CoV-2, com sintomas respiratórios e sistêmicos variáveis.",
          },
          {
            nome: "Resfriado Comum",
            probabilidade: 55,
            descricao: "Infecção viral leve do trato respiratório superior, geralmente causada por rinovírus.",
          },
          {
            nome: "Sinusite Aguda",
            probabilidade: 40,
            descricao:
              "Inflamação da mucosa dos seios paranasais, geralmente secundária a infecção viral ou bacteriana.",
          },
          {
            nome: "Bronquite Aguda",
            probabilidade: 35,
            descricao:
              "Inflamação dos brônquios, geralmente causada por infecção viral, com tosse produtiva como sintoma principal.",
          },
        ],
        evidencias: {
          sintomas: ["Febre", "Tosse", "Dor de garganta", "Fadiga", "Congestão nasal", "Cefaleia"],
          exameFisico: ["Hiperemia de orofaringe", "Temperatura elevada (38.2°C)", "Ausculta pulmonar normal"],
          examesComplementares: [],
        },
        recomendacoes: {
          tratamentoFarmacologico: [
            "Antitérmicos conforme necessário (Paracetamol 500-750mg a cada 6h se temperatura > 38°C)",
            "Analgésicos para alívio sintomático (Dipirona 500-1000mg a cada 6h, se necessário)",
            "Anti-inflamatórios não esteroidais podem ser considerados na ausência de contraindicações",
          ],
          tratamentoNaoFarmacologico: [
            "Repouso relativo",
            "Hidratação adequada (≥ 2L/dia)",
            "Isolamento domiciliar por 5-7 dias do início dos sintomas",
            "Umidificação do ambiente pode ajudar a aliviar sintomas respiratórios",
          ],
          acompanhamento: [
            "Retorno em 3-5 dias se não houver melhora",
            "Buscar atendimento imediato se sinais de alarme (dispneia, saturação < 95%, cianose, alteração do nível de consciência)",
            "Monitorar temperatura e sintomas respiratórios",
          ],
        },
        examesAdicionais: [
          "Teste para COVID-19 se sintomas persistirem ou houver contato com caso confirmado",
          "Hemograma e PCR em caso de suspeita de infecção bacteriana secundária",
          "Radiografia de tórax se houver suspeita de comprometimento pulmonar",
        ],
        simulation: true,
      }

      return NextResponse.json(mockDiagnostico)
    }

    // Se não estiver em modo de simulação, retornar um diagnóstico padrão
    // para evitar erros com a API OpenAI
    return NextResponse.json({
      diagnosticoPrincipal: {
        nome: "Diagnóstico Simulado",
        descricao: "Este é um diagnóstico simulado. O sistema está em manutenção no momento.",
      },
      diagnosticosDiferenciais: [
        {
          nome: "Simulação",
          probabilidade: 100,
          descricao: "Diagnóstico simulado para fins de demonstração.",
        },
      ],
      evidencias: {
        sintomas: ["Simulado"],
        exameFisico: ["Simulado"],
        examesComplementares: [],
      },
      recomendacoes: {
        tratamentoFarmacologico: ["Simulado"],
        tratamentoNaoFarmacologico: ["Simulado"],
        acompanhamento: ["Simulado"],
      },
      examesAdicionais: ["Simulado"],
      simulation: true,
    })
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error)

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
    ) // Usar status 200 para garantir que o cliente receba um JSON válido
  }
}
