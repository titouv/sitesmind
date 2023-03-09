import { OpenAIStream } from "@/utils/openAIStream"
import GPT3Tokenizer from "gpt3-tokenizer"
import { openaiClient } from "@/utils/openAI"
import { createClient } from "@/supabase/utils/browser"

const supabaseClient = createClient()

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

export async function POST(req: Request) {
  console.log("start")
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Search query is passed in request payload
  const { query } = await req.json()

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ")

  let start = Date.now()
  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openaiClient.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })
  console.log("time for embedding", Date.now() - start, "ms")

  const [{ embedding }] = embeddingResponse.data.data

  start = Date.now()
  // Fetching whole documents for this simple example.
  //
  // Ideally for context injection, documents are chunked into
  // smaller sections at earlier pre-processing/embedding step.
  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents",
    {
      match_count: 10,
      query_embedding: embedding,
      similarity_threshold: 0.1,
    }
  )
  if (error) {
    console.log("error", error)
    return new Response("error", { headers: corsHeaders })
  }
  console.log("time for match_documents", Date.now() - start, "ms")

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
  let tokenCount = 0
  let contextText = ""

  // Concat matched documents
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i]
    const content = document.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    // Limit context to max 1500 tokens (configurable)
    if (tokenCount > 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }

  type OpenAIStreamPayload = Parameters<typeof OpenAIStream>[0]

  // In production we should handle possible errors
  const messages: OpenAIStreamPayload["messages"] = [
    {
      role: "system",
      content: `You are a bot for datapix a no-code company`,
    },
    {
      role: "assistant",
      content: contextText,
    },
    { role: "user", content: query },
  ]

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  }
  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
