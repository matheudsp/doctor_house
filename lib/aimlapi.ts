import { env } from "@/env";

const AIMLAPI_BASE_URL = "https://api.aimlapi.com/v1";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
  category?: "question" | "diagnosis";
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  // Outros parâmetros opcionais
  frequency_penalty?: number;
  presence_penalty?: number;
  top_p?: number;
  response_format?: { type: string };
};

export type ChatCompletionResponse = {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason?: string;
  }>;
  id?: string;
  model?: string;
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
  private readonly defaultModel = "gpt-4o-mini";
  private readonly baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    // Verificar e usar a chave API do ambiente ou a fornecida
    this.apiKey = apiKey || env.AIMLAPI_KEY || "";
    this.baseUrl = baseUrl || AIMLAPI_BASE_URL;
    
    if (!this.apiKey) {
      console.warn("AVISO: AIMLAPI_KEY não está definida no ambiente");
    }
  }

  /**
   * Faz uma chamada para a API de chat completions
   * @param request Parâmetros da requisição
   * @returns Resposta da API
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    try {
      // Garantir que temos os valores padrão
      const finalRequest = {
        model: request.model || this.defaultModel,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens ?? 256,
        frequency_penalty: request.frequency_penalty ?? 0,
        presence_penalty: request.presence_penalty ?? 0,
        top_p: request.top_p ?? 1,
        response_format: request.response_format ?? { type: "text" },
      };

      // Fazer a chamada para a API
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(finalRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(`Erro na API AIMLAPI (${response.status}): ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na chamada à API AIMLAPI:", error);
      throw error;
    }
  }

  /**
   * Analisa uma conversa médica para gerar um diagnóstico estruturado
   * @param conversation Mensagens da conversa entre médico/assistente e paciente
   * @returns Diagnóstico estruturado
   */
  async analyzeMedicalConversation(
    conversation: ChatMessage[]
  ): Promise<DiagnosticResponse> {
    // Adiciona instruções específicas para análise diagnóstica
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `Você é um assistente médico especializado em diagnósticos. 
        Analise a conversa entre médico e paciente e forneça um diagnóstico detalhado 
        com diagnósticos diferenciais, evidências clínicas e recomendações terapêuticas. 
        Sua resposta DEVE ser um JSON válido, sem texto adicional antes ou depois.`,
      },
      ...conversation,
      {
        role: "user",
        content: `Por favor, gere um diagnóstico estruturado em formato JSON com os seguintes campos:
        - diagnosticoPrincipal: objeto com nome e descrição da condição mais provável
        - diagnosticosDiferenciais: array de objetos, cada um com nome, probabilidade (0-100) e descrição
        - evidencias: objeto com arrays de sintomas, exameFisico e examesComplementares mencionados
        - recomendacoes: objeto com arrays de tratamentoFarmacologico, tratamentoNaoFarmacologico e acompanhamento
        - examesAdicionais: array de strings com exames recomendados
        
        Certifique-se de basear seu diagnóstico apenas nos dados apresentados na conversa.
        Retorne APENAS o JSON válido, sem texto explicativo antes ou depois.`,
      },
    ];

    try {
      // Fazer chamada com parâmetros otimizados para retornar um JSON
      const response = await this.createChatCompletion({
        model: this.defaultModel,
        messages,
        temperature: 0.2, // Menor temperatura para respostas mais previsíveis
        max_tokens: 2048,
      });

      // Extrair e analisar a resposta
      const content = response.choices[0].message.content.trim();
      
      // Tentar diferentes métodos para extrair o JSON
      let jsonData: DiagnosticResponse;
      
      try {
        // Tentar parsing direto primeiro
        jsonData = JSON.parse(content);
      } catch (parseError) {
        // Se falhar, tentar extrair um bloco de código JSON
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                         content.match(/```\n([\s\S]*?)\n```/) ||
                         content.match(/({[\s\S]*})/) ||
                         [null, content];
                         
        const jsonContent = jsonMatch[1];
        try {
          jsonData = JSON.parse(jsonContent);
        } catch (secondParseError) {
          console.error("Erro ao analisar JSON do diagnóstico:", secondParseError);
          throw new Error("Formato de resposta inválido. Não foi possível extrair um JSON válido.");
        }
      }
      
      // Garantir que o objeto tem todos os campos necessários
      this.validateDiagnosticResponse(jsonData);
      
      return jsonData;
    } catch (error) {
      console.error("Erro ao processar diagnóstico:", error);
      throw new Error(`Falha ao processar o diagnóstico: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }
  
  /**
   * Valida se a resposta de diagnóstico contém todos os campos necessários
   * @param data Dados de diagnóstico
   */
  private validateDiagnosticResponse(data: any): asserts data is DiagnosticResponse {
    // Verificar campos obrigatórios
    if (!data.diagnosticoPrincipal || typeof data.diagnosticoPrincipal !== 'object') {
      throw new Error("Diagnóstico principal ausente ou inválido");
    }
    
    if (!Array.isArray(data.diagnosticosDiferenciais)) {
      throw new Error("Diagnósticos diferenciais ausentes ou inválidos");
    }
    
    if (!data.evidencias || typeof data.evidencias !== 'object') {
      throw new Error("Evidências ausentes ou inválidas");
    }
    
    if (!data.recomendacoes || typeof data.recomendacoes !== 'object') {
      throw new Error("Recomendações ausentes ou inválidas");
    }
    
    // Garantir que arrays existam (mesmo vazios)
    data.evidencias.sintomas = data.evidencias.sintomas || [];
    data.evidencias.exameFisico = data.evidencias.exameFisico || [];
    data.evidencias.examesComplementares = data.evidencias.examesComplementares || [];
    data.recomendacoes.tratamentoFarmacologico = data.recomendacoes.tratamentoFarmacologico || [];
    data.recomendacoes.tratamentoNaoFarmacologico = data.recomendacoes.tratamentoNaoFarmacologico || [];  
    data.recomendacoes.acompanhamento = data.recomendacoes.acompanhamento || [];
    data.examesAdicionais = data.examesAdicionais || [];
  }
}

// Exporta uma instância do cliente
export const aimlapi = new AimlapiClient();