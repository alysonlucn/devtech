import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return translateApiMessage(response.data.message)
  }
  if (error instanceof Error) return translateApiMessage(error.message)
  return fallback
}

const apiMessageTranslations: Record<string, string> = {
  'Invalid credentials': 'Credenciais inválidas',
  'Email not found': 'Este e-mail não está cadastrado',
  'Incorrect password': 'Senha incorreta',
  'Unauthorized': 'Não autorizado',
  'Forbidden': 'Acesso negado',
  'Not found': 'Não encontrado',
  'Resource not found': 'Recurso não encontrado',
  'Too many requests, please try again later': 'Muitas tentativas. Tente novamente mais tarde.',
  'Internal server error': 'Erro interno do servidor',
  'Email already registered': 'Este e-mail já está cadastrado',
  'Email already exists': 'Este e-mail já está cadastrado',
  'Invalid refresh token': 'Sessão expirada. Faça login novamente.',
  'Refresh token expired': 'Sessão expirada. Faça login novamente.',
  'Access token expired': 'Sessão expirada. Faça login novamente.',
  'User not found': 'Usuário não encontrado',
  'Validation failed': 'Dados inválidos',
  'Conflict': 'Conflito ao processar a solicitação',
  'Technology already started': 'Esta tecnologia já foi iniciada',
  'Start the technology before taking an assessment': 'Inicie a tecnologia antes de fazer a avaliação',
  'Technology is not eligible for assessment': 'Esta tecnologia não está elegível para avaliação',
  'Technology must be in progress': 'A tecnologia precisa estar em progresso',
  'Use assessment endpoint to validate a technology': 'Use a avaliação para validar uma tecnologia',
  'Project already started': 'Este projeto já foi iniciado',
  'Dependency already exists': 'Esta dependência já existe',
  'Technology slug already exists': 'Este identificador de tecnologia já existe',
  'Learning path slug already exists': 'Este identificador de trilha já existe',
  'Slug already in use': 'Este identificador já está em uso',
  'A technology cannot depend on itself': 'Uma tecnologia não pode depender de si mesma',
  'This dependency would create a circular reference': 'Esta dependência criaria uma referência circular',
  'Não foi possível gerar a resposta da IA. Tente novamente.': 'Não foi possível gerar a resposta da IA. Tente novamente.',
  'A IA não retornou uma resposta. Tente novamente.': 'A IA não retornou uma resposta. Tente novamente.',
  'A IA retornou um formato inválido. Tente novamente.': 'A IA retornou um formato inválido. Tente novamente.',
  'O modelo de IA configurado não está mais disponível.': 'O modelo de IA configurado não está mais disponível.',
  'A chave da IA é inválida ou está sem permissão.': 'A chave da IA é inválida ou está sem permissão.',
  'A IA está temporariamente sobrecarregada. Tente novamente em instantes.': 'A IA está temporariamente sobrecarregada. Tente novamente em instantes.',
}

function translateApiMessage(message: string): string {
  if (apiMessageTranslations[message]) return apiMessageTranslations[message]
  if (message.startsWith('Prerequisite not validated:')) {
    const name = message.replace('Prerequisite not validated: ', '')
    return `Pré-requisito não validado: ${name}`
  }
  return message
}
