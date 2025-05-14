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
import { DiagnosticoResultados } from "@/components/diagnostico-resultado"

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

