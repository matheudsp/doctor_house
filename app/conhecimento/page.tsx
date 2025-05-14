import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Search } from "lucide-react"

export default function ConhecimentoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar na base de conhecimento..." className="pl-8" />
          </div>
          <Button variant="outline">Filtrar</Button>
        </div>

        <Tabs defaultValue="diretrizes">
          <TabsList>
            <TabsTrigger value="diretrizes">Diretrizes Clínicas</TabsTrigger>
            <TabsTrigger value="protocolos">Protocolos</TabsTrigger>
            <TabsTrigger value="artigos">Artigos Científicos</TabsTrigger>
          </TabsList>
          <TabsContent value="diretrizes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Diretrizes Clínicas</CardTitle>
                <CardDescription>Recomendações baseadas em evidências para a prática clínica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      titulo: "Hipertensão Arterial",
                      organizacao: "Sociedade Brasileira de Cardiologia",
                      ano: "2023",
                    },
                    {
                      id: 2,
                      titulo: "Diabetes Mellitus",
                      organizacao: "Sociedade Brasileira de Diabetes",
                      ano: "2023",
                    },
                    { id: 3, titulo: "Asma", organizacao: "Sociedade Brasileira de Pneumologia", ano: "2022" },
                    {
                      id: 4,
                      titulo: "Doença de Alzheimer",
                      organizacao: "Academia Brasileira de Neurologia",
                      ano: "2022",
                    },
                    { id: 5, titulo: "Depressão", organizacao: "Associação Brasileira de Psiquiatria", ano: "2021" },
                    {
                      id: 6,
                      titulo: "Doença Pulmonar Obstrutiva Crônica",
                      organizacao: "Sociedade Brasileira de Pneumologia",
                      ano: "2021",
                    },
                    {
                      id: 7,
                      titulo: "Insuficiência Cardíaca",
                      organizacao: "Sociedade Brasileira de Cardiologia",
                      ano: "2021",
                    },
                    {
                      id: 8,
                      titulo: "Doença Renal Crônica",
                      organizacao: "Sociedade Brasileira de Nefrologia",
                      ano: "2020",
                    },
                  ].map((diretriz) => (
                    <div key={diretriz.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{diretriz.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {diretriz.organizacao} • {diretriz.ano}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="protocolos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Protocolos Clínicos</CardTitle>
                <CardDescription>Protocolos e procedimentos padronizados para condições específicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, titulo: "Protocolo de Sepse", instituicao: "Ministério da Saúde", ano: "2023" },
                    { id: 2, titulo: "Protocolo de AVC Agudo", instituicao: "Hospital Albert Einstein", ano: "2023" },
                    {
                      id: 3,
                      titulo: "Protocolo de Dor Torácica",
                      instituicao: "Sociedade Brasileira de Cardiologia",
                      ano: "2022",
                    },
                    {
                      id: 4,
                      titulo: "Protocolo de Antibioticoterapia",
                      instituicao: "Hospital Sírio-Libanês",
                      ano: "2022",
                    },
                    { id: 5, titulo: "Protocolo de Prevenção de Quedas", instituicao: "ANVISA", ano: "2021" },
                    {
                      id: 6,
                      titulo: "Protocolo de Cuidados Paliativos",
                      instituicao: "Academia Nacional de Cuidados Paliativos",
                      ano: "2021",
                    },
                  ].map((protocolo) => (
                    <div key={protocolo.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{protocolo.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {protocolo.instituicao} • {protocolo.ano}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="artigos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Artigos Científicos</CardTitle>
                <CardDescription>Publicações científicas recentes e relevantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      titulo: "Avanços no tratamento da doença de Parkinson",
                      revista: "New England Journal of Medicine",
                      ano: "2025",
                    },
                    {
                      id: 2,
                      titulo: "Biomarcadores para diagnóstico precoce de Alzheimer",
                      revista: "JAMA",
                      ano: "2024",
                    },
                    {
                      id: 3,
                      titulo: "Eficácia de novas terapias para diabetes tipo 2",
                      revista: "The Lancet",
                      ano: "2024",
                    },
                    { id: 4, titulo: "Impacto da telemedicina na atenção primária", revista: "BMJ", ano: "2024" },
                    { id: 5, titulo: "Microbioma intestinal e doenças autoimunes", revista: "Science", ano: "2023" },
                    {
                      id: 6,
                      titulo: "Inteligência artificial no diagnóstico de câncer de pulmão",
                      revista: "Nature Medicine",
                      ano: "2023",
                    },
                  ].map((artigo) => (
                    <div key={artigo.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-muted-foreground mt-0.5"
                        >
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                        <div>
                          <p className="font-medium">{artigo.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {artigo.revista} • {artigo.ano}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
