import { type NextRequest, NextResponse } from "next/server"
import { createConsulta, getConsultasRecentes } from "@/lib/db"

export async function GET() {
  try {
    const consultas = await getConsultasRecentes()
    return NextResponse.json(consultas)
  } catch (error) {
    console.error("Erro ao buscar consultas:", error)
    return NextResponse.json({ error: "Erro ao buscar consultas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validação básica
    if (!data.paciente_id) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 })
    }

    const consulta = await createConsulta({ paciente_id: data.paciente_id })
    return NextResponse.json(consulta)
  } catch (error) {
    console.error("Erro ao criar consulta:", error)
    return NextResponse.json({ error: "Erro ao criar consulta" }, { status: 500 })
  }
}
