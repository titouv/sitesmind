import { generateEmbeddings } from "@/app/api/bot/[id]/ingest/embeddings";
import { createServerComponentClient } from "@/supabase/utils/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export const config = {
  revalidate: 0,
  runtime: "edge",
};

const IngestApiSchema = z.object({
  url: z.string(),
  siteId: z.number(),
});

export type IngestApiSchemaType = z.infer<typeof IngestApiSchema>;

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = IngestApiSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { url, siteId } = result.data;
  const botId = params.id;

  const supabaseClient = createServerComponentClient();

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

  console.log("bots", { bots });

  if (error)
    return NextResponse.json({ status: "Query error", error }, { status: 500 });

  const botsLength = bots.length;

  if (session.user.email && botsLength >= 5)
    return NextResponse.json({ status: "Limit reached" }, { status: 400 });

  if (botsLength > 0) {
    // query sites of this both and verify if the url is already in the db
    const { data: sites, error: sitesError } = await supabaseClient
      .from("sites")
      .select("*");

    console.log("sites", { sites });

    if (sitesError)
      return NextResponse.json(
        { status: "Query error", error: sitesError },
        { status: 500 }
      );
    // if site is found
    if (sites.filter((site) => site.url === url).length > 1)
      return NextResponse.json(
        { status: "Site already exists" },
        { status: 400 }
      );
  }
  console.log("Test passed generating embedding for", { url, siteId, botId });
  await generateEmbeddings({ url, siteId, botId });
  console.log("Embedding generated");
  return NextResponse.json({ status: "OK" }, { status: 200 });
}
