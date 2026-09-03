<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
  import { KanbanSquare, User, Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-svelte";

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
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Join your team workspace & track progress</p>
    </div>

    <!-- Register Card -->
    <Card class="border-slate-200/80 shadow-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm">
      <CardHeader class="space-y-1 pb-4">
        <CardTitle class="text-xl">Create your account</CardTitle>
        <CardDescription>Enter your details below to register a new user</CardDescription>
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
          {#if form?.error}
            <div class="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle class="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{form.error}</span>
            </div>
          {/if}

          <!-- Name Field -->
          <div class="space-y-1.5">
            <label for="name" class="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Full Name
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User class="h-4 w-4" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                class="pl-9"
              />
            </div>
          </div>

          <!-- Email Field -->
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

          <!-- Password Field -->
          <div class="space-y-1.5">
            <label for="password" class="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Password
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock class="h-4 w-4" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minlength={6}
                class="pl-9"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-4 pt-2">
          <Button type="submit" disabled={loading} class="w-full">
            {#if loading}
              <Loader2 class="h-4 w-4 animate-spin mr-2" />
              Registering account...
            {:else}
              Create Account
              <ArrowRight class="h-4 w-4 ml-1.5" />
            {/if}
          </Button>

          <div class="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
            Already have an account?{" "}
            <a href="/login" class="font-semibold text-primary hover:underline">
              Sign In
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>
