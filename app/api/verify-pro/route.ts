import { NextRequest, NextResponse } from "next/server";
import { hasActiveSubscription } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const isPro = await hasActiveSubscription(normalizedEmail);
    return NextResponse.json({ isPro });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify subscription.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
