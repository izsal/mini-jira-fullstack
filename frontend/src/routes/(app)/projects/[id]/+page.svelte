<script lang="ts">
  import KanbanColumn from "$lib/components/KanbanColumn.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import type { PageData } from "./$types";
  import { ArrowLeft, Plus, Search, Filter, KanbanSquare, SlidersHorizontal, CheckCircle2 } from "lucide-svelte";

  export let data: PageData;

  let searchQuery = "";

  $: filteredTickets = data.tickets.filter((t: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      String(t.id).includes(query)
    );
  });

  $: todo = filteredTickets.filter((t: any) => t.status === "todo");
  $: inProgress = filteredTickets.filter((t: any) => t.status === "in_progress");
  $: done = filteredTickets.filter((t: any) => t.status === "done");
  $: totalCount = data.tickets.length;
  $: doneCount = data.tickets.filter((t: any) => t.status === "done").length;
  $: completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
</script>

<div class="space-y-6">
  <!-- Board Top Navigation & Actions -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" href="/projects" class="h-9 w-9 text-slate-500 hover:text-slate-900" title="Back to projects">
        <ArrowLeft class="h-4 w-4" />
      </Button>

      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Kanban Board
          </h1>
          <Badge variant="outline" class="font-mono text-xs">
            {totalCount} Issues
          </Badge>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sprint workflow and task progress tracking
        </p>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3">
      <div class="relative w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          type="search"
          placeholder="Filter tickets..."
          bind:value={searchQuery}
          class="h-9 pl-9 text-xs bg-white dark:bg-slate-900"
        />
      </div>

      <Button variant="default" size="sm" class="shadow-sm">
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        New Issue
      </Button>
    </div>
  </div>

  <!-- Progress Bar Overview -->
  <div class="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs">
    <div class="flex items-center gap-4 text-slate-600 dark:text-slate-400">
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-slate-400"></span>
        <span>To Do: <strong class="text-slate-900 dark:text-slate-100">{todo.length}</strong></span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-sky-500"></span>
        <span>In Progress: <strong class="text-slate-900 dark:text-slate-100">{inProgress.length}</strong></span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>Done: <strong class="text-slate-900 dark:text-slate-100">{done.length}</strong></span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-slate-500">{completionRate}% Completed</span>
      <div class="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
        <div class="h-full bg-emerald-500 transition-all duration-300" style="width: {completionRate}%"></div>
      </div>
    </div>
  </div>

  <!-- Kanban Columns Container -->
  <div class="flex gap-6 overflow-x-auto pb-6 items-start">
    <KanbanColumn title="To Do" tickets={todo} />
    <KanbanColumn title="In Progress" tickets={inProgress} />
    <KanbanColumn title="Done" tickets={done} />
  </div>
</div>
