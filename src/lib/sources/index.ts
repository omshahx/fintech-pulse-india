import { NewsItem, NewsSource, NewsFilters } from "./types";
import { googleNewsSource } from "./google-news";
import { inc42Source } from "./inc42";
import { rbiSource } from "./rbi";
import { cache, CACHE_TTL } from "../cache";
import { deduplicateByUrl, daysAgo } from "../utils";

const sources: NewsSource[] = [googleNewsSource, inc42Source, rbiSource];

export async function fetchAllNews(
  filters?: NewsFilters
): Promise<NewsItem[]> {
  const cacheKey = `news:all`;
  const cached = cache.get<NewsItem[]>(cacheKey);

  let items: NewsItem[];

  if (cached) {
    items = cached;
  } else {
    const results = await Promise.allSettled(
      sources.map((source) => source.fetch())
    );

    items = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        items.push(...result.value);
      } else {
        console.error("[Sources] Fetch failed:", result.reason);
      }
    }

    items = deduplicateByUrl(items);
    items.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    cache.set(cacheKey, items, CACHE_TTL.NEWS_FETCH);
  }

  // Apply filters
  if (filters?.category) {
    items = items.filter((item) => item.category === filters.category);
  }

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  if (filters?.source) {
    items = items.filter((item) => item.sourceId === filters.source);
  }

  if (filters?.days) {
    const cutoff = daysAgo(filters.days);
    items = items.filter(
      (item) => new Date(item.publishedAt) >= cutoff
    );
  }

  return items;
}

export function getSourcesList() {
  return sources.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
  }));
}
