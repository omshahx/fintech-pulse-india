"use client";

import { useState } from "react";
import { NewsItem, SummaryResult } from "@/lib/sources/types";
import { formatRelativeDate } from "@/lib/utils";
import { getCategoryInfo } from "@/lib/categories";
import { Badge } from "../ui/Badge";
import { SourceBadge } from "./SourceBadge";

interface FeaturedArticleProps {
  item: NewsItem;
}

export function FeaturedArticle({ item }: FeaturedArticleProps) {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const catInfo = getCategoryInfo(item.category);

  const handleSummarize = async () => {
    if (summary) return;
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          url: item.url,
          content: item.content,
        }),
      });
      setSummary(await res.json());
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-500/5 dark:via-zinc-900 dark:to-zinc-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="primary" className="bg-emerald-600 text-white text-[10px] uppercase tracking-wider">
            Featured
          </Badge>
          <SourceBadge sourceId={item.sourceId} sourceName={item.sourceName} />
          {catInfo && (
            <Badge variant="category" className={catInfo.color}>
              {catInfo.label}
            </Badge>
          )}
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto">
            {formatRelativeDate(item.publishedAt)}
          </span>
        </div>

        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-3 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {item.title}
          </h2>
        </a>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 max-w-2xl">
          {item.description}
        </p>

        {summary && (
          <div className="mb-5 p-4 rounded-xl bg-white/60 dark:bg-zinc-800/50 border border-emerald-100 dark:border-emerald-500/10">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {summary.method === "gemini" ? "AI Summary" : "Auto Summary"}
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {summary.summary}
            </p>
            {summary.keyPoints.length > 0 && (
              <ul className="mt-3 grid gap-1.5">
                {summary.keyPoints.map((point, i) => (
                  <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">&#8226;</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSummarize}
            disabled={loading || !!summary}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Summarizing...
              </>
            ) : summary ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Summarized
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Summarize with AI
              </>
            )}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Read Full Article
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
