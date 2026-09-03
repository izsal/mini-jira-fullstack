<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { GripVertical, ArrowRight, ArrowLeft, Check, RotateCcw } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let ticket: {
    id: number;
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: string;
    assigneeId?: number | null;
    assignee?: { id: number; name: string; email: string } | null;
  };

  let isDragging = false;

  const priorityColor: Record<string, string> = {
    high: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
    medium: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    low: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
  };

  function handleDragStart(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", String(ticket.id));
      e.dataTransfer.effectAllowed = "move";
    }
    isDragging = true;
  }

  function handleDragEnd() {
    isDragging = false;
  }

  function move(targetStatus: string) {
    dispatch("moveTicket", { ticketId: ticket.id, targetStatus });
  }

  function openDetail() {
    dispatch("openDetail", ticket);
  }

  $: assigneeInitials = ticket.assignee?.name
    ? ticket.assignee.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:click={openDetail}
  on:keydown={(e) => e.key === "Enter" && openDetail()}
  tabindex="0"
  role="button"
  class="group relative flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5 shadow-xs transition-all duration-150 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm active:cursor-grabbing cursor-pointer {isDragging ? 'opacity-40 scale-95 border-primary border-dashed' : 'opacity-100'}"
>
  <!-- Card Header Row: Key + Priority -->
  <div class="flex items-center justify-between text-xs">
    <div class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-muted-foreground">
      <GripVertical class="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors cursor-grab" />
      <span>#{ticket.id}</span>
    </div>

    {#if ticket.priority}
      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border {priorityColor[ticket.priority] || ''}">
        {ticket.priority}
      </span>
    {/if}
  </div>

  <!-- Title -->
  <h4 class="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
    {ticket.title}
  </h4>

  <!-- Description snippet if present -->
  {#if ticket.description}
    <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
      {ticket.description}
    </p>
  {/if}

  <!-- Quick Status Actions & Footer Meta -->
  <div class="flex items-center justify-between pt-2 border-t border-border mt-1 gap-2">
    <!-- Status Quick Transitions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="flex items-center gap-1" on:click|stopPropagation>
      {#if ticket.status === "todo"}
        <button
          type="button"
          on:click={() => move("in_progress")}
          class="inline-flex items-center gap-1 text-[10px] font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-2 py-0.5 rounded transition-all cursor-pointer"
          title="Move to In Progress"
        >
          <span>Start</span>
          <ArrowRight class="h-2.5 w-2.5" />
        </button>
      {:else if ticket.status === "in_progress"}
        <button
          type="button"
          on:click={() => move("todo")}
          class="inline-flex items-center gap-0.5 text-[10px] font-medium bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted px-1.5 py-0.5 rounded transition-all cursor-pointer"
          title="Move back to To Do"
        >
          <ArrowLeft class="h-2.5 w-2.5" />
          <span>Todo</span>
        </button>
        <button
          type="button"
          on:click={() => move("done")}
          class="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer"
          title="Mark as Done"
        >
          <span>Done</span>
          <Check class="h-2.5 w-2.5" />
        </button>
      {:else if ticket.status === "done"}
        <button
          type="button"
          on:click={() => move("in_progress")}
          class="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted px-2 py-0.5 rounded transition-all cursor-pointer"
          title="Reopen into In Progress"
        >
          <RotateCcw class="h-2.5 w-2.5" />
          <span>Reopen</span>
        </button>
      {/if}
    </div>

    <!-- Assigned Avatar -->
    {#if ticket.assignee}
      <div
        class="h-6 w-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold shrink-0"
        title="Assigned to {ticket.assignee.name} ({ticket.assignee.email})"
      >
        {assigneeInitials}
      </div>
    {:else}
      <div
        class="h-6 w-6 rounded-full border border-dashed border-border flex items-center justify-center text-[9px] text-muted-foreground font-medium shrink-0"
        title="Unassigned"
      >
        -
      </div>
    {/if}
  </div>
</div>
