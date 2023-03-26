import { getEmbeddingOfDocument } from "@/app/api/bot/[id]/ingest/site/embeddings";
import { createBrowserClient } from "@/supabase/utils/browser";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders";
import { NextRequest, NextResponse } from "next/server";
import { Document } from "langchain/document";

// TODO when tree-shaking is fixed, import only the pdf lib and remove the other ones from the bundle
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const sourceId = parseInt(form.get("sourceId")?.toString() ?? "0");
  const loader = new PDFLoader(file);

  const botId = params.id;

  const splitter = new RecursiveCharacterTextSplitter();
  const rawDocs = await loader.loadAndSplit(splitter);

  const documents = rawDocs.map((doc) => {
    // remove all newlines and multiples spaces
    const content = doc.pageContent.replace(/\n/g, " ").replace(/\s+/g, " ");
    return new Document({
      pageContent: content,
      metadata: doc.metadata,
    });
  });

  console.log("number of documents", documents.length);

  let embeddings: number[][] = [];
  for (const doc of documents) {
    embeddings.push(await getEmbeddingOfDocument(doc));
  }

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
