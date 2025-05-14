"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"

interface DiagnosticoEvidence {
  sintomas: string[]
  exameFisico: string[]
  examesComplementares: string[]
}

interface DiagnosticoRecommendation {
  tratamentoFarmacologico: string[]
  tratamentoNaoFarmacologico: string[]
  acompanhamento: string[]
}

interface DiagnosticoDifferential {
  nome: string
  probabilidade: number
  descricao: string
}

interface DiagnosticoData {
  diagnosticoPrincipal: {
    nome: string
    descricao: string
  }
  diagnosticosDiferenciais: DiagnosticoDifferential[]
  evidencias: DiagnosticoEvidence
  recomendacoes: DiagnosticoRecommendation
  examesAdicionais: string[]
}

interface DiagnosticoResultadosProps {
  diagnosticoData?: DiagnosticoData
  consultaId?: number
  onSave?: () => void
  onEdit?: () => void
}

export function DiagnosticoResultados({ 
  diagnosticoData, 
  consultaId, 
  onSave, 
  onEdit 
}: DiagnosticoResultadosProps) {
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (diagnosticoData) {
      setDiagnostico(diagnosticoData)
    } else if (consultaId) {
      fetchDiagnostico(consultaId)
    }
  }, [diagnosticoData, consultaId])

  const fetchDiagnostico = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/consultas/${id}/diagnostico`)
      if (!response.ok) throw new Error('Falha ao buscar diagnóstico')
      const data = await response.json()
      setDiagnostico(data)
    } catch (error) {
      console.error("Erro ao buscar diagnóstico:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDiagnostico = async () => {
    if (!consultaId || !diagnostico) return
    
    setIsLoading(true)
    try {
      await fetch(`/api/consultas/${consultaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnostico_principal: diagnostico.diagnosticoPrincipal.nome,
          diagnosticos_diferenciais: diagnostico.diagnosticosDiferenciais,
          recomendacoes: diagnostico.recomendacoes,
          status: "concluida"
        }),
      })
      
      if (onSave) onSave()
    } catch (error) {
      console.error("Erro ao salvar diagnóstico:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando resultados...</div>
  }

  if (!diagnostico) {
    return <div className="flex justify-center p-8">Nenhum diagnóstico disponível</div>
  }

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
          <p className="text-sm text-muted-foreground mt-2">
            {diagnostico.diagnosticoPrincipal.descricao}
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
              {diagnostico.diagnosticosDiferenciais.map((diagDiff, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{diagDiff.nome}</p>
                    <p className="text-sm">{diagDiff.probabilidade}%</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {diagDiff.descricao}
                  </p>
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
              {diagnostico.evidencias.sintomas.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Sintomas Relatados</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.evidencias.sintomas.map((sintoma, index) => (
                      <li key={index}>{sintoma}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {diagnostico.evidencias.exameFisico.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Achados do Exame Físico</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.evidencias.exameFisico.map((achado, index) => (
                      <li key={index}>{achado}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {diagnostico.evidencias.examesComplementares.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Exames Complementares</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.evidencias.examesComplementares.map((exame, index) => (
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
              {diagnostico.recomendacoes.tratamentoFarmacologico.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Tratamento Farmacológico</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.recomendacoes.tratamentoFarmacologico.map((tratamento, index) => (
                      <li key={index}>{tratamento}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {diagnostico.recomendacoes.tratamentoNaoFarmacologico.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Medidas Não Farmacológicas</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.recomendacoes.tratamentoNaoFarmacologico.map((medida, index) => (
                      <li key={index}>{medida}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {diagnostico.recomendacoes.acompanhamento.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Acompanhamento</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.recomendacoes.acompanhamento.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {diagnostico.examesAdicionais.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Exames Adicionais Recomendados</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {diagnostico.examesAdicionais.map((exame, index) => (
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
        <Button variant="outline" onClick={onEdit} disabled={isLoading}>
          Editar Diagnóstico
        </Button>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleSaveDiagnostico}
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          Salvar Diagnóstico
        </Button>
      </div>
    </div>
  )
}