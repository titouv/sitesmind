import { supabaseClient } from "@/supabase/utils/api";
import { createOpenaiClient } from "@/utils/openAI";

export const config = {
  revalidate: 0,
  runtime: "edge",
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export async function POST(req: Request) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Search query is passed in request payload
  const { query, id } = (await req.json()) as { query: string; id: number };
  console.log(query);
  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ");
  const openaiClient = createOpenaiClient();

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openaiClient.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  });

  const [{ embedding }] = embeddingResponse.data.data;
  // console.log(embedding)
  // In production we should handle possible errors
  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents_by_id",
    {
      my_site_id: id,
      match_count: 10,
      query_embedding: embedding,
      similarity_threshold: 0.1,
    }
  );
  console.log(error);
  console.log(documents);

  return new Response(JSON.stringify(documents), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
