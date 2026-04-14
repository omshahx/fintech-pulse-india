import { NextRequest, NextResponse } from "next/server";
import { summarize } from "@/lib/summarizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, content } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Missing required fields: title, url" },
        { status: 400 }
      );
    }

    const result = await summarize(title, description || "", url, content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /summarize] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
