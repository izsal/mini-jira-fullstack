<script lang="ts">
  import TicketCard from "./TicketCard.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Plus, Circle, Clock, CheckCircle2 } from "lucide-svelte";

  export let title: string;
  export let tickets: {
    id: number;
    title: string;
    description?: string;
    status?: string;
    priority?: "low" | "medium" | "high";
  }[] = [];

  $: isDone = title.toLowerCase().includes("done");
  $: isInProgress = title.toLowerCase().includes("progress");
</script>

<div class="w-80 shrink-0 flex flex-col rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 max-h-[calc(100vh-12rem)] shadow-sm">
  <!-- Column Header -->
  <div class="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
    <div class="flex items-center gap-2">
      {#if isDone}
        <CheckCircle2 class="h-4 w-4 text-emerald-500" />
      {:else if isInProgress}
        <Clock class="h-4 w-4 text-sky-500" />
      {:else}
        <Circle class="h-4 w-4 text-slate-400" />
      {/if}
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      <span class="inline-flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {tickets.length}
      </span>
    </div>

    <button
      type="button"
      class="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
      title="Add ticket"
    >
      <Plus class="h-3.5 w-3.5" />
    </button>
  </div>

  <!-- Cards List -->
  <div class="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[120px]">
    {#each tickets as ticket (ticket.id)}
      <TicketCard {ticket} />
    {/each}

    {#if tickets.length === 0}
      <div class="h-24 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
        <span>No tickets yet</span>
      </div>
    {/if}
  </div>
</div>
