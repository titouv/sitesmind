import { OpenAIStream } from "@/utils/openAIStream";
import { OpenAIApi } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createApiClientAsAnon } from "@/supabase/utils/server";

export const config = {
  revalidate: 0,
  runtime: "edge",
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/html; charset=utf-8",
};

type OpenAIStreamPayload = Parameters<typeof OpenAIStream>[0];

export type OpenAIMessages = OpenAIStreamPayload["messages"];

export type ChatApiSchemaType = {
  text: string;
  botId: string;
};

// maybe replace back to POST requst after this issue has been solved : https://github.com/vercel/next.js/issues/46337
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const text = req.nextUrl.searchParams.get("text") || "";
  // OpenAI recommends replacing newlines with spaces for best results
  const input = text.replace(/\n/g, " ");

  let start = Date.now();

  type EmbeddingFetchResponseType = Awaited<
    ReturnType<OpenAIApi["createEmbedding"]>
  >["data"];

  const embeddingResponse = await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input,
        model: "text-embedding-ada-002",
      }),
    }
  );
  const embeddingData =
    (await embeddingResponse.json()) as EmbeddingFetchResponseType;

  console.log("time for embedding", Date.now() - start, "ms");

  const [{ embedding }] = embeddingData.data;
  start = Date.now();

  const supabaseClient = createApiClientAsAnon();
  // Ideally for context injection, documents are chunked into
  // smaller sections at earlier pre-processing/embedding step.
  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents_by_id",
    {
      query_bot_id: id,
      query_embedding: embedding,
      match_count: 10,
      similarity_threshold: 0.1,
    }
  );
  if (error) {
    console.log("error", error);
    return new Response("error", {
      headers: corsHeaders,
    });
  }

  console.log("time for match_documents supabase", Date.now() - start, "ms");
  return NextResponse.json(documents);
}
