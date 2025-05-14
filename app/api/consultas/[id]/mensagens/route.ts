import { type NextRequest, NextResponse } from "next/server"
import { createMensagem, getMensagensByConsultaId } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const consultaId = Number.parseInt(params.id)

    if (isNaN(consultaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const mensagens = await getMensagensByConsultaId(consultaId)
    return NextResponse.json(mensagens)
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const consultaId = Number.parseInt(params.id)

    if (isNaN(consultaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const data = await request.json()

    // Validação básica
    if (!data.role || !data.content) {
      return NextResponse.json({ error: "Role e content são obrigatórios" }, { status: 400 })
    }

    const mensagem = await createMensagem({
      consulta_id: consultaId,
      role: data.role,
      content: data.content,
      category: data.category,
    })

    return NextResponse.json(mensagem)
  } catch (error) {
    console.error("Erro ao criar mensagem:", error)
    return NextResponse.json({ error: "Erro ao criar mensagem" }, { status: 500 })
  }
}
