import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchAllNews } from "@/lib/sources";
import { getCategoryInfo, CATEGORIES } from "@/lib/categories";
import { Category } from "@/lib/sources/types";
import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { CategoryTabs } from "@/components/filters/CategoryTabs";
import { SearchBar } from "@/components/filters/SearchBar";
import { DateFilter } from "@/components/filters/DateFilter";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; days?: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== "general").map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = getCategoryInfo(slug);
  if (!cat) return {};
  return {
    title: `${cat.label} - Fintech Pulse India`,
    description: `Latest ${cat.label.toLowerCase()} news in Indian fintech.`,
  };
}

async function CategoryNewsContent({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<{ q?: string; days?: string }>;
}) {
  const params = await searchParams;
  const items = await fetchAllNews({
    category: slug as Category,
    q: params.q || undefined,
    days: params.days ? parseInt(params.days, 10) : 7,
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {getCategoryInfo(slug)?.label || slug}
          <span className="ml-2 text-sm font-normal text-zinc-400">
            {items.length} articles
          </span>
        </h2>
      </div>
      <NewsFeed items={items} />
    </section>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const catInfo = getCategoryInfo(slug);
  if (!catInfo) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {catInfo.label}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base">
          Latest {catInfo.label.toLowerCase()} updates in Indian fintech
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
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CategoryNewsContent slug={slug} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
