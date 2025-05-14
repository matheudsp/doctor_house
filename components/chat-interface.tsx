"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SendIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiagnosticResponse } from "@/lib/aimlapi";
import { DiagnosticoAI } from "@/components/diagnostico-ai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  category?: "question" | "diagnosis";
}

interface ChatInterfaceProps {
  onDiagnosticoCompleto?: (diagnostico: DiagnosticResponse) => void;
  consultaId?: number;
}

export function ChatInterface({ onDiagnosticoCompleto, consultaId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "Você é um assistente médico especializado em diagnósticos. Sua função é fazer perguntas relevantes para ajudar a estabelecer um diagnóstico preciso. Faça perguntas específicas, uma por vez, para elucidar o quadro clínico.",
    },
    {
      role: "assistant",
      content:
        "Olá, sou seu assistente de diagnóstico médico. Por favor, descreva os sintomas e queixas principais do paciente para que eu possa ajudar no diagnóstico.",
      category: "question",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnostico, setDiagnostico] = useState<DiagnosticResponse | null>(null);
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Rolar para o final das mensagens quando uma nova mensagem é adicionada
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Salvar mensagem no banco de dados
  const saveMessageToDatabase = async (message: ChatMessage) => {
    if (!consultaId) return;

    try {
      await fetch(`/api/consultas/${consultaId}/mensagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
          category: message.category,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  };

  // Enviar mensagem para a API de chat
  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    // Adicionar mensagem do usuário ao estado
    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Salvar mensagem do usuário no banco de dados
    if (consultaId) {
      await saveMessageToDatabase(userMessage);
    }

    try {
      // Enviar todas as mensagens para a API para manter o contexto
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          consultaId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.errorMessage || "Erro ao processar mensagem");
      }

      // Adicionar resposta do assistente ao estado
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        category: data.category,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Salvar mensagem do assistente no banco de dados
      if (consultaId) {
        await saveMessageToDatabase(assistantMessage);
      }

      // Se a resposta for um diagnóstico, gerar o diagnóstico completo
      if (data.category === "diagnosis") {
        await handleGenerateDiagnosis();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar diagnóstico completo
  const handleGenerateDiagnosis = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: messages,
          consultaId,
        }),
      });

      const resultadoDiagnostico = await response.json();

      if (resultadoDiagnostico.error) {
        throw new Error(resultadoDiagnostico.errorMessage || "Erro ao gerar diagnóstico");
      }

      // Atualizar estado local com o diagnóstico
      setDiagnostico(resultadoDiagnostico);
      setMostrarDiagnostico(true);

      // Notificar componente pai sobre o diagnóstico completo
      if (onDiagnosticoCompleto) {
        onDiagnosticoCompleto(resultadoDiagnostico);
      }
    } catch (error) {
      console.error("Erro ao gerar diagnóstico:", error);
      toast({
        title: "Erro no Diagnóstico",
        description: error instanceof Error ? error.message : "Erro ao gerar diagnóstico completo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosticoFeedback = async (feedback: "concordo" | "discordo") => {
    if (!consultaId || !diagnostico) return;

    try {
      await fetch(`/api/consultas/${consultaId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
          diagnosticoId: diagnostico.diagnosticoPrincipal.nome,
        }),
      });

      toast({
        title: "Feedback enviado",
        description: "Obrigado por avaliar o diagnóstico!",
      });
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Exibir o diagnóstico se estiver disponível e o usuário clicou em "Gerar Diagnóstico" */}
      {mostrarDiagnostico && diagnostico ? (
        <div className="flex-1 overflow-y-auto p-4">
          <DiagnosticoAI 
            diagnostico={diagnostico} 
            onFeedback={handleDiagnosticoFeedback}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setMostrarDiagnostico(false)}
            >
              Voltar ao Chat
            </Button>
          </div>
        </div>
      ) : (
        // Interface de chat
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .filter((msg) => msg.role !== "system") // Não mostrar mensagens do sistema
            .map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Descreva os sintomas ou responda à pergunta..."
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading) handleSubmit();
              }
            }}
            disabled={isLoading || mostrarDiagnostico}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !inputMessage.trim() || mostrarDiagnostico}
            className="self-end"
          >
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={() => {
              if (diagnostico) {
                setMostrarDiagnostico(true);
              } else {
                handleGenerateDiagnosis();
              }
            }}
            disabled={isLoading || messages.filter((m) => m.role === "user").length < 3}
          >
            <SparklesIcon className="h-3 w-3" />
            {diagnostico ? "Ver Diagnóstico" : "Gerar Diagnóstico"}
          </Button>
        </div>
      </div>
    </div>
  );
}