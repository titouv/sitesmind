import { generateEmbeddings } from "@/app/api/bot/[id]/ingest/embeddings";
import { createApiClient } from "@/supabase/utils/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const config = {
  revalidate: 0,
  runtime: "edge",
};

const IngestApiSchema = z.object({
  url: z.string(),
  siteId: z.coerce.number(),
});

export type IngestApiSchemaType = z.infer<typeof IngestApiSchema>;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = req.nextUrl.searchParams;

  const result = IngestApiSchema.safeParse({
    url: searchParams.get("url"),
    siteId: searchParams.get("siteId"),
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { url, siteId } = result.data;
  const botId = params.id;

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

  if (botsLength > 0) {
    // query sites of this both and verify if the url is already in the db
    const { data: sites, error: sitesError } = await supabaseClient
      .from("sites")
      .select("*");

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
  const start = Date.now();
  try {
    await generateEmbeddings({ url, siteId, botId });
  } catch (error) {
    console.error("Error while generating embeddings", error);
    return NextResponse.json(
      { status: "Error while generating embeddings", error },
      { status: 500 }
    );
  }

  console.log("Time total route embeddings", Date.now() - start);
  return NextResponse.json({ status: "OK" }, { status: 200 });
}
