<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import { Button } from "./ui/button";
  import { Badge } from "./ui/badge";
  import {
    MessageSquare,
    User,
    Clock,
    Send,
    Loader2,
    Trash2,
    CheckCircle2,
    Circle,
    UserCheck,
    AlertCircle,
  } from "lucide-svelte";
  import { showToast } from "$lib/stores/ui";
  import { env } from "$env/dynamic/public";

  const dispatch = createEventDispatcher();
  const API_BASE = env.PUBLIC_API_URL || "http://localhost:3000";

  export let open = false;
  export let ticket: {
    id: number;
    projectId: number;
    title: string;
    description?: string;
    status: string;
    assigneeId?: number | null;
    assignee?: { id: number; name: string; email: string } | null;
    createdAt?: string;
  } | null = null;

  export let users: { id: number; name: string; email: string; role: string }[] = [];
  export let currentUser: { id: number; name: string; email: string; role: string } | null = null;

  type CommentItem = {
    id: number;
    ticketId: number;
    body: string;
    createdAt: string;
    author: { id: number; name: string; email: string };
  };

  let comments: CommentItem[] = [];
  let commentsLoading = false;
  let newCommentText = "";
  let commentSubmitting = false;

  let isUpdating = false;
  let isDeleting = false;
  let showDeleteConfirm = false;

  $: if (open && ticket?.id) {
    loadComments(ticket.id);
  }

  async function loadComments(ticketId: number) {
    commentsLoading = true;
    try {
      const res = await fetch(`${API_BASE}/api/tickets/${ticketId}/comments`, {
        credentials: "include",
      });
      if (res.ok) {
        comments = await res.json();
      } else {
        comments = [];
      }
    } catch {
      comments = [];
    } finally {
      commentsLoading = false;
    }
  }

  async function handleAddComment() {
    if (!ticket || !newCommentText.trim() || commentSubmitting) return;

    commentSubmitting = true;
    const body = newCommentText.trim();

    try {
      const res = await fetch(`${API_BASE}/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body }),
      });

      if (res.ok) {
        const createdComment = await res.json();
        comments = [...comments, createdComment];
        newCommentText = "";
        showToast("Komentar berhasil ditambahkan!", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Gagal menambahkan komentar", "error");
      }
    } catch {
      showToast("Gagal menambahkan komentar", "error");
    } finally {
      commentSubmitting = false;
    }
  }

  async function handleUpdateField(fields: Record<string, any>) {
    if (!ticket || isUpdating) return;

    isUpdating = true;
    const currentTicket = ticket;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${currentTicket.projectId}/tickets/${currentTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        const updated = await res.json();
        let updatedAssignee = currentTicket.assignee;
        if (fields.assigneeId !== undefined) {
          const matched = users.find((u) => u.id === Number(fields.assigneeId));
          updatedAssignee = matched ? { id: matched.id, name: matched.name, email: matched.email } : null;
        }
        ticket = {
          ...currentTicket,
          ...updated,
          assignee: updatedAssignee,
        };
        dispatch("ticketUpdated", ticket);
        showToast("Tiket berhasil diperbarui", "success");
      } else {
        showToast("Gagal memperbarui tiket", "error");
      }
    } catch {
      showToast("Gagal memperbarui tiket", "error");
    } finally {
      isUpdating = false;
    }
  }

  async function handleDeleteTicket() {
    if (!ticket || isDeleting) return;

    isDeleting = true;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${ticket.projectId}/tickets/${ticket.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        showToast(`Tiket #${ticket.id} telah dihapus`, "success");
        open = false;
        showDeleteConfirm = false;
        dispatch("ticketDeleted", ticket.id);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Gagal menghapus tiket", "error");
      }
    } catch {
      showToast("Gagal menghapus tiket", "error");
    } finally {
      isDeleting = false;
    }
  }

  function assignToMe() {
    if (!currentUser) return;
    handleUpdateField({ assigneeId: currentUser.id });
  }

  function formatTime(dateStr?: string) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }
</script>

