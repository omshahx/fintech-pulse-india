import { Skeleton } from "../ui/Skeleton";

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12 ml-auto" />
      </div>
      <Skeleton className="h-5 w-full mb-1" />
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center gap-3 mt-auto pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12 ml-auto" />
      </div>
    </div>
  );
}
