import { ParamsDictionary } from 'express-serve-static-core';

export function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export function params<T extends ParamsDictionary>(raw: T): Record<keyof T, string> {
  const result = {} as Record<keyof T, string>;
  for (const key of Object.keys(raw) as (keyof T)[]) {
    result[key] = param(raw[key] as string | string[]);
  }
  return result;
}
