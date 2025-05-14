"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type Paciente = {
  id: number
  nome: string
  data_nascimento?: string
  sexo?: string
  email?: string
  telefone?: string
  created_at: string
}

type Consulta = {
  id: number
  data_consulta: string
  status: string
  diagnostico_principal?: string
}

export default function PacienteDetalhesPage({ params }: { params: { id: string } }) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await fetch(`/api/pacientes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPaciente(data.paciente)
          setConsultas(data.consultas)
        }
      } catch (error) {
        console.error("Erro ao buscar paciente:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaciente()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/pacientes">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/pacientes">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Paciente não encontrado</h2>
          </div>
          <p className="text-muted-foreground">
            O paciente solicitado não foi encontrado. Verifique o ID e tente novamente.
          </p>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/pacientes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{paciente.nome}</h2>
            <p className="text-muted-foreground">
              {paciente.data_nascimento && new Date(paciente.data_nascimento).toLocaleDateString("pt-BR")}
              {paciente.sexo && ` • ${paciente.sexo === "M" ? "Masculino" : "Feminino"}`}
              {paciente.telefone && ` • ${paciente.telefone}`}
            </p>
          </div>
          <div className="ml-auto">
            <Link href={`/diagnostico/novo?paciente=${paciente.id}`}>
              <Button className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Novo Diagnóstico
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Nome</p>
                  <p className="text-muted-foreground">{paciente.nome}</p>
                </div>
                {paciente.data_nascimento && (
                  <div>
                    <p className="font-medium">Data de Nascimento</p>
                    <p className="text-muted-foreground">
                      {new Date(paciente.data_nascimento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
                {paciente.sexo && (
                  <div>
                    <p className="font-medium">Sexo</p>
                    <p className="text-muted-foreground">{paciente.sexo === "M" ? "Masculino" : "Feminino"}</p>
                  </div>
                )}
                {paciente.email && (
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-muted-foreground">{paciente.email}</p>
                  </div>
                )}
                {paciente.telefone && (
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-muted-foreground">{paciente.telefone}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Cadastrado em</p>
                  <p className="text-muted-foreground">{new Date(paciente.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultas">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                {consultas.length > 0 ? (
                  <div className="space-y-4">
                    {consultas.map((consulta) => (
                      <div key={consulta.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{new Date(consulta.data_consulta).toLocaleDateString("pt-BR")}</p>
                          <p className="text-sm text-muted-foreground">
                            {consulta.diagnostico_principal || "Diagnóstico em andamento"}
                            {" • "}
                            {consulta.status === "em_andamento"
                              ? "Em andamento"
                              : consulta.status === "concluida"
                                ? "Concluída"
                                : "Arquivada"}
                          </p>
                        </div>
                        <Link href={`/diagnostico/${consulta.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma consulta registrada para este paciente.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
