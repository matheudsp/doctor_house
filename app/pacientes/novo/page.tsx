"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NovoPacientePage() {
  const [formStep, setFormStep] = useState(1)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center gap-2">
          <Link href="/pacientes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Novo Paciente</h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant={formStep === 1 ? "default" : "outline"} onClick={() => setFormStep(1)} className="w-40">
              Dados Pessoais
            </Button>
            <Button variant={formStep === 2 ? "default" : "outline"} onClick={() => setFormStep(2)} className="w-40">
              Histórico Médico
            </Button>
            <Button variant={formStep === 3 ? "default" : "outline"} onClick={() => setFormStep(3)} className="w-40">
              Aspectos Psicossociais
            </Button>
          </div>
        </div>

        {formStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Informações básicas do paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Nome completo do paciente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                  <Input id="data-nascimento" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <RadioGroup defaultValue="feminino" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feminino" id="feminino" />
                      <Label htmlFor="feminino">Feminino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="masculino" id="masculino" />
                      <Label htmlFor="masculino">Masculino</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Endereço completo" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/pacientes">Cancelar</Link>
              </Button>
              <Button onClick={() => setFormStep(2)}>Próximo</Button>
            </CardFooter>
          </Card>
        )}

        {formStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico Médico</CardTitle>
              <CardDescription>Informações sobre o histórico de saúde do paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Textarea id="alergias" placeholder="Liste as alergias conhecidas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicamentos">Medicamentos em Uso</Label>
                <Textarea id="medicamentos" placeholder="Liste os medicamentos em uso atual" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doencas-previas">Doenças Prévias</Label>
                <Textarea id="doencas-previas" placeholder="Liste as doenças prévias ou crônicas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cirurgias">Cirurgias Realizadas</Label>
                <Textarea id="cirurgias" placeholder="Liste as cirurgias realizadas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="historico-familiar">Histórico Familiar</Label>
                <Textarea id="historico-familiar" placeholder="Descreva o histórico familiar de doenças" />
              </div>
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
              <CardTitle>Aspectos Psicossociais</CardTitle>
              <CardDescription>Informações sobre aspectos psicológicos e sociais do paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ocupacao">Ocupação</Label>
                <Input id="ocupacao" placeholder="Ocupação atual" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado-civil">Estado Civil</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitos">Hábitos de Vida</Label>
                <Textarea
                  id="habitos"
                  placeholder="Descreva hábitos como tabagismo, etilismo, atividade física, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicoes-moradia">Condições de Moradia</Label>
                <Textarea id="condicoes-moradia" placeholder="Descreva as condições de moradia do paciente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suporte-familiar">Suporte Familiar</Label>
                <Textarea id="suporte-familiar" placeholder="Descreva o suporte familiar disponível" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saude-mental">Saúde Mental</Label>
                <Textarea id="saude-mental" placeholder="Descreva aspectos relevantes da saúde mental" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setFormStep(2)}>
                Voltar
              </Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Paciente
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
