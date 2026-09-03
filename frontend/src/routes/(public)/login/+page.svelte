<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
  import { page } from "$app/stores";
  import { KanbanSquare, Mail, Lock, AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-svelte";

  export let form: { error?: string } | null = null;
  let loading = false;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
  <div class="w-full max-w-md">
    <!-- Brand Header -->
    <div class="flex flex-col items-center mb-8 text-center">
      <div class="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 mb-3 ring-8 ring-primary/10">
        <KanbanSquare class="h-6 w-6" />
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Mini Jira</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Project tracking & agile workflow simplified</p>
    </div>

    <!-- Login Card -->
    <Card class="border-slate-200/80 shadow-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm">
      <CardHeader class="space-y-1 pb-4">
        <CardTitle class="text-xl">Sign in to your account</CardTitle>
        <CardDescription>Enter your email and password to access your workspaces</CardDescription>
      </CardHeader>

      <form
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        <CardContent class="space-y-4">
          {#if $page.url.searchParams.get("registered") === "true"}
            <div class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Akun berhasil didaftarkan! Silakan masuk dengan akun baru Anda.</span>
            </div>
          {/if}

          {#if form?.error}
            <div class="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle class="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{form.error}</span>
            </div>
          {/if}

          <div class="space-y-1.5">
            <label for="email" class="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email Address
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail class="h-4 w-4" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                class="pl-9"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
            </div>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock class="h-4 w-4" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                class="pl-9"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3 pt-2">
          <Button type="submit" disabled={loading} class="w-full">
            {#if loading}
              <Loader2 class="h-4 w-4 animate-spin mr-2" />
              Signing in...
            {:else}
              Sign In
            {/if}
          </Button>

          <div class="relative w-full my-1">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div class="relative flex justify-center text-[11px] uppercase">
              <span class="bg-white dark:bg-slate-900 px-2 text-slate-400">Belum punya akun?</span>
            </div>
          </div>

          <Button variant="outline" href="/register" class="w-full">
            <UserPlus class="h-4 w-4 mr-1.5" />
            Daftar Akun Baru
          </Button>

          <p class="text-xs text-center text-slate-400 dark:text-slate-500 mt-1">
            Protected by token authentication
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>
