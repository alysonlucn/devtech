import { z } from 'zod';
import { SortOrder } from '../enums';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.nativeEnum(SortOrder).default(SortOrder.ASC),
  search: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function buildPaginationMeta(result: PaginatedResult<unknown>) {
  return {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: Math.ceil(result.total / result.limit) || 1,
  };
}

export function getSkipTake(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit };
}
