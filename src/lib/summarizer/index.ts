import { SummaryResult } from "../sources/types";
import { cache, CACHE_TTL } from "../cache";
import { geminiSummarize } from "./gemini";
import { extractiveSummarize } from "./extractive";

export async function summarize(
  title: string,
  description: string,
  url: string,
  content?: string
): Promise<SummaryResult> {
  // Check cache first
  const cacheKey = `summary:${url}`;
  const cached = cache.get<SummaryResult>(cacheKey);
  if (cached) return cached;

  let result: SummaryResult;

  // Try Gemini if API key is configured
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      result = await geminiSummarize(title, description, content);
    } catch (error) {
      console.error("[Summarizer] Gemini failed, falling back to extractive:", error);
      result = extractiveSummarize(title, description, content);
    }
  } else {
    result = extractiveSummarize(title, description, content);
  }

  // Cache the result
  cache.set(cacheKey, result, CACHE_TTL.SUMMARY);
  return result;
}
