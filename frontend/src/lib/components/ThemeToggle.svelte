<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import { Sun, Moon } from "lucide-svelte";

  onMount(() => {
    theme.init();
  });
</script>

<button
  type="button"
  on:click={() => theme.toggle()}
  class="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all shadow-xs cursor-pointer select-none"
  title={$theme === "dark" ? "Ganti ke Tema White" : "Ganti ke Tema Black"}
  aria-label="Toggle Black & White theme"
>
  {#if $theme === "dark"}
    <Sun class="h-4 w-4 transition-transform hover:rotate-45 duration-200 text-zinc-100" />
  {:else}
    <Moon class="h-4 w-4 transition-transform hover:-rotate-12 duration-200 text-zinc-800" />
  {/if}
</button>
