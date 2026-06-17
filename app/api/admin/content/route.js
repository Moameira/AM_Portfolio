import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { savePortfolioContent } from "@/lib/content-store";

export async function PUT(request) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Only the portfolio owner can edit this content." }, { status: 403 });
  }

  try {
    const content = await request.json();
    const saved = await savePortfolioContent(content);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "The portfolio content could not be saved." },
      { status: 500 }
    );
  }
}
