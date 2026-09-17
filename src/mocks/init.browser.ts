import { worker } from "./browser";

export async function startMockWorker(): Promise<void> {
  await worker.start({ onUnhandledRequest: "bypass" });
}
