import { NewsItem, NewsSource } from "./types";
import { parseRSSFeed } from "./rss-utils";
import { classifyCategory } from "../categories";
import { generateId } from "../utils";

const INC42_RSS = "https://inc42.com/feed/";

export const inc42Source: NewsSource = {
  id: "inc42",
  name: "Inc42",
  type: "rss",
  fetch: async () => {
    const items = await parseRSSFeed(INC42_RSS);

    return items
      .filter((item) => {
        const text = `${item.title} ${item.description}`.toLowerCase();
        const fintechKeywords = [
          "fintech", "payment", "upi", "banking", "lending", "insurance",
          "wallet", "neobank", "nbfc", "rbi", "digital", "crypto",
          "blockchain", "credit", "debit", "loan", "startup", "funding",
        ];
        return fintechKeywords.some((kw) => text.includes(kw));
      })
      .map((item) => ({
        id: generateId(item.link),
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.link,
        sourceId: "inc42",
        sourceName: "Inc42",
        publishedAt: new Date(item.pubDate).toISOString(),
        category: classifyCategory(item.title, item.description),
        author: item.creator,
      }));
  },
};
