import { NewsItem, NewsSource } from "./types";
import { parseRSSFeed } from "./rss-utils";
import { classifyCategory } from "../categories";
import { generateId } from "../utils";

const QUERIES = [
  { q: "fintech india", label: "Fintech India" },
  { q: "india fintech regulation RBI SEBI", label: "Fintech Regulations" },
  { q: "india UPI digital payments NPCI", label: "Digital Payments India" },
  { q: "india fintech funding startup", label: "Fintech Funding" },
  { q: "india fintech product launch app", label: "Fintech Products" },
  { q: "india neobank digital banking NBFC", label: "Digital Banking" },
];

function buildGoogleNewsUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=en-IN&gl=IN&ceid=IN:en`;
}

async function fetchGoogleNewsQuery(query: string): Promise<NewsItem[]> {
  const url = buildGoogleNewsUrl(query);
  const items = await parseRSSFeed(url);

  return items.map((item) => ({
    id: generateId(item.link),
    title: item.title,
    description: item.description,
    url: item.link,
    sourceId: "google-news",
    sourceName: item.source || "Google News",
    publishedAt: new Date(item.pubDate).toISOString(),
    category: classifyCategory(item.title, item.description),
    author: item.creator,
  }));
}

export const googleNewsSource: NewsSource = {
  id: "google-news",
  name: "Google News",
  type: "rss",
  fetch: async () => {
    const results = await Promise.allSettled(
      QUERIES.map((q) => fetchGoogleNewsQuery(q.q))
    );

    const allItems: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }
    return allItems;
  },
};
