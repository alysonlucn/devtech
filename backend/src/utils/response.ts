import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: { message?: string; status?: number; meta?: PaginationMeta },
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.meta && { meta: options.meta }),
  };
  return res.status(options?.status ?? 200).json(body);
}

export function sendError(
  res: Response,
  message: string,
  options?: { status?: number; errors?: unknown[] },
): Response {
  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(options?.errors && options.errors.length > 0 && { errors: options.errors }),
  };
  return res.status(options?.status ?? 500).json(body);
}
