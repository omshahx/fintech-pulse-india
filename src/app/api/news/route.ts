import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/sources";
import { Category } from "@/lib/sources/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") as Category | null;
  const q = searchParams.get("q");
  const days = searchParams.get("days");
  const source = searchParams.get("source");

  try {
    const items = await fetchAllNews({
      category: category || undefined,
      q: q || undefined,
      days: days === "all" ? undefined : days ? parseInt(days, 10) : 7,
      source: source || undefined,
    });

    return NextResponse.json(
      {
        items,
        total: items.length,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    console.error("[API /news] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", items: [] },
      { status: 500 }
    );
  }
}
