import Parser from "rss-parser";
import { stripHtml } from "../utils";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; FintechPulseBot/1.0; +https://fintech-pulse-india.vercel.app)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  creator?: string;
  categories?: string[];
  source?: string;
}

export async function parseRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: stripHtml(item.title || "Untitled"),
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      description: stripHtml(item.contentSnippet || item.content || ""),
      content: item["content:encoded"]
        ? stripHtml(item["content:encoded"] as string)
        : undefined,
      creator: item.creator || item["dc:creator"] as string | undefined,
      categories: item.categories,
      source: (item.source as unknown as { name?: string })?.name || undefined,
    }));
  } catch (error) {
    console.error(`[RSS] Failed to parse feed: ${url}`, error);
    return [];
  }
}
