<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
  import TicketDetailModal from "$lib/components/TicketDetailModal.svelte";
  import { showToast } from "$lib/stores/ui";
  import type { PageData } from "./$types";
  import {
    CheckSquare,
    Search,
    FolderKanban,
    ArrowRight,
    Circle,
    Clock,
    CheckCircle2,
    Calendar,
  } from "lucide-svelte";

  export let data: PageData;

  let searchQuery = "";
  let activeTab: "all" | "todo" | "in_progress" | "done" = "all";

  let selectedTicket: any = null;
  let isDetailModalOpen = false;

  interface ProjectItem {
    id: number;
    name: string;
    description?: string;
  }

  $: projectMap = new Map<number, ProjectItem>(data.projects.map((p: any) => [p.id, p]));

  $: filteredTickets = data.myTickets.filter((t: any) => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const statusConfig: Record<string, { label: string; bg: string; icon: any }> = {
    todo: {
      label: "To Do",
      bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
      icon: Circle,
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      icon: Clock,
    },
    done: {
      label: "Done",
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
    },
  };

  function openDetail(t: any) {
    selectedTicket = t;
    isDetailModalOpen = true;
  }
</script>

<div class="max-w-5xl mx-auto space-y-8">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
        My Issues
        <Badge variant="secondary" class="font-normal text-xs">
          {data.myTickets.length} Assigned
        </Badge>
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Semua tiket dan tugas yang ditugaskan kepada Anda di seluruh project dan papan Kanban.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" href="/projects">
        <FolderKanban class="h-4 w-4 mr-1.5" />
        Explore Projects
      </Button>
    </div>
  </div>

  <!-- Search & Status Filter Tabs -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <!-- Filter Tabs -->
    <div class="flex items-center p-1 rounded-lg bg-secondary/80 border border-border w-fit">
      <button
        type="button"
        class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer {activeTab === 'all' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = "all")}
      >
        All ({data.myTickets.length})
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer {activeTab === 'todo' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = "todo")}
      >
        To Do ({data.myTickets.filter((t) => t.status === "todo").length})
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer {activeTab === 'in_progress' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = "in_progress")}
      >
        In Progress ({data.myTickets.filter((t) => t.status === "in_progress").length})
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer {activeTab === 'done' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = "done")}
      >
        Done ({data.myTickets.filter((t) => t.status === "done").length})
      </button>
    </div>

    <!-- Search query -->
    <div class="relative w-full max-w-xs">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari tugas saya..."
        bind:value={searchQuery}
        class="pl-9 bg-card"
      />
    </div>
  </div>

  <!-- Tickets List -->
  <div class="space-y-3">
    {#each filteredTickets as ticket (ticket.id)}
      {@const proj = projectMap.get(ticket.projectId)}
      {@const conf = statusConfig[ticket.status] || statusConfig.todo}
      <div
        role="button"
        tabindex="0"
        on:click={() => openDetail(ticket)}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") openDetail(ticket);
        }}
        class="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group text-left"
      >
        <div class="space-y-1.5 min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            {#if proj}
              <a
                href="/projects/{proj.id}"
                on:click|stopPropagation
                class="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
              >
                <FolderKanban class="h-3 w-3" />
                {proj.name}
              </a>
              <span class="text-muted-foreground/40">&middot;</span>
            {/if}
            <Badge variant="outline" class="text-[10px] font-mono">
              #{ticket.id}
            </Badge>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border {conf.bg}">
              <svelte:component this={conf.icon} class="h-3 w-3" />
              {conf.label}
            </span>
          </div>

          <h3 class="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            {ticket.title}
          </h3>

          {#if ticket.description}
            <p class="text-xs text-muted-foreground line-clamp-1">
              {ticket.description}
            </p>
          {/if}
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <!-- Quick Status Actions -->
          <form
            method="POST"
            action="?/updateStatus"
            use:enhance={() => {
              return async ({ result, update }) => {
                await update();
                if (result.type === "success") {
                  showToast("Status tiket diperbarui!", "success");
                }
              };
            }}
          >
            <input type="hidden" name="ticketId" value={ticket.id} />
            <input type="hidden" name="projectId" value={ticket.projectId} />

            {#if ticket.status === "todo"}
              <input type="hidden" name="status" value="in_progress" />
              <Button type="submit" variant="outline" size="sm" class="text-xs h-8" on:click={(e) => e.stopPropagation()}>
                Mulai Kerjakan &rarr;
              </Button>
            {:else if ticket.status === "in_progress"}
              <input type="hidden" name="status" value="done" />
              <Button type="submit" variant="default" size="sm" class="text-xs h-8" on:click={(e) => e.stopPropagation()}>
                Tandai Selesai &check;
              </Button>
            {:else}
              <input type="hidden" name="status" value="todo" />
              <Button type="submit" variant="ghost" size="sm" class="text-xs h-8 text-muted-foreground" on:click={(e) => e.stopPropagation()}>
                Buka Kembali
              </Button>
            {/if}
          </form>

          {#if proj}
            <Button
              variant="ghost"
              size="icon"
              href="/projects/{proj.id}"
              on:click={(e) => e.stopPropagation()}
              class="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Buka Kanban Board"
            >
              <ArrowRight class="h-4 w-4" />
            </Button>
          {/if}
        </div>
      </div>
    {/each}

    {#if filteredTickets.length === 0}
      <div class="p-12 text-center rounded-xl border border-dashed border-border bg-card space-y-3">
        <div class="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
          <CheckSquare class="h-6 w-6" />
        </div>
        <p class="font-semibold text-foreground text-sm">
          {searchQuery ? `Tidak ada tiket yang cocok dengan "${searchQuery}"` : "Belum ada tiket yang ditugaskan kepada Anda"}
        </p>
        <p class="text-xs text-muted-foreground max-w-sm mx-auto">
          Tiket yang ditugaskan kepada Anda oleh admin atau tim di project mana saja akan otomatis terkumpul di halaman ini.
        </p>
      </div>
    {/if}
  </div>
</div>

<!-- Ticket Detail Modal -->
<TicketDetailModal
  bind:open={isDetailModalOpen}
  ticket={selectedTicket}
  users={data.users}
  currentUser={data.currentUser}
  on:ticketUpdated={(e) => {
    // update in local state
    const updated = e.detail;
    data.myTickets = data.myTickets.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
    selectedTicket = updated;
  }}
  on:ticketDeleted={(e) => {
    const deletedId = e.detail;
    data.myTickets = data.myTickets.filter((t) => t.id !== deletedId);
  }}
/>
