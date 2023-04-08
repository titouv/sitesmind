import { createApiClient } from "@/supabase/utils/server";
import { NextResponse } from "next/server";

export async function limit(botId: string) {
  const bannedUrls: string[] = [];

  const supabaseClient = createApiClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError || !session)
    return NextResponse.json(
      { status: "Unauthorized", session, error: sessionError },
      { status: 401 }
    );

  const { data: bots, error } = await supabaseClient
    .from("bots")
    .select("*")
    .eq("user_id", session.user.id);

  if (error)
    return NextResponse.json({ status: "Query error", error }, { status: 500 });

  const botsLength = bots.length;

  if (session.user.email && botsLength >= 5)
    return NextResponse.json({ status: "Limit reached" }, { status: 400 });
}
