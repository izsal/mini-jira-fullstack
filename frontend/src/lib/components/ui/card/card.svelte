<script lang="ts">
  import { cn } from "$lib/utils";

  let className: string = "";
  export { className as class };
</script>

<div
  class={cn(
    "rounded-xl border border-slate-200/80 bg-card text-card-foreground shadow-sm transition-all dark:border-slate-800",
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
