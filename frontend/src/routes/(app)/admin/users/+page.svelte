<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import { showToast } from "$lib/stores/ui";
  import type { PageData, ActionData } from "./$types";
  import {
    Users,
    ShieldCheck,
    User,
    Search,
    ShieldAlert,
    Loader2,
    Calendar,
    Mail,
    ArrowLeft,
  } from "lucide-svelte";

  export let data: PageData;
  export let form: ActionData;

  let searchQuery = "";
  let updatingId: number | null = null;

  $: filteredUsers = data.users.filter((u: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });

  function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }
</script>

<div class="max-w-5xl mx-auto space-y-8">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" href="/projects" class="h-9 w-9 text-muted-foreground hover:text-foreground" title="Back to projects">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          User Management
          <Badge variant="secondary" class="font-normal text-xs">
            {data.users.length} Users
          </Badge>
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          Manage workspace team members and administrator permissions.
        </p>
      </div>
    </div>
  </div>

  <!-- Search Filter -->
  <div class="flex items-center justify-between gap-4">
    <div class="relative w-full max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari user berdasarkan nama atau email..."
        bind:value={searchQuery}
        class="pl-9 bg-card"
      />
    </div>
  </div>

  {#if form?.error}
    <div class="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
      <ShieldAlert class="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Users Table Card -->
  <Card class="bg-card border-border shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-muted/40 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
          <tr>
            <th class="px-6 py-3.5">User</th>
            <th class="px-6 py-3.5">Email</th>
            <th class="px-6 py-3.5">Role</th>
            <th class="px-6 py-3.5">Terdaftar</th>
            <th class="px-6 py-3.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each filteredUsers as member (member.id)}
            <tr class="hover:bg-accent/40 transition-colors">
              <!-- Name & Avatar -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border shrink-0">
                    {member.name ? member.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "U"}
                  </div>
                  <div>
                    <p class="font-semibold text-foreground flex items-center gap-2">
                      {member.name}
                      {#if member.id === data.currentUser?.id}
                        <span class="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.2 rounded font-normal">
                          You
                        </span>
                      {/if}
                    </p>
                    <p class="text-xs text-muted-foreground">ID: #{member.id}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 text-muted-foreground">
                <div class="flex items-center gap-1.5">
                  <Mail class="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>{member.email}</span>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4">
                {#if member.role === "admin"}
                  <Badge variant="default" class="text-xs gap-1 font-semibold uppercase tracking-wider">
                    <ShieldCheck class="h-3 w-3" />
                    Admin
                  </Badge>
                {:else}
                  <Badge variant="secondary" class="text-xs gap-1 text-muted-foreground font-normal">
                    <User class="h-3 w-3" />
                    Member
                  </Badge>
                {/if}
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1.5">
                  <Calendar class="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>{formatDate(member.createdAt)}</span>
                </div>
              </td>

              <!-- Role Action -->
              <td class="px-6 py-4 text-right">
                <form
                  method="POST"
                  action="?/toggleRole"
                  use:enhance={() => {
                    updatingId = member.id;
                    return async ({ result, update }) => {
                      await update();
                      updatingId = null;
                      if (result.type === "success") {
                        showToast("Role pengguna berhasil diubah!", "success");
                      }
                    };
                  }}
                >
                  <input type="hidden" name="userId" value={member.id} />
                  {#if member.role === "admin"}
                    <input type="hidden" name="newRole" value="user" />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={updatingId === member.id || member.id === data.currentUser?.id}
                      title={member.id === data.currentUser?.id ? "Anda tidak dapat mencabut hak admin diri sendiri" : "Ubah ke Member biasa"}
                      class="text-xs"
                    >
                      {#if updatingId === member.id}
                        <Loader2 class="h-3 w-3 animate-spin mr-1" />
                      {/if}
                      Demote to Member
                    </Button>
                  {:else}
                    <input type="hidden" name="newRole" value="admin" />
                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={updatingId === member.id}
                      class="text-xs"
                    >
                      {#if updatingId === member.id}
                        <Loader2 class="h-3 w-3 animate-spin mr-1" />
                      {:else}
                        <ShieldCheck class="h-3 w-3 mr-1" />
                      {/if}
                      Make Admin
                    </Button>
                  {/if}
                </form>
              </td>
            </tr>
          {/each}

          {#if filteredUsers.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-12 text-center text-muted-foreground text-sm">
                Tidak ada pengguna yang cocok dengan pencarian "{searchQuery}".
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>
