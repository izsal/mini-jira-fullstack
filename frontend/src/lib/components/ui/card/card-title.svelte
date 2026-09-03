<script lang="ts">
  import { cn } from "$lib/utils";

  let className: string = "";
  export { className as class };
</script>

<h3
  class={cn("text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100", className)}
  {...$$restProps}
>
  <slot />
</h3>
