<script lang="ts">
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import { KanbanSquare, FolderKanban, CheckSquare, Layers, Settings, LogOut, Bell } from "lucide-svelte";

  export let data: LayoutData;

  $: userName = data.user?.name ?? "Workspace Member";
  $: userInitials = data.user?.name
    ? data.user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "MJ";
</script>

<div class="min-h-screen flex bg-slate-50 dark:bg-slate-950">
  <!-- Sidebar -->
  <aside class="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 shadow-xl">
    <!-- Workspace Brand Header -->
    <div class="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80">
      <div class="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30">
        <KanbanSquare class="h-5 w-5" />
      </div>
      <div>
        <h2 class="font-bold text-sm tracking-tight text-white leading-tight">Mini Jira</h2>
        <p class="text-[11px] text-slate-400 font-medium">Software Development</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      <div class="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Planning
      </div>

      <a
        href="/projects"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/projects') ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}"
      >
        <FolderKanban class="h-4 w-4 shrink-0" />
        <span>Projects & Boards</span>
      </a>

      <div class="pt-4 px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Workspace
      </div>

      <div class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
        <Layers class="h-4 w-4 shrink-0" />
        <span>Roadmap</span>
        <span class="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
      </div>

      <div class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
        <CheckSquare class="h-4 w-4 shrink-0" />
        <span>My Issues</span>
        <span class="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
      </div>
    </div>

    <!-- User & Footer Info -->
    <div class="p-3 border-t border-slate-800/80 bg-slate-900/50">
      <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-700 shrink-0">
            {userInitials}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-white truncate leading-none" title={userName}>
              {userName}
            </p>
            <p class="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        <form action="/logout" method="POST">
          <button
            type="submit"
            title="Log Out"
            class="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top Bar -->
    <header class="h-16 border-b border-slate-200/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-8 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span class="font-medium text-slate-800 dark:text-slate-200">Mini Jira</span>
        <span>/</span>
        <span class="font-medium text-slate-600 dark:text-slate-300">Projects</span>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell class="h-4 w-4" />
          <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900"></span>
        </button>
      </div>
    </header>

    <!-- Page Body -->
    <main class="flex-1 overflow-auto p-8">
      <slot />
    </main>
  </div>
</div>
