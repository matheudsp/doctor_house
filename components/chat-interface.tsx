"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Loader2, RefreshCcw, SendIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface ChatInterfaceProps {
  onDiagnosticoCompleto: (diagnostico: any) => void
  consultaId?: number
  mensagensIniciais?: any[]
  continuarConsulta?: boolean
}

type MessageType = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  status?: "thinking" | "complete"
  category?: "symptom" | "history" | "exam" | "question" | "diagnosis"
}

export function ChatInterface({
  onDiagnosticoCompleto,
  consultaId,
  mensagensIniciais = [],
  continuarConsulta = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>(
    mensagensIniciais.length > 0
      ? mensagensIniciais.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          status: "complete",
          category: msg.category,
        }))
      : [
          {
            id: "1",
            role: "system",
            content: "Bem-vindo ao assistente de diagnóstico médico. Como posso ajudar hoje?",
            timestamp: new Date(),
            status: "complete",
          },
        ],
  )

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosticoGerado, setDiagnosticoGerado] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)

    // Adicionar mensagem de "pensando"
    const thinkingMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      status: "thinking",
    }

    setMessages((prev) => [...prev, thinkingMessage])

    try {
      // Preparar os dados para enviar à API
      const messagesToSend = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Enviar mensagem para a API com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos de timeout

      let response
      try {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSend,
            consultaId,
          }),
          signal: controller.signal,
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === "AbortError") {
          throw new Error("A requisição excedeu o tempo limite. Por favor, tente novamente.")
        }
        throw fetchError
      }

      clearTimeout(timeoutId)

      // Verificar se a resposta é um JSON válido
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Resposta não é JSON: ${response.status} ${contentType}`)

        // Tentar ler o corpo da resposta para diagnóstico
        const responseText = await response.text()
        console.error(`Corpo da resposta: ${responseText}`)

        throw new Error(`Resposta não é JSON (${response.status}: ${contentType})`)
      }

      const data = await response.json()

      if (!response.ok && !data.response) {
        throw new Error(data.error || data.details || "Erro ao processar a mensagem")
      }

      // Atualizar a mensagem de "pensando" com a resposta
      setMessages((prev) => {
        const newMessages = [...prev]
        const thinkingIndex = newMessages.findIndex((msg) => msg.role === "assistant" && msg.status === "thinking")

        if (thinkingIndex !== -1) {
          newMessages[thinkingIndex] = {
            ...newMessages[thinkingIndex],
            content: data.response,
            status: "complete",
            category: data.category,
          }
        }

        return newMessages
      })

      // Se a resposta contiver um diagnóstico, perguntar se o médico quer gerar o relatório completo
      if (data.category === "diagnosis" && !diagnosticoGerado) {
        setTimeout(() => {
          const confirmMessage: MessageType = {
            id: Date.now().toString(),
            role: "system",
            content: "Gostaria de gerar o relatório completo de diagnóstico com base nesta conversa?",
            timestamp: new Date(),
            status: "complete",
          }
          setMessages((prev) => [...prev, confirmMessage])
          setDiagnosticoGerado(true)
        }, 1000)
      }

      // Se houver um erro na resposta mas temos uma resposta de fallback
      if (data.error && data.response) {
        console.warn("Aviso: Usando resposta de fallback devido a erro:", data.error)
        toast({
          title: "Aviso",
          description: "Houve um problema ao processar sua mensagem, mas conseguimos gerar uma resposta alternativa.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Erro:", error)

      // Resposta de fallback em caso de erro
      const fallbackMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Desculpe, estou enfrentando dificuldades técnicas no momento. Por favor, tente novamente ou descreva seus sintomas de outra forma.",
        timestamp: new Date(),
        status: "complete" as const,
        category: "question" as const,
      }

      // Substituir a mensagem de "pensando" pela mensagem de fallback
      setMessages((prev) => {
        const newMessages = prev.filter((msg) => msg.status !== "thinking")
        return [...newMessages, fallbackMessage]
      })

      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGerarDiagnostico = async () => {
    setIsLoading(true)

    try {
      const messagesToSend = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Usar timeout para a requisição
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 segundos de timeout

      let response
      try {
        response = await fetch("/api/diagnostico", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            conversation: messagesToSend,
            consultaId,
          }),
          signal: controller.signal,
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === "AbortError") {
          throw new Error("A geração do diagnóstico excedeu o tempo limite. Por favor, tente novamente.")
        }
        throw fetchError
      }

      clearTimeout(timeoutId)

      // Verificar se a resposta é um JSON válido
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Resposta não é JSON: ${response.status} ${contentType}`)

        // Tentar ler o corpo da resposta para diagnóstico
        const responseText = await response.text()
        console.error(`Corpo da resposta: ${responseText}`)

        throw new Error(`Resposta não é JSON (${response.status}: ${contentType})`)
      }

      const data = await response.json()

      if (!response.ok && !data.diagnosticoPrincipal) {
        throw new Error(data.error || data.details || "Erro ao gerar diagnóstico")
      }

      // Adicionar mensagem de confirmação
      const confirmMessage: MessageType = {
        id: Date.now().toString(),
        role: "system",
        content: "Diagnóstico gerado com sucesso!",
        timestamp: new Date(),
        status: "complete",
      }

      setMessages((prev) => [...prev, confirmMessage])

      // Notificar o componente pai
      onDiagnosticoCompleto(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível gerar o diagnóstico. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReiniciarDiagnostico = () => {
    // Adicionar mensagem de reinício
    const restartMessage: MessageType = {
      id: Date.now().toString(),
      role: "system",
      content:
        "Vamos continuar a consulta para refinar o diagnóstico. Por favor, forneça informações adicionais ou faça perguntas.",
      timestamp: new Date(),
      status: "complete",
    }

    setMessages((prev) => [...prev, restartMessage])
    setDiagnosticoGerado(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-start gap-3", {
                "justify-end": message.role === "user",
              })}
            >
              {message.role !== "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-bot.jpg" />
                  <AvatarFallback
                    className={cn({
                      "bg-primary/10": message.role === "assistant",
                      "bg-muted": message.role === "system",
                    })}
                  >
                    <Brain className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn("rounded-lg px-4 py-3 max-w-[85%]", {
                  "bg-primary text-primary-foreground": message.role === "user",
                  "bg-muted": message.role === "assistant" || message.role === "system",
                })}
              >
                {message.status === "thinking" ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analisando informações médicas...</span>
                  </div>
                ) : (
                  <div>
                    {message.category && message.role === "assistant" && (
                      <Badge
                        className={cn("mb-2", {
                          "bg-blue-500": message.category === "question",
                          "bg-green-500": message.category === "diagnosis",
                        })}
                      >
                        {message.category === "question" ? "Pergunta" : "Diagnóstico"}
                      </Badge>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Botões de ação para mensagem do sistema sobre diagnóstico */}
                    {message.role === "system" &&
                      message.content.includes("Gostaria de gerar o relatório completo") && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={handleGerarDiagnostico} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Gerando...
                              </>
                            ) : (
                              "Sim, gerar relatório"
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleReiniciarDiagnostico}>
                            <RefreshCcw className="h-3 w-3 mr-2" />
                            Continuar consulta
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="border-t pt-4 mt-auto">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva os sintomas, histórico ou achados clínicos..."
            className="min-h-[80px] flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-[80px]" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Pressione Enter para enviar, Shift+Enter para nova linha</p>
      </div>
    </div>
  )
}
