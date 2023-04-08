import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "../../../../../../utils/ingest/splitter";
import { insertDocumentInSupabase } from "@/utils/ingest/insert";
import { getEmbeddingOfDocument } from "@/utils/ingest/embedding";
import { DocumentWithMetadata } from "@/utils/ingest/types";

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

  const botId = params.id;
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
  const docsWithMetadata = documents.map(
    (doc) =>
      new DocumentWithMetadata({
        pageContent: doc.pageContent,
        metadata: { url: "st" },
      })
  );

  const embeddings = await Promise.all(
    docsWithMetadata.map((doc) => getEmbeddingOfDocument(doc))
  );

  const dataToInsert = docsWithMetadata.map((doc, index) => ({
    content: doc.pageContent,
    embedding: embeddings[index],
    metadata: doc.metadata,
    source_id: sourceId,
    bot_id: params.id,
  }));

  try {
    insertDocumentInSupabase(dataToInsert);
  } catch (error) {
    console.error("Error while inserting documents", error);
    return NextResponse.json(
      { status: "Error while inserting documents", error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
