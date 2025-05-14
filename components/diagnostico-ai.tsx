"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { DiagnosticResponse } from "@/lib/aimlapi"
import { useState } from "react"

interface DiagnosticoAIProps {
  diagnostico: DiagnosticResponse | null;
  onFeedback?: (feedback: "concordo" | "discordo") => void;
}

export function DiagnosticoAI({ diagnostico, onFeedback }: DiagnosticoAIProps) {
  const [activeTab, setActiveTab] = useState("diferenciais")

  // Se não houver diagnóstico, mostrar mensagem de carregamento ou placeholder
  if (!diagnostico) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Aguardando diagnóstico...</p>
      </div>
    )
  }

  const handleFeedback = (tipo: "concordo" | "discordo") => {
    if (onFeedback) {
      onFeedback(tipo)
    }
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
          <CardDescription>
            Baseado nos dados fornecidos, a IA identificou o seguinte diagnóstico principal
          </CardDescription>
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

      <Tabs defaultValue="diferenciais" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="diferenciais">Diagnósticos Diferenciais</TabsTrigger>
          <TabsTrigger value="evidencias">Evidências Clínicas</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
        </TabsList>
        <TabsContent value="diferenciais" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Diagnósticos diferenciais ordenados por probabilidade, baseados nos dados clínicos fornecidos:
          </p>

          <div className="space-y-4">
            {diagnostico.diagnosticosDiferenciais.map((diferencial, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{diferencial.nome}</span>
                  <span className="text-sm">{diferencial.probabilidade}%</span>
                </div>
                <Progress value={diferencial.probabilidade} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {diferencial.descricao}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evidencias" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Evidências que suportam o diagnóstico principal:</p>

          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Dados da Anamnese</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                {diagnostico.evidencias.sintomas.map((sintoma, index) => (
                  <div key={index}>
                    <p className="font-medium text-sm">
                      {index === 0 ? "Queixa Principal" : index === 1 ? "Sintomas Associados" : "Outros Sintomas"}
                    </p>
                    <p className="text-sm text-muted-foreground">{sintoma}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Exame Físico</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                {diagnostico.evidencias.exameFisico.map((achado, index) => (
                  <div key={index}>
                    <p className="font-medium text-sm">
                      {index === 0 ? "Achados Principais" : `Achado ${index + 1}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{achado}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {diagnostico.evidencias.examesComplementares.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Exames Complementares</CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-2">
                  {diagnostico.evidencias.examesComplementares.map((exame, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">
                        {index === 0 ? "Exame Principal" : `Exame ${index + 1}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{exame}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recomendacoes" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Recomendações baseadas em evidências e diretrizes clínicas atuais:
          </p>

          <div className="space-y-4">
            {diagnostico.recomendacoes.tratamentoFarmacologico.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Tratamento Farmacológico</CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-2">
                  {diagnostico.recomendacoes.tratamentoFarmacologico.map((tratamento, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">
                        {index === 0 ? "Medicação Principal" : `Medicação ${index + 1}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{tratamento}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {diagnostico.recomendacoes.tratamentoNaoFarmacologico.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Recomendações Não Farmacológicas</CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-2">
                  {diagnostico.recomendacoes.tratamentoNaoFarmacologico.map((recomendacao, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">
                        {index === 0 ? "Recomendação Principal" : `Recomendação ${index + 1}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{recomendacao}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {diagnostico.recomendacoes.acompanhamento.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Acompanhamento</CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-2">
                  {diagnostico.recomendacoes.acompanhamento.map((item, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">
                        {index === 0 ? "Retorno" : index === 1 ? "Exames de Controle" : "Recomendações Adicionais"}
                      </p>
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {diagnostico.examesAdicionais && diagnostico.examesAdicionais.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Exames Adicionais Recomendados</CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-2">
                  {diagnostico.examesAdicionais.map((exame, index) => (
                    <div key={index}>
                      <p className="text-sm text-muted-foreground">{exame}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => handleFeedback("discordo")}
        >
          <ThumbsDown className="h-4 w-4" />
          Discordo
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={() => handleFeedback("concordo")}
        >
          <ThumbsUp className="h-4 w-4" />
          Concordo
        </Button>
      </div>
    </div>
  )
}