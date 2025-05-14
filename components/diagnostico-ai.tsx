"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsDown, ThumbsUp } from "lucide-react"

export function DiagnosticoAI() {
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
          <div className="text-lg font-semibold text-green-700 dark:text-green-400">Gastrite Aguda</div>
          <p className="text-sm text-muted-foreground mt-2">
            Inflamação aguda da mucosa gástrica, caracterizada por dor epigástrica, náuseas e desconforto abdominal.
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
          <p className="text-sm text-muted-foreground">
            Diagnósticos diferenciais ordenados por probabilidade, baseados nos dados clínicos fornecidos:
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Úlcera Péptica</span>
                <span className="text-sm">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Lesão na mucosa gástrica ou duodenal que pode causar sintomas semelhantes, mas geralmente com dor mais
                localizada e que pode melhorar ou piorar com alimentação.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Doença do Refluxo Gastroesofágico</span>
                <span className="text-sm">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Refluxo do conteúdo gástrico para o esôfago, causando sintomas como azia, regurgitação e dor
                retroesternal, que podem mimetizar gastrite.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Dispepsia Funcional</span>
                <span className="text-sm">62%</span>
              </div>
              <Progress value={62} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Desconforto ou dor na região epigástrica sem causa orgânica identificável, com sintomas semelhantes à
                gastrite.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Colelitíase</span>
                <span className="text-sm">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Presença de cálculos na vesícula biliar, que pode causar dor abdominal, especialmente após refeições
                gordurosas.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Pancreatite Aguda</span>
                <span className="text-sm">30%</span>
              </div>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Inflamação do pâncreas que pode causar dor abdominal intensa, irradiada para as costas, com náuseas e
                vômitos.
              </p>
            </div>
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
                <div>
                  <p className="font-medium text-sm">Queixa Principal</p>
                  <p className="text-sm text-muted-foreground">
                    Dor epigástrica em queimação há 3 dias, pior após refeições
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Sintomas Associados</p>
                  <p className="text-sm text-muted-foreground">
                    Náuseas, sensação de plenitude gástrica, piora com alimentos condimentados
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Fatores Relevantes</p>
                  <p className="text-sm text-muted-foreground">
                    Uso recente de anti-inflamatórios, estresse aumentado no trabalho
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Exame Físico</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                <div>
                  <p className="font-medium text-sm">Abdome</p>
                  <p className="text-sm text-muted-foreground">
                    Dor à palpação em epigástrio, sem sinais de irritação peritoneal
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Sinais Vitais</p>
                  <p className="text-sm text-muted-foreground">Dentro dos limites da normalidade</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Exames Complementares</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                <div>
                  <p className="font-medium text-sm">Endoscopia Digestiva Alta</p>
                  <p className="text-sm text-muted-foreground">
                    Mucosa gástrica hiperemiada com áreas de erosão superficial
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Teste para H. pylori</p>
                  <p className="text-sm text-muted-foreground">Positivo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recomendacoes" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Recomendações baseadas em evidências e diretrizes clínicas atuais:
          </p>

          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Tratamento Farmacológico</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                <div>
                  <p className="font-medium text-sm">Inibidor de Bomba de Prótons</p>
                  <p className="text-sm text-muted-foreground">Omeprazol 40mg, 1x ao dia, por 4 semanas</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Erradicação do H. pylori</p>
                  <p className="text-sm text-muted-foreground">
                    Terapia tripla: Amoxicilina 1g 2x/dia + Claritromicina 500mg 2x/dia + IBP 2x/dia por 14 dias
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Antiemético (se necessário)</p>
                  <p className="text-sm text-muted-foreground">
                    Metoclopramida 10mg, até 3x ao dia, se náuseas persistentes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Recomendações Não Farmacológicas</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                <div>
                  <p className="font-medium text-sm">Dieta</p>
                  <p className="text-sm text-muted-foreground">
                    Evitar alimentos irritantes (condimentados, ácidos, café, álcool), fazer refeições menores e mais
                    frequentes
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Estilo de Vida</p>
                  <p className="text-sm text-muted-foreground">
                    Redução do estresse, evitar deitar-se logo após as refeições, parar de fumar
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Acompanhamento</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-2">
                <div>
                  <p className="font-medium text-sm">Retorno</p>
                  <p className="text-sm text-muted-foreground">Em 4 semanas para avaliação da resposta ao tratamento</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Exames de Controle</p>
                  <p className="text-sm text-muted-foreground">
                    Teste respiratório para H. pylori após 4 semanas do término do tratamento
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Sinais de Alerta</p>
                  <p className="text-sm text-muted-foreground">
                    Orientar retorno imediato se: vômitos persistentes, hematêmese, melena, dor intensa que não melhora
                    com medicação
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <ThumbsDown className="h-4 w-4" />
          Discordo
        </Button>
        <Button className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4" />
          Concordo
        </Button>
      </div>
    </div>
  )
}
