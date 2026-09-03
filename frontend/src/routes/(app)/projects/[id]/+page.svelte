<script lang="ts">
  import { enhance } from "$app/forms";
  import KanbanColumn from "$lib/components/KanbanColumn.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import Modal from "$lib/components/Modal.svelte";
  import { showToast } from "$lib/stores/ui";
  import type { PageData, ActionData } from "./$types";
  import { ArrowLeft, Plus, Search, Loader2, AlertCircle } from "lucide-svelte";

  export let data: PageData;
  export let form: ActionData;

  let searchQuery = "";
  let isCreateModalOpen = false;
  let selectedStatus = "todo";
  let createLoading = false;

  function openCreateModal(status = "todo") {
    selectedStatus = status;
    isCreateModalOpen = true;
  }

  async function handleMoveTicket(ticketId: number, targetStatus: string) {
    const ticket = data.tickets.find((t: any) => t.id === ticketId);
    if (!ticket || ticket.status === targetStatus) return;

    const prevStatus = ticket.status;
    ticket.status = targetStatus;
    data.tickets = [...data.tickets];

    const formData = new FormData();
    formData.append("ticketId", String(ticketId));
    formData.append("status", targetStatus);

    try {
      const res = await fetch("?/updateStatus", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        ticket.status = prevStatus;
        data.tickets = [...data.tickets];
        showToast("Gagal memindahkan status tiket", "error");
      } else {
        const friendly =
          targetStatus === "in_progress"
            ? "In Progress"
            : targetStatus === "done"
            ? "Done"
            : "To Do";
        showToast(`Tiket #${ticketId} dipindahkan ke ${friendly}`, "success");
      }
    } catch (_) {
      ticket.status = prevStatus;
      data.tickets = [...data.tickets];
      showToast("Gagal memindahkan status tiket", "error");
    }
  }

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
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" href="/projects" class="h-9 w-9 text-muted-foreground hover:text-foreground" title="Back to projects">
        <ArrowLeft class="h-4 w-4" />
      </Button>

      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-foreground">
            Kanban Board
          </h1>
          <Badge variant="outline" class="font-mono text-xs">
            {totalCount} Issues
          </Badge>
        </div>
        <p class="text-xs text-muted-foreground mt-0.5">
          Sprint workflow and task progress tracking
        </p>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3">
      <div class="relative w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filter tickets..."
          bind:value={searchQuery}
          class="h-9 pl-9 text-xs bg-card"
        />
      </div>

      <Button variant="default" size="sm" class="shadow-sm" on:click={() => openCreateModal("todo")}>
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        New Issue
      </Button>
    </div>
  </div>

  <!-- Progress Bar Overview -->
  <div class="flex items-center justify-between gap-4 p-3 bg-card text-card-foreground rounded-lg border border-border text-xs">
    <div class="flex items-center gap-4 text-muted-foreground">
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-zinc-400"></span>
        <span>To Do: <strong class="text-foreground">{todo.length}</strong></span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-sky-500"></span>
        <span>In Progress: <strong class="text-foreground">{inProgress.length}</strong></span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>Done: <strong class="text-foreground">{done.length}</strong></span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-muted-foreground">{completionRate}% Completed</span>
      <div class="w-28 h-2 bg-secondary rounded-full overflow-hidden border border-border">
        <div class="h-full bg-emerald-500 transition-all duration-300" style="width: {completionRate}%"></div>
      </div>
    </div>
  </div>

  <!-- Kanban Columns Container -->
  <div class="flex gap-6 overflow-x-auto pb-6 items-start">
    <KanbanColumn
      title="To Do"
      status="todo"
      tickets={todo}
      on:addTicket={(e) => openCreateModal(e.detail)}
      on:moveTicket={(e) => handleMoveTicket(e.detail.ticketId, e.detail.targetStatus)}
    />
    <KanbanColumn
      title="In Progress"
      status="in_progress"
      tickets={inProgress}
      on:addTicket={(e) => openCreateModal(e.detail)}
      on:moveTicket={(e) => handleMoveTicket(e.detail.ticketId, e.detail.targetStatus)}
    />
    <KanbanColumn
      title="Done"
      status="done"
      tickets={done}
      on:addTicket={(e) => openCreateModal(e.detail)}
      on:moveTicket={(e) => handleMoveTicket(e.detail.ticketId, e.detail.targetStatus)}
    />
  </div>
</div>

<!-- Modal Dialog Create Ticket -->
<Modal bind:open={isCreateModalOpen} title="Create New Issue / Ticket">
  <form
    method="POST"
    action="?/createTicket"
    use:enhance={() => {
      createLoading = true;
      return async ({ result, update }) => {
        await update();
        createLoading = false;
        if (result.type === "success") {
          isCreateModalOpen = false;
          showToast("Tiket berhasil ditambahkan!", "success");
        }
      };
    }}
    class="space-y-4"
  >
    {#if form?.error}
      <div class="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
        <AlertCircle class="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
        <span>{form.error}</span>
      </div>
    {/if}

    <div class="space-y-1.5">
      <label for="ticket-title" class="text-xs font-semibold uppercase tracking-wider text-foreground">
        Title / Task Summary <span class="text-rose-500">*</span>
      </label>
      <Input
        id="ticket-title"
        name="title"
        placeholder="e.g. Implement user profile avatar upload"
        required
      />
    </div>

    <div class="space-y-1.5">
      <label for="ticket-status" class="text-xs font-semibold uppercase tracking-wider text-foreground">
        Status Column
      </label>
      <select
        id="ticket-status"
        name="status"
        bind:value={selectedStatus}
        class="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <div class="space-y-1.5">
      <label for="ticket-desc" class="text-xs font-semibold uppercase tracking-wider text-foreground">
        Description
      </label>
      <textarea
        id="ticket-desc"
        name="description"
        placeholder="Add details, steps to reproduce, or acceptance criteria..."
        rows="3"
        class="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
      ></textarea>
    </div>

    <div class="flex items-center justify-end gap-3 pt-3 border-t border-border">
      <Button
        type="button"
        variant="outline"
        on:click={() => (isCreateModalOpen = false)}
        disabled={createLoading}
      >
        Batal
      </Button>
      <Button type="submit" disabled={createLoading}>
        {#if createLoading}
          <Loader2 class="h-4 w-4 animate-spin mr-2" />
          Menyimpan...
        {:else}
          <Plus class="h-4 w-4 mr-1.5" />
          Create Issue
        {/if}
      </Button>
    </div>
  </form>
</Modal>
