import { generateEmbeddings } from "./embeddings";
import { createApiClient } from "@/supabase/utils/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const config = {
  revalidate: 0,
  runtime: "edge",
};

const IngestSiteApiSchema = z.object({
  url: z.string(),
  sourceId: z.coerce.number(),
  // bannedUrls: z.array(z.string()),
});

export type IngestApiSchemaType = z.infer<typeof IngestSiteApiSchema>;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Ingest site", params.id, req.nextUrl.searchParams.toString());
  // convert searchparams to a record<string, string>
  const searchParams = new URLSearchParams(req.nextUrl.search);
  const searchParamsRecord = Object.fromEntries(searchParams.entries());
  console.log("searchParamsRecord", searchParamsRecord);

  const result = IngestSiteApiSchema.safeParse(searchParamsRecord);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { url, sourceId } = result.data;
  const botId = params.id;
  const bannedUrls: string[] = [
    // "https://datapix.fr/mentions-legales",
    // "https://datapix.fr/polique-de-confidentialite",
  ];

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
    const { data: sources, error: sitesError } = await supabaseClient
      .from("sources")
      .select("*");

    if (sitesError)
      return NextResponse.json(
        { status: "Query error", error: sitesError },
        { status: 500 }
      );
    // if site is found
    if (sources.filter((site) => site.meta === url).length > 1)
      return NextResponse.json(
        { status: "Site already exists" },
        { status: 400 }
      );
  }
  const start = Date.now();
  try {
    await generateEmbeddings({ url, sourceId, botId, bannedUrls });
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
