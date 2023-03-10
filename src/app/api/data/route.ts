import { Configuration, OpenAIApi } from "openai"
import { supabaseClient } from "@/supabase/utils/api"

export const config = {
  revalidate: 0,
  runtime: "edge",
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

export async function POST(req: Request) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Search query is passed in request payload
  const { query } = (await req.json()) as { query: string }
  console.log(query)
  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ")

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })

  const [{ embedding }] = embeddingResponse.data.data
  // console.log(embedding)
  // In production we should handle possible errors
  const { data: documents } = await supabaseClient.rpc("match_documents", {
    match_count: 10,
    query_embedding: embedding,
    similarity_threshold: 0.1,
  })

  return new Response(JSON.stringify(documents), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
