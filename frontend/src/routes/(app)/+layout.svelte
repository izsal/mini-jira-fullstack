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
    Users,
    LayoutDashboard,
    Menu,
    X,
  } from "lucide-svelte";

  export let data: LayoutData;

  let isCollapsed = false;
  let mobileOpen = false;

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

  // Close mobile drawer on route change
  $: if ($page.url.pathname) {
    mobileOpen = false;
  }

  $: currentSection = $page.url.pathname.startsWith("/admin/users")
    ? "User Management"
    : $page.url.pathname.startsWith("/admin")
    ? "Admin Dashboard"
    : $page.url.pathname.startsWith("/my-issues")
    ? "My Issues"
    : $page.url.pathname.startsWith("/projects/")
    ? "Kanban Board"
    : "Projects";

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
  <!-- Mobile Sidebar Backdrop Overlay -->
  {#if mobileOpen}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
      on:click={() => (mobileOpen = false)}
      on:keydown={(e) => e.key === "Escape" && (mobileOpen = false)}
      role="presentation"
    ></div>
  {/if}

  <!-- Mobile Slide-out Drawer -->
  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col w-72 max-w-[85vw] bg-card text-card-foreground border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden {mobileOpen ? 'translate-x-0' : '-translate-x-full'}"
  >
    <!-- Mobile Brand Header -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-border">
      <div class="flex items-center gap-2.5 overflow-hidden">
        <div class="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0 font-bold">
          <KanbanSquare class="h-5 w-5" />
        </div>
        <div class="overflow-hidden">
          <h2 class="font-bold text-sm tracking-tight text-foreground leading-tight truncate">Mini Jira</h2>
          <p class="text-[11px] text-muted-foreground font-medium truncate">Agile Workspace</p>
        </div>
      </div>

      <button
        type="button"
        on:click={() => (mobileOpen = false)}
        class="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        title="Close navigation"
        aria-label="Close navigation"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- Mobile Nav Links -->
    <div class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      <div class="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Planning
      </div>

      <a
        href="/projects"
        on:click={() => (mobileOpen = false)}
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/projects') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
      >
        <FolderKanban class="h-4 w-4 shrink-0" />
        <span class="truncate">Projects & Boards</span>
      </a>

      <div class="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Workspace
      </div>

      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
      >
        <Layers class="h-4 w-4 shrink-0" />
        <span class="truncate">Roadmap</span>
        <span class="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">Soon</span>
      </div>

      <a
        href="/my-issues"
        on:click={() => (mobileOpen = false)}
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/my-issues') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
      >
        <CheckSquare class="h-4 w-4 shrink-0" />
        <span class="truncate">My Issues</span>
      </a>

      {#if data.user?.role === "admin"}
        <div class="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Administration
        </div>

        <a
          href="/admin"
          on:click={() => (mobileOpen = false)}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {$page.url.pathname === '/admin' ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
        >
          <LayoutDashboard class="h-4 w-4 shrink-0" />
          <span class="truncate">Dashboard</span>
        </a>

        <a
          href="/admin/users"
          on:click={() => (mobileOpen = false)}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/admin/users') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
        >
          <Users class="h-4 w-4 shrink-0" />
          <span class="truncate">User Management</span>
        </a>
      {/if}
    </div>

    <!-- Mobile User Profile & Logout -->
    <div class="p-3 border-t border-border bg-card/60">
      <div class="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border shrink-0">
            {userInitials}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-foreground truncate" title={userName}>
              {userName}
            </p>
            <p class="text-[11px] text-muted-foreground truncate">
              {data.user?.email ?? ""}
            </p>
          </div>
        </div>

        <form action="/logout" method="POST">
          <button
            type="submit"
            title="Log Out"
            class="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  </aside>

  <!-- Collapsible Desktop Sidebar -->
  <aside
    class="hidden md:flex relative flex-col shrink-0 border-r border-border bg-card text-card-foreground transition-[width] duration-300 ease-in-out select-none shadow-xs {isCollapsed ? 'w-16' : 'w-64'}"
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

      <a
        href="/my-issues"
        class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/my-issues') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
        title="My Issues"
      >
        <CheckSquare class="h-4 w-4 shrink-0" />
        {#if !isCollapsed}
          <span class="truncate animate-in fade-in duration-200">My Issues</span>
        {/if}
      </a>

      {#if data.user?.role === "admin"}
        {#if !isCollapsed}
          <div class="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground animate-in fade-in duration-200">
            Administration
          </div>
        {/if}

        <a
          href="/admin"
          class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium transition-all {$page.url.pathname === '/admin' ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
          title="Admin Dashboard"
        >
          <LayoutDashboard class="h-4 w-4 shrink-0" />
          {#if !isCollapsed}
            <span class="truncate animate-in fade-in duration-200">Dashboard</span>
          {/if}
        </a>

        <a
          href="/admin/users"
          class="flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium transition-all {$page.url.pathname.startsWith('/admin/users') ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
          title="User Management"
        >
          <Users class="h-4 w-4 shrink-0" />
          {#if !isCollapsed}
            <span class="truncate animate-in fade-in duration-200">User Management</span>
          {/if}
        </a>
      {/if}
    </div>

    <!-- Desktop User & Footer Info -->
    <div class="p-2.5 border-t border-border bg-card/60">
      {#if !isCollapsed}
        <div class="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors animate-in fade-in duration-200">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border shrink-0">
              {userInitials}
            </div>
            <div class="overflow-hidden">
              <div class="flex items-center gap-1.5">
                <p class="text-xs font-semibold text-foreground truncate leading-none" title={userName}>
                  {userName}
                </p>
                {#if data.user?.role === "admin"}
                  <span class="text-[9px] font-extrabold uppercase px-1 py-0.5 rounded bg-primary text-primary-foreground leading-none tracking-wider">
                    Admin
                  </span>
                {/if}
              </div>
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
    <header class="h-16 border-b border-border bg-card/60 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors">
      <div class="flex items-center gap-2 sm:gap-3 overflow-hidden">
        <!-- Mobile Hamburger Button -->
        <button
          type="button"
          on:click={() => (mobileOpen = true)}
          class="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden transition-colors cursor-pointer shrink-0"
          title="Open navigation menu"
          aria-label="Open navigation menu"
        >
          <Menu class="h-5 w-5" />
        </button>

        {#if isCollapsed}
          <button
            type="button"
            on:click={toggleSidebar}
            class="hidden md:flex p-1.5 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer shrink-0"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft class="h-4 w-4" />
          </button>
        {/if}

        <div class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground truncate">
          <span class="font-medium text-foreground hidden xs:inline">Mini Jira</span>
          <span class="hidden xs:inline">/</span>
          <span class="font-medium text-foreground truncate">{currentSection}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
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

    <!-- Page Body with Responsive Padding -->
    <main class="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-background transition-colors">
      <slot />
    </main>
  </div>
</div>

