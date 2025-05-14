"use client"

import type React from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type Paciente = {
  id: number
  nome: string
  data_nascimento?: string
  sexo?: string
  email?: string
  telefone?: string
  created_at: string
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    sexo: "",
    email: "",
    telefone: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch("/api/pacientes")
        if (response.ok) {
          const data = await response.json()
          setPacientes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPacientes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const novoPaciente = await response.json()
        setPacientes((prev) => [...prev, novoPaciente])
        setIsDialogOpen(false)
        setFormData({
          nome: "",
          data_nascimento: "",
          sexo: "",
          email: "",
          telefone: "",
        })
        toast({
          title: "Paciente cadastrado",
          description: "O paciente foi cadastrado com sucesso.",
        })
      } else {
        throw new Error("Erro ao cadastrar paciente")
      }
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o paciente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.telefone?.includes(searchTerm),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                <DialogDescription>Preencha os dados do paciente para cadastrá-lo no sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                      <Input
                        id="data_nascimento"
                        name="data_nascimento"
                        type="date"
                        value={formData.data_nascimento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sexo">Sexo</Label>
                      <Select value={formData.sexo} onValueChange={(value) => handleSelectChange("sexo", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Cadastrar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-60" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredPacientes.length > 0 ? (
              <div className="space-y-4">
                {filteredPacientes.map((paciente) => (
                  <div key={paciente.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{paciente.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {paciente.data_nascimento && new Date(paciente.data_nascimento).toLocaleDateString("pt-BR")}
                        {paciente.sexo && ` • ${paciente.sexo === "M" ? "Masculino" : "Feminino"}`}
                        {paciente.telefone && ` • ${paciente.telefone}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/pacientes/${paciente.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/diagnostico/novo?paciente=${paciente.id}`}>
                        <Button size="sm" className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Diagnóstico
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Nenhum paciente encontrado.</div>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
