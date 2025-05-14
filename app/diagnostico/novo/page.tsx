"use client"

import type React from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function NovoDiagnosticoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [nomePaciente, setNomePaciente] = useState("")
  const [isCreatingPaciente, setIsCreatingPaciente] = useState(false)
  const [consultaId, setConsultaId] = useState<number | null>(null)
  const [diagnosticoCompleto, setDiagnosticoCompleto] = useState(false)
  const [diagnosticoData, setDiagnosticoData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [error, setError] = useState<string | null>(null)

  const handleCriarPaciente = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomePaciente.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do paciente.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingPaciente(true)
      setError(null)

      console.log("Criando paciente com nome:", nomePaciente)

      // 1. Criar o paciente
      const pacienteResponse = await fetch("/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: nomePaciente }),
      })

      if (!pacienteResponse.ok) {
        const errorData = await pacienteResponse.json()
        throw new Error(errorData.error || "Erro ao criar paciente")
      }

      const paciente = await pacienteResponse.json()
      console.log("Paciente criado:", paciente)

      // 2. Criar a consulta para o paciente
      const consultaResponse = await fetch("/api/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paciente_id: paciente.id }),
      })

      if (!consultaResponse.ok) {
        const errorData = await consultaResponse.json()
        throw new Error(errorData.error || "Erro ao criar consulta")
      }

      const consulta = await consultaResponse.json()
      console.log("Consulta criada:", consulta)
      setConsultaId(consulta.id)
    } catch (error) {
      console.error("Erro:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Não foi possível iniciar o diagnóstico. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingPaciente(false)
    }
  }

  const handleDiagnosticoCompleto = (diagnostico: any) => {
    setDiagnosticoData(diagnostico)
    setDiagnosticoCompleto(true)
    setActiveTab("resultados")
  }

  const handleSalvarDiagnostico = async () => {
    if (consultaId) {
      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso.",
      })

      // Redirecionar para a página de detalhes da consulta
      router.push(`/diagnostico/${consultaId}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Novo Diagnóstico</h2>
            <p className="text-muted-foreground">
              Converse com a IA para obter diagnósticos diferenciais baseados em evidências
            </p>
          </div>
        </div>

        {!consultaId ? (
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Diagnóstico</CardTitle>
              <CardDescription>Informe o nome do paciente para iniciar o diagnóstico</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarPaciente} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Paciente</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do paciente"
                    value={nomePaciente}
                    onChange={(e) => setNomePaciente(e.target.value)}
                    disabled={isCreatingPaciente}
                  />
                  <p className="text-sm text-muted-foreground">
                    As demais informações serão coletadas durante a consulta.
                  </p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isCreatingPaciente || !nomePaciente.trim()}>
                    {isCreatingPaciente ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      "Iniciar Diagnóstico"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList>
              <TabsTrigger value="chat">Consulta</TabsTrigger>
              <TabsTrigger value="resultados" disabled={!diagnosticoCompleto}>
                Resultados
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 mt-4">
              <Card className="h-[calc(100vh-250px)]">
                <CardHeader className="pb-2">
                  <CardTitle>Consulta Médica</CardTitle>
                  <CardDescription>
                    Descreva os sintomas, histórico e achados clínicos do paciente de forma conversacional
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <ChatInterface onDiagnosticoCompleto={handleDiagnosticoCompleto} consultaId={consultaId} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resultados" className="mt-4">
              {diagnosticoData && (
                <DiagnosticoResultados
                  diagnostico={diagnosticoData}
                  onSalvar={handleSalvarDiagnostico}
                  onContinuar={() => setActiveTab("chat")}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </DashboardShell>
    </div>
  )
}

function DiagnosticoResultados({
  diagnostico,
  onSalvar,
  onContinuar,
}: {
  diagnostico: any
  onSalvar: () => void
  onContinuar: () => void
}) {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-green-600 dark:text-green-400"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Diagnóstico Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-green-700 dark:text-green-400">
            {diagnostico.diagnosticoPrincipal.nome}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{diagnostico.diagnosticoPrincipal.descricao}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="diferenciais">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="diferenciais">Diagnósticos Diferenciais</TabsTrigger>
          <TabsTrigger value="evidencias">Evidências Clínicas</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
        </TabsList>
        <TabsContent value="diferenciais" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnósticos Diferenciais</CardTitle>
              <CardDescription>Ordenados por probabilidade com base nos dados fornecidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnostico.diagnosticosDiferenciais.map((diagnostico: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{diagnostico.nome}</p>
                    <p className="text-sm">{diagnostico.probabilidade}%</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{diagnostico.descricao}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidencias" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidências Clínicas</CardTitle>
              <CardDescription>Dados que suportam o diagnóstico principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnostico.evidencias.sintomas && diagnostico.evidencias.sintomas.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Sintomas Relatados</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.evidencias.sintomas.map((sintoma: string, index: number) => (
                      <li key={index}>{sintoma}</li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostico.evidencias.exameFisico && diagnostico.evidencias.exameFisico.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Achados do Exame Físico</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.evidencias.exameFisico.map((achado: string, index: number) => (
                      <li key={index}>{achado}</li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostico.evidencias.examesComplementares &&
                diagnostico.evidencias.examesComplementares.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Exames Complementares</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {diagnostico.evidencias.examesComplementares.map((exame: string, index: number) => (
                        <li key={index}>{exame}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recomendacoes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Terapêuticas</CardTitle>
              <CardDescription>Baseadas em diretrizes clínicas atuais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnostico.recomendacoes.tratamentoFarmacologico &&
                diagnostico.recomendacoes.tratamentoFarmacologico.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Tratamento Farmacológico</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {diagnostico.recomendacoes.tratamentoFarmacologico.map((tratamento: string, index: number) => (
                        <li key={index}>{tratamento}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {diagnostico.recomendacoes.tratamentoNaoFarmacologico &&
                diagnostico.recomendacoes.tratamentoNaoFarmacologico.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Medidas Não Farmacológicas</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {diagnostico.recomendacoes.tratamentoNaoFarmacologico.map((medida: string, index: number) => (
                        <li key={index}>{medida}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {diagnostico.recomendacoes.acompanhamento && diagnostico.recomendacoes.acompanhamento.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Acompanhamento</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.recomendacoes.acompanhamento.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostico.examesAdicionais && diagnostico.examesAdicionais.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Exames Adicionais Recomendados</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.examesAdicionais.map((exame: string, index: number) => (
                      <li key={index}>{exame}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onContinuar}>
          Continuar Consulta
        </Button>
        <Button className="flex items-center gap-2" onClick={onSalvar}>
          <Save className="h-4 w-4" />
          Salvar Diagnóstico
        </Button>
      </div>
    </div>
  )
}
