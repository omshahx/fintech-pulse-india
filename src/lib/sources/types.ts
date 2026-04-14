export type Category =
  | "regulations"
  | "digital-payments"
  | "funding"
  | "product-launches"
  | "partnerships"
  | "banking"
  | "insurtech"
  | "lending"
  | "general";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  category: Category;
  imageUrl?: string;
  author?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  type: "rss" | "scraper";
  fetch: () => Promise<NewsItem[]>;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  category: string;
  sentiment: "positive" | "neutral" | "negative";
  method: "gemini" | "extractive";
}

export interface NewsFilters {
  category?: Category;
  q?: string;
  days?: number;
  source?: string;
}