<Modal bind:open title="Detail Issue #{ticket?.id ?? ''}">
  {#if ticket}
    <div class="space-y-6">
      <!-- Title & Status Header -->
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-foreground leading-snug">
          {ticket.title}
        </h3>

        <!-- Control Row: Status & Assignee -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <!-- Status Selector -->
          <div class="space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Status
            </span>
            <select
              value={ticket.status}
              on:change={(e) => handleUpdateField({ status: e.currentTarget.value })}
              disabled={isUpdating}
              class="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <!-- Assignee Selector -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Assignee
              </span>
              {#if currentUser && ticket.assigneeId !== currentUser.id}
                <button
                  type="button"
                  on:click={assignToMe}
                  disabled={isUpdating}
                  class="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                >
                  Assign to me
                </button>
              {/if}
            </div>
            <select
              value={ticket.assigneeId ?? ""}
              on:change={(e) => handleUpdateField({ assigneeId: e.currentTarget.value ? Number(e.currentTarget.value) : null })}
              disabled={isUpdating}
              class="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Unassigned</option>
              {#each users as u (u.id)}
                <option value={u.id}>
                  {u.name} {u.id === currentUser?.id ? "(You)" : ""}
                </option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <!-- Description Block -->
      <div class="space-y-1.5 pt-2 border-t border-border">
        <span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
          Description
        </span>
        {#if ticket.description}
          <div class="rounded-lg bg-muted/40 p-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border/50">
            {ticket.description}
          </div>
        {:else}
          <p class="text-xs text-muted-foreground italic">No description provided.</p>
        {/if}
      </div>

      <!-- Comments / Discussion Section -->
      <div class="space-y-3 pt-2 border-t border-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare class="h-4 w-4 text-primary" />
            <span>Discussion ({comments.length})</span>
          </div>
          {#if commentsLoading}
            <Loader2 class="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          {/if}
        </div>

        <!-- Comments List -->
        <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {#each comments as c (c.id)}
            <div class="rounded-lg border border-border/70 bg-card p-2.5 space-y-1 text-xs">
              <div class="flex items-center justify-between text-muted-foreground">
                <div class="flex items-center gap-1.5 font-semibold text-foreground">
                  <div class="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold">
                    {c.author.name ? c.author.name[0].toUpperCase() : "U"}
                  </div>
                  <span>{c.author.name}</span>
                </div>
                <span class="text-[10px]">{formatTime(c.createdAt)}</span>
              </div>
              <p class="text-foreground pl-6.5 whitespace-pre-wrap leading-relaxed">
                {c.body}
              </p>
            </div>
          {/each}

          {#if comments.length === 0 && !commentsLoading}
            <p class="text-xs text-muted-foreground text-center py-3 italic">
              Belum ada komentar. Mulai diskusi pertama di bawah!
            </p>
          {/if}
        </div>

        <!-- New Comment Input Form -->
        <div class="flex items-end gap-2 pt-1">
          <div class="flex-1">
            <textarea
              bind:value={newCommentText}
              placeholder="Tulis komentar atau update progres..."
              rows="2"
              class="w-full rounded-md border border-input bg-card p-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none shadow-xs"
              on:keydown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            ></textarea>
          </div>
          <Button
            type="button"
            size="sm"
            on:click={handleAddComment}
            disabled={!newCommentText.trim() || commentSubmitting}
            class="h-9 px-3 shrink-0"
          >
            {#if commentSubmitting}
              <Loader2 class="h-3.5 w-3.5 animate-spin" />
            {:else}
              <Send class="h-3.5 w-3.5 mr-1" />
              Kirim
            {/if}
          </Button>
        </div>
      </div>

      <!-- Admin Actions Footer (Delete Ticket) -->
      <div class="flex items-center justify-between pt-4 border-t border-border">
        {#if currentUser?.role === "admin"}
          {#if !showDeleteConfirm}
            <button
              type="button"
              on:click={() => (showDeleteConfirm = true)}
              class="text-xs text-destructive hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 class="h-3.5 w-3.5" />
              <span>Hapus Tiket (Admin)</span>
            </button>
          {:else}
            <div class="flex items-center gap-2">
              <span class="text-xs text-destructive font-semibold">Yakin hapus?</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                on:click={handleDeleteTicket}
                disabled={isDeleting}
              >
                {#if isDeleting}
                  <Loader2 class="h-3.5 w-3.5 animate-spin mr-1" />
                {/if}
                Ya, Hapus
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                on:click={() => (showDeleteConfirm = false)}
              >
                Batal
              </Button>
            </div>
          {/if}
        {:else}
          <div></div>
        {/if}

        <Button variant="outline" size="sm" on:click={() => (open = false)}>
          Tutup
        </Button>
      </div>
    </div>
  {/if}
</Modal>
