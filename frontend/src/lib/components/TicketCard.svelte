<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { GripVertical, AlertCircle, ArrowUpCircle, CheckCircle2 } from "lucide-svelte";

  export let ticket: {
    id: number;
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: string;
  };

  const priorityColor: Record<string, string> = {
    high: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
    medium: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    low: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
  };
</script>

<div
  class="group relative flex flex-col gap-2 rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md active:cursor-grabbing cursor-grab dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
>
  <!-- Card Header Row: Key + Priority -->
  <div class="flex items-center justify-between text-xs">
    <div class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
      <GripVertical class="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      <span>#{ticket.id}</span>
    </div>

    {#if ticket.priority}
      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border {priorityColor[ticket.priority] || ''}">
        {ticket.priority}
      </span>
    {/if}
  </div>

  <!-- Title -->
  <h4 class="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
    {ticket.title}
  </h4>

  <!-- Description snippet if present -->
  {#if ticket.description}
    <p class="text-xs text-slate-500 line-clamp-2 dark:text-slate-400 leading-relaxed">
      {ticket.description}
    </p>
  {/if}

  <!-- Footer Meta -->
  <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 mt-1">
    <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
      <span class="h-2 w-2 rounded-full {ticket.status === 'done' ? 'bg-emerald-500' : ticket.status === 'in_progress' ? 'bg-sky-500' : 'bg-slate-400'}"></span>
      <span class="capitalize">{ticket.status ? ticket.status.replace('_', ' ') : 'Task'}</span>
    </div>

    <div class="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300" title="Assigned member">
      U
    </div>
  </div>
</div>
