import { type NextRequest, NextResponse } from "next/server"

// Modo de simulação - não depende da API OpenAI
const SIMULATION_MODE = true

// Respostas simuladas para desenvolvimento
const simulatedResponses = [
  "Entendo. Poderia me dizer mais sobre quando esses sintomas começaram e se há algum fator que os piora ou melhora?",
  "Com base nos sintomas descritos, estou considerando algumas possibilidades. Você tem histórico de alergias ou problemas respiratórios?",
  "Obrigado pelas informações. Você mencionou febre - poderia me dizer qual a temperatura máxima registrada e há quanto tempo está com febre?",
  "Entendo. Considerando os sintomas apresentados, os principais diagnósticos diferenciais incluem infecção viral respiratória, sinusite bacteriana e reação alérgica. Vamos discutir cada um deles e o tratamento recomendado.",
]

// Contador para alternar entre respostas simuladas
let responseIndex = 0

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

    const { messages, consultaId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagens inválido" }, { status: 400 })
    }

    // Extract the latest user message
    const userMessages = messages.filter((msg) => msg.role === "user")
    if (userMessages.length === 0) {
      return NextResponse.json({ error: "Nenhuma mensagem do usuário encontrada" }, { status: 400 })
    }

    const latestUserMessage = userMessages[userMessages.length - 1]

    // Usar modo de simulação para evitar chamadas à API OpenAI
    if (SIMULATION_MODE) {
      // Obter a próxima resposta simulada e incrementar o índice
      const response = simulatedResponses[responseIndex]
      responseIndex = (responseIndex + 1) % simulatedResponses.length

      // Determinar a categoria da resposta
      const category = responseIndex === 3 ? "diagnosis" : "question"

      // Simular um pequeno atraso para parecer mais realista
      await new Promise((resolve) => setTimeout(resolve, 500))

      return NextResponse.json({
        response,
        category,
        simulation: true,
      })
    }

    // Se não estiver em modo de simulação, retornar uma resposta padrão
    // para evitar erros com a API OpenAI
    return NextResponse.json({
      response: "Esta é uma resposta simulada. O sistema está em manutenção no momento.",
      category: "question",
      simulation: true,
    })
  } catch (error) {
    console.error("Erro na API de chat:", error)

    // Mesmo em caso de erro, retornar um JSON válido
    return NextResponse.json(
      {
        response: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        category: "question",
        error: true,
        errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 200 },
    ) // Usar status 200 para garantir que o cliente receba um JSON válido
  }
}
