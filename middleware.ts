import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Este middleware garante que erros nas rotas da API sempre retornem JSON
export function middleware(request: NextRequest) {
  // Apenas interceptar rotas da API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Continuar com a requisição normal
    const response = NextResponse.next()

    // Adicionar cabeçalhos para garantir que a resposta seja tratada como JSON
    response.headers.set("Content-Type", "application/json")

    return response
  }

  // Para outras rotas, apenas continuar normalmente
  return NextResponse.next()
}

// Configurar o middleware para ser executado apenas nas rotas da API
export const config = {
  matcher: "/api/:path*",
}
