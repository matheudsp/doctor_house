"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function DiagnosticoPage() {
  const [diagnosticoCompleto, setDiagnosticoCompleto] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")

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
            <h2 className="text-3xl font-bold tracking-tight">Diagnóstico Assistido</h2>
            <p className="text-muted-foreground">
              Converse com a IA para obter diagnósticos diferenciais baseados em evidências
            </p>
          </div>
        </div>

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
                <ChatInterface
                  onDiagnosticoCompleto={() => {
                    setDiagnosticoCompleto(true)
                    setActiveTab("resultados")
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resultados" className="mt-4">
            <DiagnosticoResultados />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}

function DiagnosticoResultados() {
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
            Pneumonia Adquirida na Comunidade
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Infecção do parênquima pulmonar causada por agentes infecciosos adquiridos fora do ambiente hospitalar.
          </p>
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">Bronquite Aguda</p>
                  <p className="text-sm">70%</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inflamação dos brônquios, geralmente causada por infecção viral, com tosse produtiva como sintoma
                  principal.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">COVID-19</p>
                  <p className="text-sm">65%</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Infecção viral causada pelo SARS-CoV-2, com sintomas respiratórios e sistêmicos variáveis.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">Exacerbação de Asma</p>
                  <p className="text-sm">45%</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Piora aguda dos sintomas de asma, com aumento da dispneia, tosse e sibilância.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">Sinusite Aguda</p>
                  <p className="text-sm">30%</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inflamação dos seios paranasais, geralmente secundária a infecção viral ou bacteriana.
                </p>
              </div>
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
              <div>
                <h3 className="font-medium mb-2">Sintomas Relatados</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Febre (38.5°C) há 3 dias</li>
                  <li>Tosse produtiva com expectoração amarelada</li>
                  <li>Dispneia aos médios esforços</li>
                  <li>Dor torácica ventilatório-dependente</li>
                  <li>Fadiga e mal-estar geral</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Achados do Exame Físico</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Estertores crepitantes em base pulmonar direita</li>
                  <li>Taquipneia (FR: 24 irpm)</li>
                  <li>Saturação de O₂: 94% em ar ambiente</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Exames Complementares</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Leucocitose (12.500/mm³) com desvio à esquerda</li>
                  <li>Proteína C reativa elevada</li>
                  <li>Radiografia de tórax com infiltrado alveolar em lobo inferior direito</li>
                </ul>
              </div>
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
              <div>
                <h3 className="font-medium mb-2">Tratamento Farmacológico</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Amoxicilina + Clavulanato 875/125mg, 12/12h, por 7 dias</li>
                  <li>Ou Azitromicina 500mg, 1x/dia, por 5 dias (alternativa)</li>
                  <li>Antitérmicos/analgésicos se necessário (Dipirona ou Paracetamol)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Medidas Não Farmacológicas</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Hidratação adequada (≥ 2L/dia)</li>
                  <li>Repouso relativo</li>
                  <li>Monitorização da saturação de O₂ (se disponível)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Acompanhamento</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Retorno em 48-72h para reavaliação clínica</li>
                  <li>Orientar sobre sinais de alarme que indicam necessidade de atendimento imediato</li>
                  <li>Considerar radiografia de controle após 4-6 semanas em casos selecionados</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Editar Diagnóstico</Button>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Diagnóstico
        </Button>
      </div>
    </div>
  )
}
