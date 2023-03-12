import { generateEmbeddings } from "@/app/api/ingest/embeddings";
import { createClient } from "@/supabase/utils/server";
import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

// export const config = {
//   revalidate: 0,
// };

export async function POST(req: Request) {
  const { url, id } = (await req.json()) as { url: string; id: number };

  const supabaseClient = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError || !session)
    return NextResponse.json(
      { status: "Unauthorized", error: sessionError },
      { status: 401 }
    );

  const { data: sites, error } = await supabaseClient
    .from("sites")
    .select("*")
    .eq("user_id", session.user.id);

  console.log(sites);

  if (error)
    return NextResponse.json({ status: "Query error", error }, { status: 500 });

  const sitesLength = sites.length;

  const emailBypassLimit = (await get("emailBypassLimit")) as string[];

  if (
    session.user.email &&
    !emailBypassLimit.includes(session.user.email) &&
    sitesLength >= 5
  )
    return NextResponse.json({ status: "Limit reached" }, { status: 400 });

  if (sitesLength > 0) {
    const site = sites.find((site) => site.id != id && site.url === url);

    if (site)
      return NextResponse.json(
        { status: "Site already exists" },
        { status: 400 }
      );
  }

  await generateEmbeddings(url, id);
  return NextResponse.json({ status: "OK" }, { status: 200 });
}
