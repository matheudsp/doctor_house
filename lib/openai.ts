import { OpenAI } from "@ai-sdk/openai"

// Verificar se a chave da API está definida
if (!process.env.OPENAI_API_KEY) {
  console.warn("AVISO: OPENAI_API_KEY não está definida no ambiente")
}

export const openai = OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})
