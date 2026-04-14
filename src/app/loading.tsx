import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-8 animate-pulse">
        <div className="h-10 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-2" />
        <div className="h-5 w-96 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
