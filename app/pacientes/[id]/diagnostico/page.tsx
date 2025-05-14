"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Brain, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DiagnosticoAI } from "@/components/diagnostico-ai"

export default function DiagnosticoPage({ params }: { params: { id: string } }) {
  const [formStep, setFormStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [diagnosticoGerado, setDiagnosticoGerado] = useState(false)

  // Simulando dados do paciente
  const paciente = {
    id: Number.parseInt(params.id),
    nome: "Maria Silva",
    idade: 45,
    sexo: "F",
    alergias: "Penicilina, Dipirona",
    medicamentos: "Losartana 50mg 1x/dia, Levotiroxina 50mcg 1x/dia",
    doencasPrevias: "Hipertensão Arterial, Hipotireoidismo",
  }

  const handleGerarDiagnostico = () => {
    setIsGenerating(true)
    // Simulando tempo de processamento da IA
    setTimeout(() => {
      setIsGenerating(false)
      setDiagnosticoGerado(true)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/pacientes/${params.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Novo Diagnóstico</h2>
            <p className="text-muted-foreground">
              Paciente: {paciente.nome} • {paciente.idade} anos • {paciente.sexo}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant={formStep === 1 ? "default" : "outline"} onClick={() => setFormStep(1)} className="w-40">
              Anamnese
            </Button>
            <Button variant={formStep === 2 ? "default" : "outline"} onClick={() => setFormStep(2)} className="w-40">
              Exame Físico
            </Button>
            <Button variant={formStep === 3 ? "default" : "outline"} onClick={() => setFormStep(3)} className="w-40">
              Exames Complementares
            </Button>
            <Button variant={formStep === 4 ? "default" : "outline"} onClick={() => setFormStep(4)} className="w-40">
              Diagnóstico
            </Button>
          </div>
        </div>

        {formStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Anamnese</CardTitle>
              <CardDescription>Coleta de informações sobre a queixa e histórico do paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="queixa-principal">Queixa Principal</Label>
                <Textarea id="queixa-principal" placeholder="Descreva a queixa principal do paciente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="historia-doenca">História da Doença Atual</Label>
                <Textarea id="historia-doenca" placeholder="Descreva a história da doença atual" rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Informações do Paciente</Label>
                  <div className="rounded-md border p-4 space-y-2">
                    <div>
                      <p className="font-medium">Alergias</p>
                      <p className="text-sm text-muted-foreground">{paciente.alergias}</p>
                    </div>
                    <div>
                      <p className="font-medium">Medicamentos em Uso</p>
                      <p className="text-sm text-muted-foreground">{paciente.medicamentos}</p>
                    </div>
                    <div>
                      <p className="font-medium">Doenças Prévias</p>
                      <p className="text-sm text-muted-foreground">{paciente.doencasPrevias}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicamentos-atuais">Medicamentos Atuais</Label>
                  <Textarea id="medicamentos-atuais" placeholder="Atualize os medicamentos em uso" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitos">Hábitos</Label>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="tabagismo">Tabagismo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="ex">Ex-tabagista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="etilismo">Etilismo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="frequente">Frequente</SelectItem>
                        <SelectItem value="ex">Ex-etilista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="atividade-fisica">Atividade Física</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário</SelectItem>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="moderada">Moderada</SelectItem>
                        <SelectItem value="intensa">Intensa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspectos-psicossociais">Aspectos Psicossociais</Label>
                <Textarea
                  id="aspectos-psicossociais"
                  placeholder="Descreva aspectos psicológicos e sociais relevantes"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/pacientes/${params.id}`}>Cancelar</Link>
              </Button>
              <Button onClick={() => setFormStep(2)}>Próximo</Button>
            </CardFooter>
          </Card>
        )}

        {formStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Exame Físico</CardTitle>
              <CardDescription>Registro dos achados do exame físico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sinais Vitais</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="pa">Pressão Arterial (mmHg)</Label>
                    <Input id="pa" placeholder="Ex: 120/80" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fc">Frequência Cardíaca (bpm)</Label>
                    <Input id="fc" placeholder="Ex: 80" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fr">Frequência Respiratória (irpm)</Label>
                    <Input id="fr" placeholder="Ex: 16" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="temperatura">Temperatura (°C)</Label>
                    <Input id="temperatura" placeholder="Ex: 36.5" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input id="peso" placeholder="Ex: 70" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="altura">Altura (m)</Label>
                    <Input id="altura" placeholder="Ex: 1.70" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="imc">IMC (kg/m²)</Label>
                    <Input id="imc" placeholder="Calculado automaticamente" disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="saturacao">Saturação O₂ (%)</Label>
                    <Input id="saturacao" placeholder="Ex: 98" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado Geral</Label>
                <RadioGroup defaultValue="beg" className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beg" id="beg" />
                    <Label htmlFor="beg">BEG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reg" id="reg" />
                    <Label htmlFor="reg">REG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="meg" id="meg" />
                    <Label htmlFor="meg">MEG</Label>
                  </div>
                </RadioGroup>
              </div>

              <Tabs defaultValue="geral">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="cabeca">Cabeça/Pescoço</TabsTrigger>
                  <TabsTrigger value="torax">Tórax</TabsTrigger>
                  <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
                  <TabsTrigger value="abdome">Abdome</TabsTrigger>
                  <TabsTrigger value="extremidades">Extremidades</TabsTrigger>
                  <TabsTrigger value="neurologico">Neurológico</TabsTrigger>
                  <TabsTrigger value="pele">Pele</TabsTrigger>
                </TabsList>
                <TabsContent value="geral" className="space-y-2 mt-4">
                  <Label htmlFor="exame-geral">Exame Geral</Label>
                  <Textarea id="exame-geral" placeholder="Descreva os achados gerais" />
                </TabsContent>
                <TabsContent value="cabeca" className="space-y-2 mt-4">
                  <Label htmlFor="exame-cabeca">Cabeça e Pescoço</Label>
                  <Textarea id="exame-cabeca" placeholder="Descreva os achados em cabeça e pescoço" />
                </TabsContent>
                <TabsContent value="torax" className="space-y-2 mt-4">
                  <Label htmlFor="exame-torax">Tórax</Label>
                  <Textarea id="exame-torax" placeholder="Descreva os achados torácicos" />
                </TabsContent>
                <TabsContent value="cardiovascular" className="space-y-2 mt-4">
                  <Label htmlFor="exame-cardiovascular">Sistema Cardiovascular</Label>
                  <Textarea id="exame-cardiovascular" placeholder="Descreva os achados cardiovasculares" />
                </TabsContent>
                <TabsContent value="abdome" className="space-y-2 mt-4">
                  <Label htmlFor="exame-abdome">Abdome</Label>
                  <Textarea id="exame-abdome" placeholder="Descreva os achados abdominais" />
                </TabsContent>
                <TabsContent value="extremidades" className="space-y-2 mt-4">
                  <Label htmlFor="exame-extremidades">Extremidades</Label>
                  <Textarea id="exame-extremidades" placeholder="Descreva os achados nas extremidades" />
                </TabsContent>
                <TabsContent value="neurologico" className="space-y-2 mt-4">
                  <Label htmlFor="exame-neurologico">Exame Neurológico</Label>
                  <Textarea id="exame-neurologico" placeholder="Descreva os achados neurológicos" />
                </TabsContent>
                <TabsContent value="pele" className="space-y-2 mt-4">
                  <Label htmlFor="exame-pele">Pele e Anexos</Label>
                  <Textarea id="exame-pele" placeholder="Descreva os achados na pele e anexos" />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setFormStep(1)}>
                Voltar
              </Button>
              <Button onClick={() => setFormStep(3)}>Próximo</Button>
            </CardFooter>
          </Card>
        )}

        {formStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Exames Complementares</CardTitle>
              <CardDescription>Registro dos resultados de exames complementares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="laboratoriais">
                <TabsList>
                  <TabsTrigger value="laboratoriais">Laboratoriais</TabsTrigger>
                  <TabsTrigger value="imagem">Imagem</TabsTrigger>
                  <TabsTrigger value="funcionais">Funcionais</TabsTrigger>
                </TabsList>
                <TabsContent value="laboratoriais" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="hemograma">Hemograma</Label>
                    <Textarea id="hemograma" placeholder="Descreva os resultados do hemograma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bioquimica">Bioquímica</Label>
                    <Textarea id="bioquimica" placeholder="Descreva os resultados de exames bioquímicos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outros-lab">Outros Exames Laboratoriais</Label>
                    <Textarea id="outros-lab" placeholder="Descreva outros resultados laboratoriais" />
                  </div>
                </TabsContent>
                <TabsContent value="imagem" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="raio-x">Raio-X</Label>
                    <Textarea id="raio-x" placeholder="Descreva os resultados de raio-x" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ultrassom">Ultrassonografia</Label>
                    <Textarea id="ultrassom" placeholder="Descreva os resultados de ultrassonografia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tomografia">Tomografia</Label>
                    <Textarea id="tomografia" placeholder="Descreva os resultados de tomografia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ressonancia">Ressonância Magnética</Label>
                    <Textarea id="ressonancia" placeholder="Descreva os resultados de ressonância magnética" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outros-imagem">Outros Exames de Imagem</Label>
                    <Textarea id="outros-imagem" placeholder="Descreva outros resultados de exames de imagem" />
                  </div>
                </TabsContent>
                <TabsContent value="funcionais" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="eletrocardiograma">Eletrocardiograma</Label>
                    <Textarea id="eletrocardiograma" placeholder="Descreva os resultados do eletrocardiograma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="espirometria">Espirometria</Label>
                    <Textarea id="espirometria" placeholder="Descreva os resultados da espirometria" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outros-funcionais">Outros Exames Funcionais</Label>
                    <Textarea id="outros-funcionais" placeholder="Descreva outros resultados de exames funcionais" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setFormStep(2)}>
                Voltar
              </Button>
              <Button onClick={() => setFormStep(4)}>Próximo</Button>
            </CardFooter>
          </Card>
        )}

        {formStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico</CardTitle>
              <CardDescription>Análise e conclusão diagnóstica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!diagnosticoGerado ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hipoteses">Hipóteses Diagnósticas</Label>
                    <Textarea id="hipoteses" placeholder="Liste as hipóteses diagnósticas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnostico-principal">Diagnóstico Principal</Label>
                    <Textarea id="diagnostico-principal" placeholder="Descreva o diagnóstico principal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosticos-secundarios">Diagnósticos Secundários</Label>
                    <Textarea id="diagnosticos-secundarios" placeholder="Liste os diagnósticos secundários" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plano-terapeutico">Plano Terapêutico</Label>
                    <Textarea id="plano-terapeutico" placeholder="Descreva o plano terapêutico" rows={4} />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGerarDiagnostico}
                      className="flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Gerando Diagnóstico...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Gerar Diagnóstico com IA
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <DiagnosticoAI />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setFormStep(3)}>
                Voltar
              </Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Diagnóstico
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
