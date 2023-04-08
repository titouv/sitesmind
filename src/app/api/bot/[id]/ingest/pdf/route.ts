import { NextRequest, NextResponse } from "next/server";
import { insertDocumentInSupabase } from "@/utils/ingest/insert";
import { getEmbeddingOfDocument } from "@/utils/ingest/embedding";
import { DocumentWithMetadata } from "@/utils/ingest/types";
import { createApiClient } from "@/supabase/utils/server";

// TODO when tree-shaking is fixed, import only the pdf lib and remove the other ones from the bundle
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const form = await req.formData();
  const sourceId = parseInt(form.get("sourceId")?.toString() ?? "0");
  const rawDocs = form.get("documents") as string;
  const documents = JSON.parse(rawDocs) as DocumentWithMetadata[];
  console.log("documents", documents);
  console.log("number of documents", documents.length);

  // const embeddings = await Promise.all(documents.map(getEmbeddingOfDocument));

  const supabase = createApiClient();

  const truc = await supabase.storage.from("pdf").download("test.pdf");

  // const dataToInsert = documents.map((doc, index) => ({
  //   content: doc.pageContent,
  //   embedding: embeddings[index],
  //   metadata: doc.metadata,
  //   source_id: sourceId,
  //   bot_id: params.id,
  // }));

  // console.log("Inserting documents into Supabase");
  // try {
  //   insertDocumentInSupabase(dataToInsert);
  // } catch (e) {
  //   console.error("Error while inserting documents", e);
  //   return NextResponse.json({ success: false });
  // }

  return NextResponse.json({ success: true });
}
