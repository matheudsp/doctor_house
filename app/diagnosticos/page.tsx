import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"

export default function DiagnosticosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Diagnósticos</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar diagnósticos..." className="pl-8" />
          </div>
          <Button variant="outline">Filtrar</Button>
        </div>

        <Tabs defaultValue="recentes">
          <TabsList>
            <TabsTrigger value="recentes">Recentes</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          <TabsContent value="recentes">
            <Card>
              <CardHeader>
                <CardTitle>Diagnósticos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      paciente: "Maria Silva",
                      data: "12/05/2025",
                      diagnostico: "Gastrite Aguda",
                      medico: "Dr. Carlos Santos",
                    },
                    {
                      id: 2,
                      paciente: "João Santos",
                      data: "12/05/2025",
                      diagnostico: "Bronquite Aguda",
                      medico: "Dr. Carlos Santos",
                    },
                    {
                      id: 3,
                      paciente: "Ana Oliveira",
                      data: "11/05/2025",
                      diagnostico: "Enxaqueca",
                      medico: "Dra. Ana Ferreira",
                    },
                    {
                      id: 4,
                      paciente: "Carlos Pereira",
                      data: "11/05/2025",
                      diagnostico: "Lombalgia",
                      medico: "Dr. Paulo Oliveira",
                    },
                    {
                      id: 5,
                      paciente: "Lúcia Ferreira",
                      data: "10/05/2025",
                      diagnostico: "Síndrome do Intestino Irritável",
                      medico: "Dr. Carlos Santos",
                    },
                    {
                      id: 6,
                      paciente: "Roberto Almeida",
                      data: "09/05/2025",
                      diagnostico: "Hipertensão Arterial",
                      medico: "Dr. Carlos Santos",
                    },
                    {
                      id: 7,
                      paciente: "Fernanda Lima",
                      data: "08/05/2025",
                      diagnostico: "Hipotireoidismo",
                      medico: "Dra. Ana Ferreira",
                    },
                    {
                      id: 8,
                      paciente: "Paulo Souza",
                      data: "07/05/2025",
                      diagnostico: "Sinusite",
                      medico: "Dr. Carlos Santos",
                    },
                    {
                      id: 9,
                      paciente: "Camila Costa",
                      data: "06/05/2025",
                      diagnostico: "Transtorno de Ansiedade",
                      medico: "Dra. Juliana Mendes",
                    },
                    {
                      id: 10,
                      paciente: "Ricardo Martins",
                      data: "05/05/2025",
                      diagnostico: "Diabetes Mellitus Tipo 2",
                      medico: "Dr. Carlos Santos",
                    },
                  ].map((diagnostico) => (
                    <div key={diagnostico.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{diagnostico.paciente}</p>
                        <p className="text-sm text-muted-foreground">
                          {diagnostico.data} • {diagnostico.diagnostico}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Médico: {diagnostico.medico}</p>
                        <Link href={`/diagnosticos/${diagnostico.id}`}>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Diagnósticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Use os filtros acima para buscar diagnósticos específicos.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
