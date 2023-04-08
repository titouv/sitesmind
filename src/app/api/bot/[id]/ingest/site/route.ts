import { generateEmbeddings } from "@/utils/ingest/site/embeddings";
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
  const searchParams = new URLSearchParams(req.nextUrl.search);
  const searchParamsRecord = Object.fromEntries(searchParams.entries());
  console.log("searchParamsRecord", searchParamsRecord);

  const result = IngestSiteApiSchema.safeParse(searchParamsRecord);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { url, sourceId } = result.data;
  const botId = params.id;
  const bannedUrls: string[] = [];

  try {
    await generateEmbeddings({ url, sourceId, botId, bannedUrls });
  } catch (error) {
    console.error("Error while generating embeddings", error);
    return NextResponse.json(
      { status: "Error while generating embeddings", error },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "OK" }, { status: 200 });
}
