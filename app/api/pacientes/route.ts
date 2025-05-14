import { type NextRequest, NextResponse } from "next/server"
import { createPaciente, getPacientes } from "@/lib/db"

export async function GET() {
  try {
    const pacientes = await getPacientes()
    return NextResponse.json(pacientes)
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    return NextResponse.json({ error: "Erro ao buscar pacientes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validação básica
    if (!data.nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    // Simplificando para usar apenas o nome
    const pacienteData = {
      nome: data.nome,
    }

    const paciente = await createPaciente(pacienteData)
    return NextResponse.json(paciente)
  } catch (error) {
    console.error("Erro ao criar paciente:", error)
    return NextResponse.json({ error: "Erro ao criar paciente" }, { status: 500 })
  }
}
