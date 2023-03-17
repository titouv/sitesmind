import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Document, RecursiveCharacterTextSplitter } from "../splitter";
import { getEmbeddingOfDocument } from "@/app/api/bot/[id]/ingest/site/embeddings";
import { createBrowserClient } from "@/supabase/utils/browser";

const IngestFileApiSchema = z.object({
  text: z.string(),
  fileName: z.string(),
  sourceId: z.coerce.number(),
});

// key string, value string

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // convert searchparams to a record<string, string>
  const searchParams = new URLSearchParams(req.nextUrl.search);
  const searchParamsRecord = Object.fromEntries(searchParams.entries());
  console.log("searchParamsRecord", searchParamsRecord);

  const botId = parseInt(params.id);
  const result = IngestFileApiSchema.safeParse(searchParamsRecord);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { text, sourceId, fileName } = result.data;

  const document = new Document({
    pageContent: text,
    metadata: { url: fileName },
  });

  const textSplitter = new RecursiveCharacterTextSplitter();
  const documents = await textSplitter.splitDocuments([document]);

  const embeddings = await Promise.all(
    documents.map((doc) => getEmbeddingOfDocument(doc))
  );

  const dataToInsert = documents.map((doc, index) => ({
    content: doc.pageContent,
    embedding: embeddings[index],
    metadata: doc.metadata,
    source_id: sourceId,
    bot_id: params.id,
  }));

  console.log("Inserting documents into Supabase");
  const supabaseClient = createBrowserClient();
  // In production we should handle possible errors
  await supabaseClient.from("documents").delete().eq("bot_id", botId);

  const { error } = await supabaseClient.from("documents").insert(dataToInsert);
  if (error) {
    console.error("Error while inserting documents", error);
    throw new Error("Error while inserting documents");
  }

  return NextResponse.json({ success: true });
}
