import { writable } from "svelte/store";

export type Theme = "light" | "dark";

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>("light");

  return {
    subscribe,
    init: () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("mini-jira-theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const currentTheme: Theme = stored || (prefersDark ? "dark" : "light");
        set(currentTheme);
        document.documentElement.classList.toggle("dark", currentTheme === "dark");
      }
    },
    toggle: () => {
      update((current) => {
        const next: Theme = current === "dark" ? "light" : "dark";
        if (typeof window !== "undefined") {
          localStorage.setItem("mini-jira-theme", next);
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        return next;
      });
    },
    setTheme: (t: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("mini-jira-theme", t);
        document.documentElement.classList.toggle("dark", t === "dark");
      }
      set(t);
    },
  };
}

export const theme = createThemeStore();
