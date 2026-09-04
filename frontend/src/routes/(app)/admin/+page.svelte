<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import type { PageData } from "./$types";
  import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Activity,
    ArrowRight,
    TrendingUp,
    Clock,
    ShieldCheck,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Circle,
  } from "lucide-svelte";

  export let data: PageData;

  $: stats = data.stats;
  $: metrics = stats?.metrics;

  function formatTime(dateStr?: string) {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
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

<div class="max-w-6xl mx-auto space-y-6 sm:space-y-8">
  <!-- Dashboard Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
    <div>
      <div class="flex items-center gap-2.5">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2 sm:gap-3">
          Admin Dashboard
          <Badge variant="default" class="text-xs uppercase font-extrabold tracking-wider gap-1">
            <ShieldCheck class="h-3.5 w-3.5" />
            Executive Overview
          </Badge>
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-muted-foreground mt-1">
        Pantau kesehatan workspace, distribusi sprint tiket, beban kerja tim, dan audit aktivitas sistem secara terpusat.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
      <Button variant="outline" size="sm" href="/admin/users" class="flex-1 sm:flex-none justify-center">
        <Users class="h-4 w-4 mr-1.5" />
        Manage Users
      </Button>
      <Button variant="default" size="sm" href="/projects" class="flex-1 sm:flex-none justify-center">
        <FolderKanban class="h-4 w-4 mr-1.5" />
        All Projects
      </Button>
    </div>
  </div>

  {#if metrics}
    <!-- Top KPI Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Projects -->
      <Card class="bg-card border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Projects
          </CardTitle>
          <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FolderKanban class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">{metrics.totalProjects}</div>
          <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">Aktif</span> di workspace
          </p>
        </CardContent>
      </Card>

      <!-- Total Tickets & Completion -->
      <Card class="bg-card border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Issues / Tiket
          </CardTitle>
          <div class="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckSquare class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">{metrics.totalTickets}</div>
          <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{metrics.completionRate}%</span> selesai ({metrics.doneTickets} done)
          </p>
        </CardContent>
      </Card>

      <!-- In Progress / Active Workload -->
      <Card class="bg-card border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            In Progress (Sedang Berjalan)
          </CardTitle>
          <div class="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <TrendingUp class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">{metrics.inProgressTickets}</div>
          <p class="text-xs text-muted-foreground mt-1">
            {metrics.todoTickets} tiket menunggu di To Do
          </p>
        </CardContent>
      </Card>

      <!-- Total Users & Role breakdown -->
      <Card class="bg-card border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Anggota Terdaftar
          </CardTitle>
          <div class="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">{metrics.totalUsers}</div>
          <p class="text-xs text-muted-foreground mt-1">
            {metrics.totalAdmins} Admin &middot; {metrics.totalMembers} Member
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Overall Sprint Health & Progress Bar -->
    <Card class="bg-card border-border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-bold text-foreground">Distribusi Status Tiket Global</CardTitle>
            <CardDescription class="text-xs text-muted-foreground">
              Total progres kumulatif di seluruh papan Kanban
            </CardDescription>
          </div>
          <span class="text-sm font-bold text-foreground">{metrics.completionRate}% Selesai</span>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Multi-segment progress bar -->
        <div class="h-3 w-full rounded-full bg-secondary overflow-hidden flex">
          {#if metrics.totalTickets > 0}
            <div
              class="h-full bg-emerald-500 transition-all"
              style="width: {(metrics.doneTickets / metrics.totalTickets) * 100}%"
              title="Done: {metrics.doneTickets}"
            ></div>
            <div
              class="h-full bg-sky-500 transition-all"
              style="width: {(metrics.inProgressTickets / metrics.totalTickets) * 100}%"
              title="In Progress: {metrics.inProgressTickets}"
            ></div>
            <div
              class="h-full bg-zinc-400 dark:bg-zinc-600 transition-all"
              style="width: {(metrics.todoTickets / metrics.totalTickets) * 100}%"
              title="To Do: {metrics.todoTickets}"
            ></div>
          {/if}
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>Done: <strong class="text-foreground">{metrics.doneTickets}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
              <span>In Progress: <strong class="text-foreground">{metrics.inProgressTickets}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600"></span>
              <span>To Do: <strong class="text-foreground">{metrics.todoTickets}</strong></span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-muted-foreground">
            <MessageSquare class="h-3.5 w-3.5" />
            <span>{metrics.totalComments} total komentar diskusi</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Two-Column Analytics: Projects vs Team Workload -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Projects Progress List -->
      <Card class="bg-card border-border shadow-xs flex flex-col">
        <CardHeader class="pb-3 border-b border-border">
          <div class="flex items-center justify-between">
            <CardTitle class="text-base font-bold text-foreground">Progres Tiap Project</CardTitle>
            <span class="text-xs text-muted-foreground">{stats.projectsOverview.length} Projects</span>
          </div>
        </CardHeader>
        <CardContent class="flex-1 p-0 overflow-hidden">
          <div class="divide-y divide-border">
            {#each stats.projectsOverview as proj (proj.id)}
              <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                <div class="space-y-1 pr-4 min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <a href="/projects/{proj.id}" class="font-semibold text-sm text-foreground hover:underline truncate">
                      {proj.name}
                    </a>
                    <Badge variant="outline" class="text-[10px] font-mono">
                      PROJ-{proj.id}
                    </Badge>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{proj.ticketCount} Issues</span>
                    <span>&middot;</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">{proj.completionRate}% Selesai</span>
                  </div>
                  <div class="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1 max-w-xs">
                    <div class="h-full bg-emerald-500" style="width: {proj.completionRate}%"></div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" href="/projects/{proj.id}" class="h-8 w-8 shrink-0" title="Buka Board">
                  <ArrowRight class="h-4 w-4" />
                </Button>
              </div>
            {/each}

            {#if stats.projectsOverview.length === 0}
              <div class="p-8 text-center text-muted-foreground text-xs">
                Belum ada project yang dibuat.
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>

      <!-- Team Workload Distribution -->
      <Card class="bg-card border-border shadow-xs flex flex-col">
        <CardHeader class="pb-3 border-b border-border">
          <div class="flex items-center justify-between">
            <CardTitle class="text-base font-bold text-foreground">Beban Kerja Tim (Assignees)</CardTitle>
            <span class="text-xs text-muted-foreground">{stats.teamWorkload.length} Members</span>
          </div>
        </CardHeader>
        <CardContent class="flex-1 p-0 overflow-hidden">
          <div class="divide-y divide-border">
            {#each stats.teamWorkload as member (member.id)}
              <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center ring-2 ring-border shrink-0">
                    {member.name ? member.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "U"}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-foreground truncate">
                      {member.name}
                    </p>
                    <p class="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 text-xs shrink-0">
                  <span class="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">
                    {member.assignedCount} Ditugaskan
                  </span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {member.doneCount} Done
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Live System Activity Stream (Audit Logs) -->
    <Card class="bg-card border-border shadow-xs">
      <CardHeader class="pb-3 border-b border-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Activity class="h-4 w-4 text-primary" />
            <CardTitle class="text-base font-bold text-foreground">Audit Trail & Aktivitas Sistem Terkini</CardTitle>
          </div>
          <span class="text-xs text-muted-foreground">10 Aktivitas Terakhir</span>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="divide-y divide-border">
          {#each stats.recentActivity as log (log.id)}
            <div class="p-3.5 flex items-center justify-between text-xs hover:bg-accent/20 transition-colors">
              <div class="flex items-center gap-3">
                <div class="h-7 w-7 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-[10px]">
                  {log.actorName ? log.actorName[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p class="text-foreground font-medium">
                    <strong class="font-semibold">{log.actorName ?? "Pengguna"}</strong>
                    {#if log.action === "status_changed"}
                      mengubah status tiket <span class="text-primary font-semibold">#{log.ticketId} ({log.ticketTitle ?? 'Tiket'})</span>
                    {:else if log.action === "comment_added"}
                      menambahkan komentar pada tiket <span class="text-primary font-semibold">#{log.ticketId} ({log.ticketTitle ?? 'Tiket'})</span>
                    {:else}
                      melakukan aksi <code>{log.action}</code>
                    {/if}
                  </p>
                  {#if log.meta}
                    <p class="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {log.meta}
                    </p>
                  {/if}
                </div>
              </div>

              <span class="text-muted-foreground text-[11px] shrink-0 pl-3">
                {formatTime(log.createdAt)}
              </span>
            </div>
          {/each}

          {#if stats.recentActivity.length === 0}
            <div class="p-8 text-center text-muted-foreground text-xs italic">
              Belum ada catatan aktivitas di sistem.
            </div>
          {/if}
        </div>
      </CardContent>
    </Card>
  {/if}
</div>
