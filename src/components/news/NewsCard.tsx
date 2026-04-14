"use client";

import { useState } from "react";
import { NewsItem, SummaryResult } from "@/lib/sources/types";
import { formatRelativeDate, truncateText } from "@/lib/utils";
import { getCategoryInfo } from "@/lib/categories";
import { Badge } from "../ui/Badge";
import { SourceBadge } from "./SourceBadge";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const catInfo = getCategoryInfo(item.category);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (summary) {
      setExpanded(!expanded);
      return;
    }

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
      const data = await res.json();
      setSummary(data);
      setExpanded(true);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 overflow-hidden">
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3">
          <SourceBadge sourceId={item.sourceId} sourceName={item.sourceName} />
          {catInfo && (
            <Badge variant="category" className={catInfo.color}>
              {catInfo.label}
            </Badge>
          )}
          <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            {formatRelativeDate(item.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-2"
        >
          <h3 className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {item.title}
          </h3>
        </a>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          {truncateText(item.description, 160)}
        </p>

        {/* Summary section */}
        {expanded && summary && (
          <div className="mt-1 mb-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 animate-in fade-in">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {summary.method === "gemini" ? "AI Summary" : "Auto Summary"}
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {summary.summary}
            </p>
            {summary.keyPoints.length > 0 && (
              <ul className="mt-2 space-y-1">
                {summary.keyPoints.slice(0, 3).map((point, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">&#8226;</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Summarizing...
              </>
            ) : expanded && summary ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Hide Summary
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Summarize
              </>
            )}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors ml-auto"
          >
            Read
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
