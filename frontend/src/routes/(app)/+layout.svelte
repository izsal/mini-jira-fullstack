<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import {
    KanbanSquare,
    FolderKanban,
    CheckSquare,
    Layers,
    LogOut,
    Bell,
    PanelLeftClose,
    PanelLeft,
  } from "lucide-svelte";

  export let data: LayoutData;

  let isCollapsed = false;

  onMount(() => {
    if (typeof window !== "undefined") {
      isCollapsed = localStorage.getItem("mini-jira-sidebar-collapsed") === "true";
    }
  });

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    if (typeof window !== "undefined") {
      localStorage.setItem("mini-jira-sidebar-collapsed", String(isCollapsed));
    }
  }

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

<div class="min-h-screen flex bg-background text-foreground transition-colors duration-200">
  <!-- Collapsible shadcn Sidebar -->
  <aside
    class="relative flex flex-col shrink-0 border-r border-border bg-card text-card-foreground transition-[width] duration-300 ease-in-out select-none shadow-xs {isCollapsed ? 'w-16' : 'w-64'}"
  >
    <!-- Workspace Brand Header -->
    <div class="h-16 flex items-center {isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-border transition-all">
      <div class="flex items-center gap-2.5 overflow-hidden">
        <div class="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0 font-bold">
          <KanbanSquare class="h-5 w-5" />
        </div>
        {#if !isCollapsed}
          <div class="overflow-hidden animate-in fade-in duration-200">
            <h2 class="font-bold text-sm tracking-tight text-foreground leading-tight truncate">Mini Jira</h2>
            <p class="text-[11px] text-muted-foreground font-medium truncate">Agile Workspace</p>
          </div>
        {/if}
      </div>

      {#if !isCollapsed}
        <button
          type="button"
          on:click={toggleSidebar}
          class="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          title="Minimize sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose class="h-4 w-4" />
        </button>
      {/if}
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 py-4 {isCollapsed ? 'px-2' : 'px-3'} space-y-1 overflow-y-auto">
      {#if !isCollapsed}
        <div class="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground animate-in fade-in duration-200">
          Planning
        </div>
      {/if}

      <a
        href="/projects"
        class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/projects') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
        title="Projects & Boards"
      >
        <FolderKanban class="h-4 w-4 shrink-0" />
        {#if !isCollapsed}
          <span class="truncate animate-in fade-in duration-200">Projects & Boards</span>
        {/if}
      </a>

      {#if !isCollapsed}
        <div class="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground animate-in fade-in duration-200">
          Workspace
        </div>
      {/if}

      <div
        class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
        title="Roadmap (Coming Soon)"
      >
        <Layers class="h-4 w-4 shrink-0" />
        {#if !isCollapsed}
          <span class="truncate animate-in fade-in duration-200">Roadmap</span>
          <span class="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">Soon</span>
        {/if}
      </div>

      <div
        class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
        title="My Issues (Coming Soon)"
      >
        <CheckSquare class="h-4 w-4 shrink-0" />
        {#if !isCollapsed}
          <span class="truncate animate-in fade-in duration-200">My Issues</span>
          <span class="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">Soon</span>
        {/if}
      </div>
    </div>

    <!-- User & Footer Info -->
    <div class="p-2.5 border-t border-border bg-card/60">
      {#if !isCollapsed}
        <div class="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors animate-in fade-in duration-200">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border shrink-0">
              {userInitials}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-semibold text-foreground truncate leading-none" title={userName}>
                {userName}
              </p>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          <form action="/logout" method="POST">
            <button
              type="submit"
              title="Log Out"
              class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
            >
              <LogOut class="h-4 w-4" />
            </button>
          </form>
        </div>
      {:else}
        <!-- Collapsed User Avatar & Logout -->
        <div class="flex flex-col items-center gap-2 py-1">
          <div
            class="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border cursor-default"
            title="{userName} (Online)"
          >
            {userInitials}
          </div>
          <form action="/logout" method="POST">
            <button
              type="submit"
              title="Log Out"
              class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
            >
              <LogOut class="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      {/if}
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top Bar -->
    <header class="h-16 border-b border-border bg-card/60 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 transition-colors">
      <div class="flex items-center gap-3">
        {#if isCollapsed}
          <button
            type="button"
            on:click={toggleSidebar}
            class="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft class="h-4 w-4" />
          </button>
        {/if}

        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Mini Jira</span>
          <span>/</span>
          <span class="font-medium text-foreground">Projects</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          class="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell class="h-4 w-4" />
          <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
        </button>
      </div>
    </header>

    <!-- Page Body -->
    <main class="flex-1 overflow-auto p-8 bg-background transition-colors">
      <slot />
    </main>
  </div>
</div>
