import { SummaryResult } from "../sources/types";

const FINTECH_KEYWORDS = [
  "upi", "rbi", "sebi", "fintech", "payment", "lending", "regulation",
  "banking", "digital", "npci", "wallet", "credit", "debit", "loan",
  "insurance", "startup", "funding", "neobank", "compliance", "nbfc",
  "aadhaar", "kyc", "api", "rupee", "crore", "lakh", "million", "billion",
];

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 500);
}

function scoreSentence(sentence: string, index: number, total: number): number {
  const lower = sentence.toLowerCase();
  let score = 0;

  // Position bonus: first sentences are more important
  if (index === 0) score += 4;
  else if (index === 1) score += 3;
  else if (index < total * 0.3) score += 2;

  // Keyword matches
  for (const kw of FINTECH_KEYWORDS) {
    if (lower.includes(kw)) score += 1.5;
  }

  // Numbers indicate data/facts
  const numberCount = (sentence.match(/\d+/g) || []).length;
  score += Math.min(numberCount * 1.5, 4);

  // Quotes indicate direct statements
  if (sentence.includes('"') || sentence.includes("'")) score += 1;

  // Proper nouns (capitalized words not at start)
  const properNouns = sentence
    .split(" ")
    .slice(1)
    .filter((w) => /^[A-Z][a-z]/.test(w));
  score += Math.min(properNouns.length * 0.5, 2);

  // Penalty for very short or very long sentences
  if (sentence.length < 40) score -= 1;
  if (sentence.length > 300) score -= 1;

  return score;
}

function detectSentiment(text: string): "positive" | "neutral" | "negative" {
  const lower = text.toLowerCase();
  const positive = [
    "growth", "launch", "success", "profit", "increase", "boost",
    "record", "milestone", "expand", "innovation", "approve", "enable",
  ];
  const negative = [
    "fraud", "loss", "decline", "ban", "penalty", "violation", "crash",
    "scam", "restrict", "concern", "warning", "fail",
  ];

  let posScore = 0;
  let negScore = 0;

  for (const word of positive) if (lower.includes(word)) posScore++;
  for (const word of negative) if (lower.includes(word)) negScore++;

  if (posScore > negScore + 1) return "positive";
  if (negScore > posScore + 1) return "negative";
  return "neutral";
}

function extractKeyPoints(text: string, sentences: string[]): string[] {
  const scored = sentences
    .map((s, i) => ({ sentence: s, score: scoreSentence(s, i, sentences.length) }))
    .sort((a, b) => b.score - a.score);

  return scored
    .slice(0, 5)
    .map((s) => {
      const trimmed = s.sentence.length > 120
        ? s.sentence.slice(0, 120).replace(/\s+\S*$/, "") + "..."
        : s.sentence;
      return trimmed;
    });
}

export function extractiveSummarize(
  title: string,
  description: string,
  content?: string
): SummaryResult {
  const fullText = content || description || title;
  const sentences = splitSentences(fullText);

  if (sentences.length === 0) {
    return {
      summary: description || title,
      keyPoints: [title],
      category: "general",
      sentiment: "neutral",
      method: "extractive",
    };
  }

  const scored = sentences
    .map((s, i) => ({ sentence: s, score: scoreSentence(s, i, sentences.length) }))
    .sort((a, b) => b.score - a.score);

  // Pick top 3 sentences, re-order by original position
  const topSentences = scored
    .slice(0, 3)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map((s) => s.sentence);

  return {
    summary: topSentences.join(" "),
    keyPoints: extractKeyPoints(fullText, sentences),
    category: "general",
    sentiment: detectSentiment(fullText),
    method: "extractive",
  };
}
