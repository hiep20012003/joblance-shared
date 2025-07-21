import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestTraceContext = (req: Request, res: Response, next: NextFunction) => {
  // Extract traceparent header
  const traceparentHeader = req.headers['traceparent']?.toString();

  let traceId: string;
  let parentSpanId: string | undefined;
  let traceFlags: string = '01'; // Default to sampled

  if (traceparentHeader) {
    // Parse traceparent header
    const [version, traceIdFromHeader, parentSpanIdFromHeader, traceFlagsFromHeader] =
      traceparentHeader.split('-');

    if (version === '00' && traceIdFromHeader && parentSpanIdFromHeader && traceFlagsFromHeader) {
      traceId = traceIdFromHeader;
      parentSpanId = parentSpanIdFromHeader;
      traceFlags = traceFlagsFromHeader;
    } else {
      // Invalid traceparent header, generate new traceId
      traceId = uuidv4().replace(/-/g, '');
      parentSpanId = undefined;
    }
  } else {
    // No traceparent header, generate new traceId
    traceId = uuidv4().replace(/-/g, '');
    parentSpanId = undefined;
  }

  // Generate new spanId for this request
  const spanId = uuidv4().substring(0, 16).replace(/-/g, '');

  // Create new traceparent header for outgoing requests
  const newTraceparentHeader = `00-${traceId}-${spanId}-${traceFlags}`;

  // Set trace context
  req.traceContext = {
    traceId,
    spanId,
    parentSpanId,
    traceFlags,
    newTraceparentHeader,
    userId: req.headers['x-user-id']?.toString(),
    startAt: Date.now(),
  };

  // Set the new traceparent header in the response for propagation (optional)
  res.setHeader('traceparent', newTraceparentHeader);

  next();
};
