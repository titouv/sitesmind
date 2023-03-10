import { OpenAIStream } from "@/utils/openAIStream"
import GPT3Tokenizer from "gpt3-tokenizer"
// import { Configuration, OpenAIApi } from "openai"
import { openaiClient } from "@/utils/openAI"

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

export async function GET(req: Request) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Search query is passed in request payload
  // const { query } = await req.json()
  const query = "vincent"

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ")

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openaiClient.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })

  const [{ embedding }] = embeddingResponse.data.data

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
    return new Response("error", { headers: corsHeaders })
  }

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
  // console.log(messages)

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
