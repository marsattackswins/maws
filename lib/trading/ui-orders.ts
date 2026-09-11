import { dispatchSubmitOrder } from "@/lib/trading/dispatch";
import type { PlaceOrderInput } from "@/lib/trading/mock";

/**
 * UI-originated order submission (paper or live, depending on the connected
 * broker).
 *
 * clientOrderId is MANDATORY for every UI submission: generate ONE UUID per
 * user submit action (newClientOrderId) and reuse that same id if the action
 * is retried, so replay protection can deduplicate it on both brokers.
 */
export type UiOrderInput = Omit<PlaceOrderInput, "clientOrderId"> & {
  clientOrderId: string;
};

export function newClientOrderId(): string {
  return crypto.randomUUID();
}

export function submitOrderFromUi(input: UiOrderInput) {
  void dispatchSubmitOrder(input);
}
