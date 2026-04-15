import { NewsItem, SummaryResult } from "./sources/types";
import { CATEGORIES } from "./categories";

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: Array<{
    type: string;
    text?: string | { type: string; text: string };
    url?: string;
    style?: { bold?: boolean };
  }>;
  accessory?: unknown;
}

interface ArticleWithSummary {
  article: NewsItem;
  summary: SummaryResult;
}

function getCategoryEmoji(slug: string): string {
  const emojiMap: Record<string, string> = {
    regulations: "\u{1F4CB}",
    "digital-payments": "\u{1F4B3}",
    funding: "\u{1F4C8}",
    "product-launches": "\u{1F680}",
    partnerships: "\u{1F91D}",
    banking: "\u{1F3E6}",
    insurtech: "\u{1F6E1}",
    lending: "\u{1F4B0}",
    "kyc-compliance": "\u{1FAAA}",
    general: "\u{1F4F0}",
  };
  return emojiMap[slug] || "\u{1F4F0}";
}

export function formatSlackBrief(
  articles: ArticleWithSummary[],
  dashboardUrl?: string
): SlackBlock[] {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "\u{26A1} Fintech Pulse India \u2014 Daily Brief",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `*${today}* \u00B7 ${articles.length} articles summarized`,
        },
      ],
    },
    { type: "divider" } as SlackBlock,
  ];

  // Group articles by category
  const grouped = new Map<string, ArticleWithSummary[]>();
  for (const item of articles) {
    const cat = item.article.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  // Sort categories by article count
  const sortedCategories = [...grouped.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  for (const [categorySlug, categoryArticles] of sortedCategories) {
    const catInfo = CATEGORIES.find((c) => c.slug === categorySlug);
    const emoji = getCategoryEmoji(categorySlug);
    const label = catInfo?.label || categorySlug;

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${emoji} *${label}* (${categoryArticles.length})`,
      },
    });

    // Show top 3 articles per category
    const topArticles = categoryArticles.slice(0, 3);
    for (const { article, summary } of topArticles) {
      const summaryText =
        summary.summary.length > 150
          ? summary.summary.slice(0, 150) + "..."
          : summary.summary;

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\u2022 <${article.url}|${article.title}>\n  _${summaryText}_`,
        },
      });
    }

    blocks.push({ type: "divider" } as SlackBlock);
  }

  // Footer with dashboard link
  if (dashboardUrl) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `\u{1F517} <${dashboardUrl}|View full dashboard> \u00B7 Powered by Fintech Pulse India`,
        },
      ],
    });
  }

  return blocks;
}

export async function sendSlackBrief(
  articles: ArticleWithSummary[],
  webhookUrl: string,
  dashboardUrl?: string
): Promise<boolean> {
  const blocks = formatSlackBrief(articles, dashboardUrl);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Fintech Pulse India \u2014 Daily Brief: ${articles.length} articles`,
        blocks,
      }),
    });

    if (!response.ok) {
      console.error("[Slack] Webhook failed:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Slack] Send failed:", error);
    return false;
  }
}
