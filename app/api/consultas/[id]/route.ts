import { type NextRequest, NextResponse } from "next/server"
import { getConsultaById, getMensagensByConsultaId, updateConsulta } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const consulta = await getConsultaById(id)

    if (!consulta) {
      return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 })
    }

    // Buscar mensagens da consulta
    const mensagens = await getMensagensByConsultaId(id)

    return NextResponse.json({ consulta, mensagens })
  } catch (error) {
    console.error("Erro ao buscar consulta:", error)
    return NextResponse.json({ error: "Erro ao buscar consulta" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const data = await request.json()
    const consulta = await updateConsulta(id, data)

    if (!consulta) {
      return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(consulta)
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error)
    return NextResponse.json({ error: "Erro ao atualizar consulta" }, { status: 500 })
  }
}
