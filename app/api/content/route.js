import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/content-store";

export async function GET() {
  const content = await getPortfolioContent();
  return NextResponse.json(content);
}
