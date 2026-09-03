<script lang="ts">
  import "../app.css";
  import { toast } from "$lib/stores/ui";
  import { CheckCircle2, AlertCircle, X } from "lucide-svelte";
</script>

{#if $toast}
  <div class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 {$toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/80 dark:text-emerald-200' : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/80 dark:text-rose-200'}">
    {#if $toast.type === "success"}
      <CheckCircle2 class="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
    {:else}
      <AlertCircle class="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
    {/if}
    <p class="text-sm font-medium leading-none">{$toast.message}</p>
    <button
      type="button"
      on:click={() => toast.set(null)}
      class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-black/5 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-slate-100"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
{/if}

<slot />
