import { PrismaClient } from "../app/generated/prisma";
import type { Consulta, Mensagem, Prisma } from "../app/generated/prisma";
import { type DiagnosticResponse } from "@/lib/aimlapi";

// Singleton para o PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Usar globalThis para garantir uma única instância do PrismaClient
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// Exportar tipos do Prisma para uso em outros arquivos
export type { Consulta, Mensagem, Prisma };

/**
 * Recupera uma consulta pelo ID com todas as suas mensagens
 * @param id ID da consulta
 * @returns Consulta com mensagens ou null se não encontrada
 */
export async function getConsultaById(id: number) {
  try {
    return await prisma.consulta.findUnique({
      where: { id },
      include: {
        mensagens: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar consulta:", error);
    throw new Error(`Falha ao buscar consulta: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Lista consultas com opções de filtragem por status
 * @param options Opções de filtragem e paginação
 * @returns Lista de consultas
 */
export async function listConsultas(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const { status, limit = 10, offset = 0 } = options || {};
    
    return await prisma.consulta.findMany({
      where: status ? { status } : undefined,
      include: {
        _count: {
          select: { mensagens: true }
        }
      },
      orderBy: {
        updated_at: 'desc'
      },
      take: limit,
      skip: offset
    });
  } catch (error) {
    console.error("Erro ao listar consultas:", error);
    throw new Error(`Falha ao listar consultas: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Cria uma nova consulta
 * @returns Nova consulta criada
 */
export async function createConsulta() {
  try {
    return await prisma.consulta.create({
      data: {
        status: 'em_andamento'
      }
    });
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    throw new Error(`Falha ao criar consulta: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Atualiza uma consulta existente
 * @param id ID da consulta
 * @param data Dados para atualização
 * @returns Consulta atualizada
 */
export async function updateConsulta(
  id: number, 
  data: {
    status?: string;
    diagnostico_principal?: string;
    diagnosticos_diferenciais?: any;
    evidencias?: any;
    recomendacoes?: any;
    exames_adicionais?: any;
  }
) {
  try {
    return await prisma.consulta.update({
      where: { id },
      data
    });
  } catch (error) {
    console.error(`Erro ao atualizar consulta ${id}:`, error);
    throw new Error(`Falha ao atualizar consulta: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Salva diagnóstico completo baseado na resposta da API
 * @param consultaId ID da consulta
 * @param diagnostico Objeto de diagnóstico da API
 * @returns Consulta atualizada
 */
export async function saveDiagnostico(consultaId: number, diagnostico: DiagnosticResponse) {
  try {
    return await prisma.consulta.update({
      where: { id: consultaId },
      data: {
        status: 'concluida',
        diagnostico_principal: diagnostico.diagnosticoPrincipal.nome,
        diagnosticos_diferenciais: diagnostico.diagnosticosDiferenciais,
        evidencias: diagnostico.evidencias,
        recomendacoes: diagnostico.recomendacoes,
        exames_adicionais: diagnostico.examesAdicionais
      }
    });
  } catch (error) {
    console.error(`Erro ao salvar diagnóstico para consulta ${consultaId}:`, error);
    throw new Error(`Falha ao salvar diagnóstico: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Deleta uma consulta (apenas para fins administrativos)
 * @param id ID da consulta
 * @returns Resultado da operação
 */
export async function deleteConsulta(id: number) {
  try {
    return await prisma.consulta.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Erro ao deletar consulta ${id}:`, error);
    throw new Error(`Falha ao deletar consulta: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Recupera mensagens de uma consulta
 * @param consultaId ID da consulta
 * @returns Lista de mensagens ordenadas por timestamp
 */
export async function getMensagensByConsultaId(consultaId: number) {
  try {
    return await prisma.mensagem.findMany({
      where: {
        consulta_id: consultaId
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
  } catch (error) {
    console.error(`Erro ao buscar mensagens para consulta ${consultaId}:`, error);
    throw new Error(`Falha ao buscar mensagens: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Cria uma nova mensagem associada a uma consulta
 * @param data Dados da mensagem
 * @returns Mensagem criada
 */
export async function createMensagem(data: {
  consulta_id: number;
  role: string;
  content: string;
  category?: string;
}) {
  try {
    // Atualiza o timestamp da consulta ao criar uma mensagem
    await prisma.consulta.update({
      where: { id: data.consulta_id },
      data: { updated_at: new Date() }
    });
    
    return await prisma.mensagem.create({
      data
    });
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    throw new Error(`Falha ao criar mensagem: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Recupera o diagnóstico formatado para uma consulta
 * @param consultaId ID da consulta
 * @returns Objeto de diagnóstico formatado ou null se não encontrado
 */
export async function getDiagnosticoByConsultaId(consultaId: number) {
  try {
    const consulta = await prisma.consulta.findUnique({
      where: { id: consultaId }
    });

    if (!consulta || !consulta.diagnostico_principal) {
      return null;
    }

    return {
      diagnosticoPrincipal: {
        nome: consulta.diagnostico_principal,
        descricao: consulta.diagnosticos_diferenciais?.[0]?.descricao || ''
      },
      diagnosticosDiferenciais: consulta.diagnosticos_diferenciais || [],
      evidencias: consulta.evidencias || {
        sintomas: [],
        exameFisico: [],
        examesComplementares: []
      },
      recomendacoes: consulta.recomendacoes || {
        tratamentoFarmacologico: [],
        tratamentoNaoFarmacologico: [],
        acompanhamento: []
      },
      examesAdicionais: consulta.exames_adicionais || []
    };
  } catch (error) {
    console.error(`Erro ao buscar diagnóstico para consulta ${consultaId}:`, error);
    throw new Error(`Falha ao buscar diagnóstico: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

export default prisma;