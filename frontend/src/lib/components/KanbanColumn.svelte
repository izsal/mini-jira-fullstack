<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import TicketCard from "./TicketCard.svelte";
  import { Plus, Circle, Clock, CheckCircle2 } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let title: string;
  export let status: "todo" | "in_progress" | "done" = "todo";
  export let tickets: {
    id: number;
    title: string;
    description?: string;
    status?: string;
    priority?: "low" | "medium" | "high";
  }[] = [];

  let isDragOver = false;

  $: isDone = status === "done" || title.toLowerCase().includes("done");
  $: isInProgress = status === "in_progress" || title.toLowerCase().includes("progress");

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    isDragOver = true;
  }

  function handleDragLeave() {
    isDragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const ticketId = e.dataTransfer?.getData("text/plain");
    if (ticketId) {
      dispatch("moveTicket", { ticketId: Number(ticketId), targetStatus: status });
    }
  }

  function forwardMoveTicket(e: CustomEvent<{ ticketId: number; targetStatus: string }>) {
    dispatch("moveTicket", e.detail);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  class="w-[85vw] max-w-[330px] sm:w-80 shrink-0 snap-center flex flex-col rounded-xl bg-muted/30 dark:bg-card/40 border transition-all duration-150 max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-12rem)] shadow-xs {isDragOver ? 'border-primary ring-2 ring-primary/20 bg-accent/60 scale-[1.01]' : 'border-border'}"
>
  <!-- Column Header -->
  <div class="p-3.5 flex items-center justify-between border-b border-border">
    <div class="flex items-center gap-2">
      {#if isDone}
        <CheckCircle2 class="h-4 w-4 text-emerald-500" />
      {:else if isInProgress}
        <Clock class="h-4 w-4 text-sky-500" />
      {:else}
        <Circle class="h-4 w-4 text-muted-foreground" />
      {/if}
      <h3 class="text-xs font-bold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <span class="inline-flex h-5 items-center justify-center rounded-full bg-secondary px-2 text-xs font-semibold text-secondary-foreground">
        {tickets.length}
      </span>
    </div>

    <button
      type="button"
      on:click={() => dispatch("addTicket", status)}
      class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
      title="Add ticket to {title}"
    >
      <Plus class="h-3.5 w-3.5" />
    </button>
  </div>

  <!-- Cards List Dropzone -->
  <div class="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[140px]">
    {#each tickets as ticket (ticket.id)}
      <TicketCard
        {ticket}
        on:moveTicket={forwardMoveTicket}
        on:openDetail={(e) => dispatch("openDetail", e.detail)}
      />
    {/each}

    {#if tickets.length === 0}
      <div class="h-28 flex flex-col items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors {isDragOver ? 'border-primary bg-primary/5 text-foreground font-medium' : ''}">
        <span>{isDragOver ? "Drop ticket here" : "No tickets yet"}</span>
      </div>
    {/if}
  </div>
</div>
