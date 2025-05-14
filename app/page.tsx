"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Brain, MessageSquare, Stethoscope, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type ConsultaRecente = {
  id: number
  paciente_id: number
  nome_paciente: string
  data_consulta: string
  diagnostico_principal?: string
  status: string
}

export default function HomePage() {
  const [consultasRecentes, setConsultasRecentes] = useState<ConsultaRecente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/consultas")

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`)
        }

        const data = await response.json()

        // Garantir que data seja um array
        if (Array.isArray(data)) {
          setConsultasRecentes(data)
        } else if (data.error) {
          throw new Error(data.error)
        } else {
          setConsultasRecentes([])
        }
      } catch (error) {
        console.error("Erro ao buscar consultas:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
        setConsultasRecentes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsultas()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">MedDiagnosis AI</h1>
            <p className="text-muted-foreground">
              Diagnóstico médico assistido por IA através de uma interface conversacional
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Diagnóstico Rápido
                </CardTitle>
                <CardDescription>
                  Inicie uma nova consulta e obtenha diagnósticos diferenciais em minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/diagnostico/novo">
                  <Button className="w-full">
                    Iniciar Diagnóstico
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Pacientes
                </CardTitle>
                <CardDescription>Acesse o histórico de pacientes e diagnósticos anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pacientes">
                  <Button variant="outline" className="w-full">
                    Ver Pacientes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Base de Conhecimento
                </CardTitle>
                <CardDescription>Consulte diretrizes clínicas e evidências médicas atualizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/conhecimento">
                  <Button variant="outline" className="w-full">
                    Acessar Conhecimento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diagnósticos Recentes</CardTitle>
              <CardDescription>Últimos diagnósticos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                    ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Erro ao carregar diagnósticos: {error}</div>
              ) : consultasRecentes.length > 0 ? (
                <div className="space-y-4">
                  {consultasRecentes.map((consulta) => (
                    <div key={consulta.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{consulta.nome_paciente}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(consulta.data_consulta).toLocaleDateString("pt-BR")} •{" "}
                          {consulta.diagnostico_principal || "Diagnóstico em andamento"}
                        </p>
                      </div>
                      <Link href={`/diagnostico/${consulta.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Nenhum diagnóstico recente encontrado.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
