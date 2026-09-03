import { writable } from "svelte/store";

export type AuthUser = { id: number; name: string; role: "admin" | "user" } | null;

export const currentUser = writable<AuthUser>(null);
