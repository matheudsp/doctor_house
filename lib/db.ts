import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Inicializa a conexão com o banco de dados Neon
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Tipos para as entidades do banco de dados
export type Paciente = {
  id: number
  nome: string
  data_nascimento?: string
  sexo?: string
  email?: string
  telefone?: string
  created_at: string
  updated_at: string
}

export type Consulta = {
  id: number
  paciente_id: number
  data_consulta: string
  status: "em_andamento" | "concluida" | "arquivada"
  diagnostico_principal?: string
  diagnosticos_diferenciais?: any
  recomendacoes?: any
  created_at: string
  updated_at: string
}

export type Mensagem = {
  id: number
  consulta_id: number
  role: "user" | "assistant" | "system"
  content: string
  category?: string
  timestamp: string
}

// Funções para manipular pacientes
export async function getPacientes() {
  const result = await sql`SELECT * FROM pacientes ORDER BY nome`
  return result
}

export async function getPacienteById(id: number) {
  const result = await sql`SELECT * FROM pacientes WHERE id = ${id}`
  return result[0]
}

export async function createPaciente(paciente: { nome: string }) {
  // Usar SQL tagged template para evitar problemas de injeção SQL
  const result = await sql`
    INSERT INTO pacientes (nome) 
    VALUES (${paciente.nome}) 
    RETURNING *
  `
  return result[0]
}

// Funções para manipular consultas
export async function getConsultasByPacienteId(pacienteId: number) {
  return sql`
    SELECT * FROM consultas 
    WHERE paciente_id = ${pacienteId} 
    ORDER BY data_consulta DESC
  `
}

export async function getConsultaById(id: number) {
  const result = await sql`SELECT * FROM consultas WHERE id = ${id}`
  return result[0]
}

export async function createConsulta(consulta: { paciente_id: number }) {
  const result = await sql`
    INSERT INTO consultas (paciente_id, status) 
    VALUES (${consulta.paciente_id}, 'em_andamento') 
    RETURNING *
  `
  return result[0]
}

export async function updateConsulta(id: number, data: Partial<Consulta>) {
  // Para atualização, precisamos construir a consulta SQL de forma dinâmica
  // Vamos usar uma abordagem mais simples para este caso específico

  // Verificar se há campos para atualizar
  if (Object.keys(data).length === 0) {
    const result = await sql`SELECT * FROM consultas WHERE id = ${id}`
    return result[0]
  }

  // Atualizar campos específicos com base no que foi fornecido
  if (data.status) {
    await sql`UPDATE consultas SET status = ${data.status} WHERE id = ${id}`
  }

  if (data.diagnostico_principal) {
    await sql`UPDATE consultas SET diagnostico_principal = ${data.diagnostico_principal} WHERE id = ${id}`
  }

  if (data.diagnosticos_diferenciais) {
    await sql`UPDATE consultas SET diagnosticos_diferenciais = ${JSON.stringify(data.diagnosticos_diferenciais)}::jsonb WHERE id = ${id}`
  }

  if (data.recomendacoes) {
    await sql`UPDATE consultas SET recomendacoes = ${JSON.stringify(data.recomendacoes)}::jsonb WHERE id = ${id}`
  }

  // Atualizar o timestamp
  await sql`UPDATE consultas SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`

  // Retornar a consulta atualizada
  const result = await sql`SELECT * FROM consultas WHERE id = ${id}`
  return result[0]
}

// Funções para manipular mensagens
export async function getMensagensByConsultaId(consultaId: number) {
  return sql`
    SELECT * FROM mensagens 
    WHERE consulta_id = ${consultaId} 
    ORDER BY timestamp
  `
}

export async function createMensagem(mensagem: Omit<Mensagem, "id" | "timestamp">) {
  const result = await sql`
    INSERT INTO mensagens (consulta_id, role, content, category) 
    VALUES (${mensagem.consulta_id}, ${mensagem.role}, ${mensagem.content}, ${mensagem.category || null}) 
    RETURNING *
  `
  return result[0]
}

// Função para obter consultas recentes
export async function getConsultasRecentes() {
  return sql`
    SELECT c.*, p.nome as nome_paciente 
    FROM consultas c 
    JOIN pacientes p ON c.paciente_id = p.id 
    ORDER BY c.data_consulta DESC 
    LIMIT 5
  `
}
