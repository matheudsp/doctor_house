"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, LogOut, Menu, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            <span className="hidden font-bold md:inline-block">MedDiagnosis AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Início
            </Link>
            <Link
              href="/diagnostico"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Diagnóstico
            </Link>
            <Link
              href="/pacientes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pacientes
            </Link>
            <Link
              href="/conhecimento"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Conhecimento
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Dr. Silva" />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Silva</p>
                  <p className="text-xs leading-none text-muted-foreground">dr.silva@meddiagnosis.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
        Início
      </Link>
      <Link href="/diagnostico" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
        Diagnóstico
      </Link>
      <Link href="/pacientes" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
        Pacientes
      </Link>
      <Link
        href="/conhecimento"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground"
      >
        Conhecimento
      </Link>
    </div>
  )
}
