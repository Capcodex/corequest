import { NextRequest, NextResponse } from "next/server";
import { completeLevel } from "@/lib/progress/completeLevel";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { levelId } = (await request.json()) as { levelId?: string };

  if (!levelId) {
    return NextResponse.json({ error: "LEVEL_ID_REQUIRED" }, { status: 400 });
  }

  try {
    const result = await completeLevel(user.id, levelId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

