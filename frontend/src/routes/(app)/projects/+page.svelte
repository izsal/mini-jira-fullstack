<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { PageData, ActionData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import Modal from "$lib/components/Modal.svelte";
  import { showToast } from "$lib/stores/ui";
  import { FolderKanban, Plus, ArrowRight, Search, Clock, Loader2, AlertCircle, Trash2 } from "lucide-svelte";

  export let data: PageData;
  export let form: ActionData;

  let searchQuery = "";
  let isCreateModalOpen = false;
  let createLoading = false;
  let deletingId: number | null = null;

  $: currentUser = $page.data.user;

  $: filteredProjects = data.projects.filter((p: { name: string; key?: string }) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="max-w-6xl mx-auto space-y-8">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
        Projects
        <Badge variant="secondary" class="font-normal text-xs">
          {data.projects.length} Total
        </Badge>
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Manage your workspaces, track tasks, and collaborate with your team.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <Button variant="default" class="shadow-sm" on:click={() => (isCreateModalOpen = true)}>
        <Plus class="h-4 w-4 mr-1.5" />
        New Project
      </Button>
    </div>
  </div>

  <!-- Search and Filter Bar -->
  <div class="flex items-center justify-between gap-4">
    <div class="relative w-full max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search projects by name..."
        bind:value={searchQuery}
        class="pl-9 bg-card"
      />
    </div>
  </div>

  <!-- Projects Grid -->
  {#if filteredProjects.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredProjects as project (project.id)}
        <Card class="hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col group bg-card border-border">
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-2">
              <div class="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex items-center gap-1.5">
                <Badge variant="outline" class="text-[11px] font-mono uppercase bg-secondary">
                  PROJ-{project.id}
                </Badge>

                <!-- Delete Project Button (Admin or Owner) -->
                {#if currentUser?.role === "admin" || project.ownerId === currentUser?.id}
                  <form
                    method="POST"
                    action="?/delete"
                    use:enhance={() => {
                      deletingId = project.id;
                      return async ({ result, update }) => {
                        await update();
                        deletingId = null;
                        if (result.type === "success") {
                          showToast(`Project "${project.name}" berhasil dihapus`, "success");
                        }
                      };
                    }}
                    on:submit={(e) => {
                      if (!confirm(`Hapus project "${project.name}" beserta seluruh tiket dan diskusinya?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="projectId" value={project.id} />
                    <button
                      type="submit"
                      disabled={deletingId === project.id}
                      class="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
                      title="Hapus project (Admin / Owner)"
                      aria-label="Hapus project"
                    >
                      {#if deletingId === project.id}
                        <Loader2 class="h-3.5 w-3.5 animate-spin" />
                      {:else}
                        <Trash2 class="h-3.5 w-3.5" />
                      {/if}
                    </button>
                  </form>
                {/if}
              </div>
            </div>
            <CardTitle class="text-lg mt-3 group-hover:text-primary transition-colors">
              <a href="/projects/{project.id}" class="hover:underline">
                {project.name}
              </a>
            </CardTitle>
            <CardDescription class="line-clamp-2 mt-1 text-muted-foreground">
              {project.description || "Active agile workspace for ticket tracking and sprint planning."}
            </CardDescription>
          </CardHeader>

          <CardContent class="flex-1 text-xs text-muted-foreground space-y-2">
            <div class="flex items-center gap-2 pt-2 border-t border-border">
              <Clock class="h-3.5 w-3.5 text-muted-foreground" />
              <span>Owner: {project.owner?.name ?? "Team Member"}</span>
            </div>
          </CardContent>

          <CardFooter class="pt-0">
            <Button variant="secondary" size="sm" class="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors" href="/projects/{project.id}">
              <span class="text-xs font-medium">Open Kanban Board</span>
              <ArrowRight class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Empty State -->
    <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <div class="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
        <FolderKanban class="h-7 w-7" />
      </div>
      <h3 class="text-lg font-semibold text-foreground">
        {searchQuery ? "No matching projects found" : "No projects created yet"}
      </h3>
      <p class="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
        {searchQuery
          ? `We couldn't find any projects matching "${searchQuery}". Try a different keyword.`
          : "Get started by creating your first agile project to organize tasks and workflows."}
      </p>
      {#if !searchQuery}
        <Button variant="default" on:click={() => (isCreateModalOpen = true)}>
          <Plus class="h-4 w-4 mr-1.5" />
          Create First Project
        </Button>
      {:else}
        <Button variant="outline" on:click={() => (searchQuery = "")}>
          Clear Search
        </Button>
      {/if}
    </div>
  {/if}
</div>

<!-- Modal Dialog Create Project -->
<Modal bind:open={isCreateModalOpen} title="Create New Project">
  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      createLoading = true;
      return async ({ result, update }) => {
        await update();
        createLoading = false;
        if (result.type === "success") {
          isCreateModalOpen = false;
          showToast("Project berhasil dibuat!", "success");
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
      <label for="project-name" class="text-xs font-semibold uppercase tracking-wider text-foreground">
        Project Name <span class="text-rose-500">*</span>
      </label>
      <Input
        id="project-name"
        name="name"
        placeholder="e.g. Mobile Banking App, Core API"
        required
      />
    </div>

    <div class="space-y-1.5">
      <label for="project-desc" class="text-xs font-semibold uppercase tracking-wider text-foreground">
        Description
      </label>
      <textarea
        id="project-desc"
        name="description"
        placeholder="Short description of this project's roadmap and objectives..."
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
          Membuat Project...
        {:else}
          <Plus class="h-4 w-4 mr-1.5" />
          Buat Project
        {/if}
      </Button>
    </div>
  </form>
</Modal>
