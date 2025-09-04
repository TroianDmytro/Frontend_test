// Shared error formatting helper to unify ApiError / unknown errors to string
import type { ApiError } from '../types/api';

export function extractErrorMessage(err: unknown, fallback = 'Ошибка'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const anyErr: any = err;
    const message = (anyErr as ApiError)?.message || anyErr.message || anyErr.error || fallback;
    if (Array.isArray(message)) return message.join(', ');
    return String(message);
  }
  return fallback;
}
