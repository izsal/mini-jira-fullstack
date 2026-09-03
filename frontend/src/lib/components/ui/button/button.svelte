<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";

  type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  type Size = "default" | "sm" | "lg" | "icon";

  export let variant: Variant = "default";
  export let size: Size = "default";
  let className: string = "";
  export { className as class };
  export let type: HTMLButtonAttributes["type"] = "button";
  export let disabled: boolean = false;
  export let href: string | undefined = undefined;

  const variantStyles: Record<Variant, string> = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.98]",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizeStyles: Record<Size, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8 text-base",
    icon: "h-9 w-9 p-0",
  };
</script>

{#if href}
  <a
    {href}
    class={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer text-decoration-none",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}
    {...$$restProps}
  >
    <slot />
  </a>
{:else}
  <button
    {type}
    {disabled}
    class={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}
    on:click
    on:keydown
    {...$$restProps}
  >
    <slot />
  </button>
{/if}
