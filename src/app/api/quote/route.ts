import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing";
import type { QuoteRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequest;
    const quote = calculateQuote(body);
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Invalid quote request" }, { status: 400 });
  }
}
