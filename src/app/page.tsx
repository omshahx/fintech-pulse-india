import { Suspense } from "react";
import { fetchAllNews } from "@/lib/sources";
import { FeaturedArticle } from "@/components/news/FeaturedArticle";
import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { CategoryTabs } from "@/components/filters/CategoryTabs";
import { SearchBar } from "@/components/filters/SearchBar";
import { DateFilter } from "@/components/filters/DateFilter";

interface HomeProps {
  searchParams: Promise<{ q?: string; days?: string }>;
}

async function NewsContent({ searchParams }: { searchParams: Promise<{ q?: string; days?: string }> }) {
  const params = await searchParams;
  const items = await fetchAllNews({
    q: params.q || undefined,
    days: params.days === "all" ? undefined : params.days ? parseInt(params.days, 10) : 7,
  });

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <>
      {featured && (
        <section className="mb-8">
          <FeaturedArticle item={featured} />
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Latest News
            <span className="ml-2 text-sm font-normal text-zinc-400">
              {rest.length} articles
            </span>
          </h2>
        </div>
        <NewsFeed items={rest} />
      </section>
    </>
  );
}

function NewsLoadingSkeleton() {
  return (
    <>
      <div className="mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
        <div className="animate-pulse space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800 mt-2" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Fintech Pulse
          <span className="text-emerald-600 dark:text-emerald-400"> India</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl">
          Real-time fintech news, regulations & insights from across India.
          AI-powered summaries at your fingertips.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <CategoryTabs />
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="w-full sm:max-w-xs">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <Suspense>
            <DateFilter />
          </Suspense>
        </div>
      </div>

      {/* News */}
      <Suspense fallback={<NewsLoadingSkeleton />}>
        <NewsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
