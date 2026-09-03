import { writable } from "svelte/store";

export const toast = writable<{ message: string; type: "success" | "error" } | null>(null);

export function showToast(message: string, type: "success" | "error" = "success") {
  toast.set({ message, type });
  setTimeout(() => toast.set(null), 3000);
}
