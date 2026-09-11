import "server-only";

/**
 * Normalized broker error types.
 * Wraps broker-specific errors into standardized error classes.
 */

export class BrokerError extends Error {
  constructor(
    message: string,
    public readonly broker: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "BrokerError";
  }
}

export class BrokerConnectionError extends BrokerError {
  constructor(broker: string, reason: string, originalError?: unknown) {
    super(`${broker} connection failed: ${reason}`, broker, originalError);
    this.name = "BrokerConnectionError";
  }
}

export class BrokerOrderError extends BrokerError {
  constructor(
    broker: string,
    public readonly code: string | number,
    message: string,
    originalError?: unknown,
  ) {
    super(`${broker} order error [${code}]: ${message}`, broker, originalError);
    this.name = "BrokerOrderError";
  }
}

export class BrokerAuthError extends BrokerError {
  constructor(broker: string, message: string, originalError?: unknown) {
    super(`${broker} authentication failed: ${message}`, broker, originalError);
    this.name = "BrokerAuthError";
  }
}

export class BrokerTimeoutError extends BrokerError {
  constructor(broker: string, operation: string, originalError?: unknown) {
    super(`${broker} operation timed out: ${operation}`, broker, originalError);
    this.name = "BrokerTimeoutError";
  }
}

export class BrokerRateLimitError extends BrokerError {
  constructor(broker: string, message: string, originalError?: unknown) {
    super(`${broker} rate limit exceeded: ${message}`, broker, originalError);
    this.name = "BrokerRateLimitError";
  }
}

export class BrokerConfigError extends BrokerError {
  constructor(broker: string, message: string) {
    super(`${broker} configuration error: ${message}`, broker);
    this.name = "BrokerConfigError";
  }
}

/**
 * Helper to check if an error is a broker error.
 */
export function isBrokerError(err: unknown): err is BrokerError {
  return err instanceof BrokerError;
}

/**
 * Helper to extract a user-friendly message from any error.
 */
export function getBrokerErrorMessage(err: unknown): string {
  if (isBrokerError(err)) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}
