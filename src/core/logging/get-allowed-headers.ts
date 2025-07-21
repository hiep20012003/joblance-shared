import { IncomingHttpHeaders } from 'http';

export function getAllowedHeaders(
  headers: IncomingHttpHeaders,
  allowedHeaders: string[]
): Record<string, string | string[] | undefined> {
  const allowedHeadersLowercased = allowedHeaders.map(header => header.toLowerCase());
  const result: Record<string, string | string[] | undefined> = {};

  for (const key in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      const lowercasedKey = key.toLowerCase();
      if (allowedHeadersLowercased.includes(lowercasedKey)) {
        result[key] = headers[key];
      }
    }
  }

  return result;
}
