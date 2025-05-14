import { type NextRequest, NextResponse } from "next/server"
import { getPacienteById, getConsultasByPacienteId } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const paciente = await getPacienteById(id)

    if (!paciente) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 })
    }

    // Buscar consultas do paciente
    const consultas = await getConsultasByPacienteId(id)

    return NextResponse.json({ paciente, consultas })
  } catch (error) {
    console.error("Erro ao buscar paciente:", error)
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 })
  }
}
