interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "category" | "primary";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const base = "inline-flex items-center gap-1 rounded-full text-xs font-medium px-2.5 py-0.5 transition-colors";

  const variants = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    outline: "border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
    category: className,
    primary: className,
  };

  return (
    <span className={`${base} ${variant === "category" ? "" : variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
