import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/sources";
import { summarize } from "@/lib/summarizer";
import { sendSlackBrief } from "@/lib/slack";

export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "SLACK_WEBHOOK_URL not configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch today's news
    const items = await fetchAllNews({ days: 1 });
    const topItems = items.slice(0, 15);

    // Summarize top articles
    const articlesWithSummaries = await Promise.all(
      topItems.map(async (article) => {
        const summary = await summarize(
          article.title,
          article.description,
          article.url,
          article.content
        );
        return { article, summary };
      })
    );

    const dashboardUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://fintech-pulse-india.vercel.app";

    const success = await sendSlackBrief(
      articlesWithSummaries,
      webhookUrl,
      dashboardUrl
    );

    return NextResponse.json({
      success,
      articlesCount: articlesWithSummaries.length,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Daily brief failed:", error);
    return NextResponse.json(
      { error: "Failed to send daily brief" },
      { status: 500 }
    );
  }
}
