import "server-only";

type Listener = (event: string, data: unknown) => void;

/**
 * In-process server-to-browser fan-out. The SSE route subscribes here and
 * serializes events to the operator's authenticated stream.
 */
class SseBus {
  private listeners = new Set<Listener>();

  publish(event: string, data: unknown): void {
    for (const l of this.listeners) {
      try {
        l(event, data);
      } catch {
        // A dead subscriber must never break the bus.
      }
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscriberCount(): number {
    return this.listeners.size;
  }

  resetForTests(): void {
    this.listeners.clear();
  }
}

export const sseBus = new SseBus();

export function publishLive(event: string, data: unknown): void {
  sseBus.publish(event, data);
}
