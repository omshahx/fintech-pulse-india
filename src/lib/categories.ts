import { Category } from "./sources/types";

export interface CategoryInfo {
  slug: Category;
  label: string;
  icon: string;
  keywords: string[];
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "regulations",
    label: "Regulations",
    icon: "shield",
    color: "text-red-500 bg-red-500/10",
    keywords: [
      "rbi", "sebi", "irdai", "npci", "regulation", "compliance", "policy",
      "guideline", "circular", "amendment", "mandate", "directive", "licence",
      "license", "regulatory", "reserve bank", "securities", "pmlr", "kyc",
      "aml", "data protection", "dpdp", "meity",
    ],
  },
  {
    slug: "digital-payments",
    label: "Digital Payments",
    icon: "credit-card",
    color: "text-blue-500 bg-blue-500/10",
    keywords: [
      "upi", "payment", "wallet", "pos", "qr code", "digital payment",
      "rupay", "bharat pay", "phonepe", "google pay", "paytm", "razorpay",
      "cashfree", "juspay", "net banking", "neft", "rtgs", "imps",
      "credit card", "debit card", "bnpl", "buy now pay later",
    ],
  },
  {
    slug: "funding",
    label: "Funding & Deals",
    icon: "trending-up",
    color: "text-green-500 bg-green-500/10",
    keywords: [
      "funding", "raise", "investment", "investor", "valuation", "unicorn",
      "series a", "series b", "series c", "seed", "ipo", "acquisition",
      "merger", "m&a", "venture capital", "pe fund", "funding round",
      "pre-series", "angel", "backed",
    ],
  },
  {
    slug: "product-launches",
    label: "Product Launches",
    icon: "rocket",
    color: "text-purple-500 bg-purple-500/10",
    keywords: [
      "launch", "launches", "launched", "introduce", "unveil", "rollout",
      "new feature", "new product", "new app", "new service", "release",
      "beta", "pilot", "go live", "gone live",
    ],
  },
  {
    slug: "partnerships",
    label: "Partnerships",
    icon: "handshake",
    color: "text-orange-500 bg-orange-500/10",
    keywords: [
      "partnership", "partner", "collaborate", "collaboration", "tie-up",
      "alliance", "joint venture", "mou", "agreement", "integrate",
      "integration",
    ],
  },
  {
    slug: "banking",
    label: "Banking",
    icon: "building",
    color: "text-cyan-500 bg-cyan-500/10",
    keywords: [
      "bank", "banking", "neobank", "nbfc", "small finance bank",
      "digital bank", "open banking", "account aggregator", "savings",
      "deposit", "fixed deposit", "current account",
    ],
  },
  {
    slug: "insurtech",
    label: "InsurTech",
    icon: "shield-check",
    color: "text-teal-500 bg-teal-500/10",
    keywords: [
      "insurance", "insurtech", "health insurance", "motor insurance",
      "life insurance", "claim", "underwriting", "policy", "premium",
      "acko", "digit", "policybazaar",
    ],
  },
  {
    slug: "lending",
    label: "Lending",
    icon: "banknote",
    color: "text-amber-500 bg-amber-500/10",
    keywords: [
      "lending", "loan", "credit", "emi", "interest rate", "personal loan",
      "home loan", "gold loan", "digital lending", "p2p", "microfinance",
      "credit score", "credit line",
    ],
  },
  {
    slug: "general",
    label: "General",
    icon: "newspaper",
    color: "text-gray-500 bg-gray-500/10",
    keywords: [],
  },
];

export function classifyCategory(title: string, description: string): Category {
  const text = `${title} ${description}`.toLowerCase();

  let bestMatch: Category = "general";
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    if (cat.slug === "general") continue;
    let score = 0;
    for (const keyword of cat.keywords) {
      if (text.includes(keyword)) {
        score += keyword.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat.slug;
    }
  }

  return bestMatch;
}

export function getCategoryInfo(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
