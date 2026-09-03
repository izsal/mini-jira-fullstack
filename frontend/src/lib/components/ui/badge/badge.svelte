<script lang="ts">
  import { cn } from "$lib/utils";

  type Variant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

  export let variant: Variant = "default";
  let className: string = "";
  export { className as class };

  const variantStyles: Record<Variant, string> = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground border-slate-200 dark:border-slate-800",
    success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium",
    warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium",
    info: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 font-medium",
  };
</script>

<div
  class={cn(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variantStyles[variant],
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
