"use client";

import { useRouter, useSearchParams } from "next/navigation";

const DATE_OPTIONS = [
  { label: "Today", value: "1" },
  { label: "This Week", value: "7" },
  { label: "This Month", value: "30" },
  { label: "All Time", value: "" },
];

export function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDays = searchParams.get("days") || "7";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("days", value);
    } else {
      params.delete("days");
    }
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname);
  };

  return (
    <div className="flex items-center gap-1">
      {DATE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentDays === option.value || (!currentDays && !option.value)
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
