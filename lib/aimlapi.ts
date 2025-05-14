// Cliente para a API AIMLAPI
import { env } from "@/env";

const AIMLAPI_BASE_URL = "https://api.aimlapi.com/v1";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  // Adicione outros parâmetros conforme necessário
};

export type ChatCompletionResponse = {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
};

export type DiagnosticRequest = {
  conversation: ChatMessage[];
  consultaId?: number;
};

export type DiagnosticResponse = {
  diagnosticoPrincipal: {
    nome: string;
    descricao: string;
  };
  diagnosticosDiferenciais: Array<{
    nome: string;
    probabilidade: number;
    descricao: string;
  }>;
  evidencias: {
    sintomas: string[];
    exameFisico: string[];
    examesComplementares: string[];
  };
  recomendacoes: {
    tratamentoFarmacologico: string[];
    tratamentoNaoFarmacologico: string[];
    acompanhamento: string[];
  };
  examesAdicionais: string[];
};

export class AimlapiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.warn("AVISO: AIMLAPI_KEY não está definida no ambiente");
    }
    this.apiKey = apiKey;
  }

  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${AIMLAPI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        frequency_penalty: 1,
        presence_penalty: 1,
        top_p: 1,
        response_format: { type: "text" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro na API AIMLAPI: ${JSON.stringify(error)}`);
    }

    return await response.json();
  }

  async analyzeMedicalConversation(
    conversation: ChatMessage[]
  ): Promise<DiagnosticResponse> {
    // Adiciona instruções específicas para análise diagnóstica
    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "Você é um assistente médico especializado em diagnósticos. Analise a conversa entre médico e paciente e forneça um diagnóstico detalhado com diagnósticos diferenciais, evidências clínicas e recomendações terapêuticas.",
      },
      ...conversation,
      {
        role: "user",
        content:
          "Por favor, gere um diagnóstico estruturado em formato JSON com os seguintes campos: diagnosticoPrincipal (nome e descrição), diagnosticosDiferenciais (array com nome, probabilidade e descrição), evidencias (sintomas, exameFisico, examesComplementares), recomendacoes (tratamentoFarmacologico, tratamentoNaoFarmacologico, acompanhamento) e examesAdicionais.",
      },
    ];

    const response = await this.createChatCompletion({
      model: 'gpt-4o-mini-2024-07-18',
      messages,
      temperature: 0.3,
      max_tokens: 2048,
    });

    // Extrair e analisar a resposta JSON
    try {
      const content = response.choices[0].message.content;
      // Tenta encontrar o bloco JSON na resposta
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/({[\s\S]*})/) ||
                        [null, content];
                        
      const jsonContent = jsonMatch[1];
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error("Erro ao analisar resposta de diagnóstico:", error);
      throw new Error("Falha ao processar o diagnóstico. Formato inválido.");
    }
  }
}

// Exporta uma instância do cliente
export const aimlapi = new AimlapiClient(process.env.AIMLAPI_KEY || "");