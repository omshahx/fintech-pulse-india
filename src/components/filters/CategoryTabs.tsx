"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export function CategoryTabs() {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === "all") return pathname === "/";
    return pathname === `/category/${slug}`;
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      <Link
        href="/"
        className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive("all")
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
        }`}
      >
        All
      </Link>
      {CATEGORIES.filter((c) => c.slug !== "general").map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(cat.slug)
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
