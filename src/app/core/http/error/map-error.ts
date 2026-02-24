import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from './app-error';

export function mapHttpError(e: HttpErrorResponse): AppError {
  if (e.status === 0) return { kind: 'NETWORK', message: 'Sem ligação à rede.', status: 0, details: e.error };
  if (e.status === 401 || e.status === 403) return { kind: 'AUTH', message: 'Sessão expirada ou sem permissões.', status: e.status };
  if (e.status === 404) return { kind: 'NOT_FOUND', message: 'Recurso não encontrado.', status: 404 };
  if (e.status === 422) return { kind: 'VALIDATION', message: 'Dados inválidos.', status: 422, details: e.error };
  if (e.status >= 500) return { kind: 'SERVER', message: 'Erro no servidor. Tenta novamente.', status: e.status };
  return { kind: 'UNKNOWN', message: 'Ocorreu um erro inesperado.', status: e.status, details: e.error };
}