import {z, ZodArray, ZodEmail, ZodEnum, ZodObject, ZodString, ZodUUID} from 'zod';

export function parseArray<T = unknown>(input: unknown): T[] {
  let arr: unknown[] = [];

  // Nếu input là string JSON
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input) as [];
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      arr = [];
    }
  } else if (Array.isArray(input)) {
    arr = input;
  }

  // Parse từng item nếu là string JSON
  return arr.map(item => {
    if (typeof item === 'string') {
      return parseObject<T>(item);
    }
    return item;
  }) as T[];
}


export function parseObject<T = unknown>(input: unknown): T {
  // Nếu không phải string, trả về nguyên (middleware Express đã parse)
  if (typeof input !== 'string') {
    return input as T;
  }

  // Nếu là string, thử parse JSON
  try {
    const parsed = JSON.parse(input);
    // chỉ chấp nhận object thực sự
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    // không parse được, trả về input gốc
  }

  return input as T;
}


export const parseNumber = (val: unknown) => {
  const n = Number(val);
  return isNaN(n) ? val : n;
};

export const sanitizeArray = (schema: any) =>
  z.preprocess(
    (v) => parseArray(v), schema
  )

export const sanitizeString = (schema: ZodString | ZodEmail | ZodEnum | ZodUUID) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema
  );

export const sanitizeNumber = (schema = z.number()) =>
  z.preprocess(
    (v) => (v !== '' && v !== undefined ? Number(v) : undefined),
    schema
  );

export const sanitizeBoolean = (schema = z.boolean()) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v === 'true' : v),
    schema
  );
