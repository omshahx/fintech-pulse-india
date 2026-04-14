import { NewsItem, NewsSource } from "./types";
import { generateId } from "../utils";

const RBI_PRESS_URL =
  "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx";

export const rbiSource: NewsSource = {
  id: "rbi",
  name: "RBI",
  type: "scraper",
  fetch: async () => {
    try {
      const response = await fetch(RBI_PRESS_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; FintechPulseBot/1.0)",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(`[RBI] HTTP ${response.status}`);
        return [];
      }

      const html = await response.text();
      const items: NewsItem[] = [];

      // Parse press release links from the HTML table
      const rowRegex =
        /<tr[^>]*>[\s\S]*?<a[^>]*href="([^"]*prid=(\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<td[^>]*>([\d\/]+)<\/td>[\s\S]*?<\/tr>/gi;

      let match;
      while ((match = rowRegex.exec(html)) !== null) {
        const [, href, prid, titleHtml, dateStr] = match;
        const title = titleHtml.replace(/<[^>]*>/g, "").trim();
        if (!title) continue;

        // Parse DD/MM/YYYY date format
        const dateParts = dateStr.trim().split("/");
        let publishedAt: string;
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          publishedAt = new Date(
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
          ).toISOString();
        } else {
          publishedAt = new Date().toISOString();
        }

        const url = href.startsWith("http")
          ? href
          : `https://www.rbi.org.in${href.startsWith("/") ? "" : "/Scripts/"}${href}`;

        items.push({
          id: generateId(`rbi-${prid}`),
          title,
          description: `RBI Press Release: ${title}`,
          url,
          sourceId: "rbi",
          sourceName: "Reserve Bank of India",
          publishedAt,
          category: "regulations",
        });
      }

      return items.slice(0, 20);
    } catch (error) {
      console.error("[RBI] Scraper failed:", error);
      return [];
    }
  },
};
