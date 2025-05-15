import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, RotateCw, UserCircle, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  category?: string;
};

type Props = {
  onDiagnosticoCompleto: () => void;
};

export function ChatInterface({ onDiagnosticoCompleto }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consultaId, setConsultaId] = useState<number | null>(null);
  const [isFinalizando, setIsFinalizando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carregar histórico de mensagens quando o componente for montado ou quando consultaId mudar
  useEffect(() => {
    if (consultaId) {
      fetchMessageHistory();
    } else {
      // Adiciona a mensagem inicial do assistente se não houver consulta ativa
      setMessages([
        {
          role: "assistant",
          content: "Olá! Sou seu assistente médico. Por favor, descreva os sintomas ou o que está sentindo para que eu possa ajudar no diagnóstico.",
          category: "question",
        },
      ]);
    }
  }, [consultaId]);

  // Scroll para o final das mensagens quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Buscar histórico de mensagens
  const fetchMessageHistory = async () => {
    if (!consultaId) return;

    try {
      const response = await fetch(`/api/chat?consultaId=${consultaId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.statusText}`);
      }

      const data = await response.json();
      // Converter mensagens do banco para o formato local
      const historicalMessages: Message[] = data.map((msg: any) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
        category: msg.category,
      }));

      setMessages(historicalMessages);
    } catch (error) {
      console.error("Erro ao buscar histórico de mensagens:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de mensagens",
        variant: "destructive",
      });
    }
  };

  // Enviar mensagem para a API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    // Adiciona mensagem do usuário à lista
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
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

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.statusText}`);
      }

      const data = await response.json();

      // Atualiza o ID da consulta se for uma nova consulta
      if (data.consultaId && !consultaId) {
        setConsultaId(data.consultaId);
      }

      // Adiciona resposta do assistente à lista
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          category: data.category,
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem",
        variant: "destructive",
      });

      // Adiciona mensagem de erro como resposta do assistente
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          category: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Finalizar consulta e gerar diagnóstico
  const finalizarConsulta = async () => {
    if (!consultaId || messages.length < 3) {
      toast({
        title: "Aviso",
        description: "É necessário ter mais interações para gerar um diagnóstico",
        variant: "default",
      });
      return;
    }

    setIsFinalizando(true);

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultaId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar diagnóstico: ${response.statusText}`);
      }

      const data = await response.json();

      toast({
        title: "Diagnóstico gerado",
        description: `Diagnóstico principal: ${data.diagnosticoPrincipal.nome}`,
        variant: "default",
      });

      // Notifica o componente pai que o diagnóstico está completo
      onDiagnosticoCompleto();
    } catch (error) {
      console.error("Erro ao finalizar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o diagnóstico",
        variant: "destructive",
      });
    } finally {
      setIsFinalizando(false);
    }
  };

  // Lidar com envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "user" ? (
                    <UserCircle className="h-8 w-8" />
                  ) : (
                    <Bot className="h-8 w-8" />
                  )}
                </Avatar>
                <Card
                  className={`p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <Bot className="h-8 w-8" />
                </Avatar>
                <Card className="p-3 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva os sintomas ou responda a pergunta do assistente..."
            disabled={isLoading || isFinalizando}
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={finalizarConsulta}
              disabled={isLoading || isFinalizando || !consultaId}
            >
              {isFinalizando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando diagnóstico...
                </>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Gerar diagnóstico
                </>
              )}
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isFinalizando}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enviar
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}