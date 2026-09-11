import "server-only";

/**
 * Single-process serialization for mutations that change exchange exposure.
 * The queue is deliberately process-local; the terminal has no distributed
 * execution responsibility.
 */
let active = false;
const waiters: Array<() => void> = [];

function acquire(): Promise<void> {
  if (!active) {
    active = true;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => waiters.push(resolve));
}

function release(): void {
  const next = waiters.shift();
  if (next) next();
  else active = false;
}

export async function withRiskMutation<T>(operation: () => Promise<T>): Promise<T> {
  await acquire();
  try {
    return await operation();
  } finally {
    release();
  }
}

/** Synchronous seam for event handlers that must preserve synchronous errors. */
function releaseAfter<T>(result: T | Promise<T>): T | Promise<T> {
  if (result instanceof Promise) return result.finally(release);
  release();
  return result;
}

export function withRiskMutationSync<T>(operation: () => T): T | Promise<T> {
  if (!active) {
    active = true;
    try {
      return releaseAfter(operation());
    } catch (error) {
      release();
      throw error;
    }
  }
  return acquire().then(() => {
    try {
      return releaseAfter(operation());
    } catch (error) {
      release();
      throw error;
    }
  });
}

/** Waits for all currently queued mutation work, then holds the queue. */
export async function acquireRiskMutationDrain(): Promise<() => void> {
  await acquire();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    release();
  };
}

export function resetMutationQueueForTests(): void {
  active = false;
  waiters.length = 0;
}
