<script lang="ts">
  import { X } from "lucide-svelte";
  import { onMount } from "svelte";

  export let open = false;
  export let title = "";

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      open = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    on:click={(e) => { if (e.target === e.currentTarget) open = false; }}
    role="presentation"
  >
    <!-- Dialog Window -->
    <div
      class="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl transition-all duration-200 animate-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h3 id="modal-title" class="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
          {title}
        </h3>
        <button
          type="button"
          on:click={() => (open = false)}
          class="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0"
          aria-label="Close dialog"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-4 text-sm text-slate-600 dark:text-slate-300 overflow-y-auto flex-1 overscroll-contain pr-1">
        <slot />
      </div>
    </div>
  </div>
{/if}
