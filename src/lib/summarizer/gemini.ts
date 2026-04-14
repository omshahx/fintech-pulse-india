import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { SummaryResult } from "../sources/types";

export async function geminiSummarize(
  title: string,
  description: string,
  content?: string
): Promise<SummaryResult> {
  const articleText = content || description;

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: `You are an expert analyst covering Indian fintech news. You provide concise, insightful summaries focused on the Indian market context. Always respond in valid JSON format.`,
    prompt: `Analyze this Indian fintech news article and respond with a JSON object containing exactly these fields:

Title: ${title}

Content: ${articleText}

Respond with ONLY this JSON structure (no markdown, no code blocks):
{
  "summary": "A 2-3 sentence summary highlighting the key development and its significance for India's fintech ecosystem",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "category": "one of: regulations, digital-payments, funding, product-launches, partnerships, banking, insurtech, lending, general",
  "sentiment": "one of: positive, neutral, negative"
}`,
  });

  try {
    // Clean the response - remove any markdown code blocks if present
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || description,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 5) : [title],
      category: parsed.category || "general",
      sentiment: parsed.sentiment || "neutral",
      method: "gemini",
    };
  } catch {
    // If JSON parsing fails, use the raw text as summary
    return {
      summary: text.slice(0, 500),
      keyPoints: [title],
      category: "general",
      sentiment: "neutral",
      method: "gemini",
    };
  }
}
