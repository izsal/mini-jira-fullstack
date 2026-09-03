<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLInputAttributes } from "svelte/elements";

  let className: string = "";
  export { className as class };
  export let value: any = undefined;
  export let type: HTMLInputAttributes["type"] = "text";
  export let placeholder: string = "";
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let name: string = "";
</script>

<input
  {type}
  {name}
  {placeholder}
  {disabled}
  {required}
  bind:value
  class={cn(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  on:input
  on:change
  on:focus
  on:blur
  on:keydown
  {...$$restProps}
/>
