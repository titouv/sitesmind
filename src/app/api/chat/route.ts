import { OpenAIStream } from "@/utils/openAIStream"
import GPT3Tokenizer from "gpt3-tokenizer"
import { createOpenaiClient } from "@/utils/openAI"
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

type OpenAIStreamPayload = Parameters<typeof OpenAIStream>[0]

export type OpenAIMessages = OpenAIStreamPayload["messages"]

// maybe replace back to POST requst after this issue has been solved : https://github.com/vercel/next.js/issues/46337
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const messages = JSON.parse(params.get("messages") || "") as OpenAIMessages
  if (!messages) {
    return new Response("no query", { headers: corsHeaders })
  }
  // i want a variable with only the last element and a var with all the previous elements
  const lastMessage = messages[messages.length - 1]
  const previousMessages = messages.slice(0, messages.length - 1)

  console.log("lastMessage", lastMessage)
  console.log("previousMessages", previousMessages)

  // OpenAI recommends replacing newlines with spaces for best results
  const input = lastMessage.content.replace(/\n/g, " ")
  const openaiClient = createOpenaiClient()

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

  // In production we should handle possible errors
  const messagesToSend: OpenAIStreamPayload["messages"] = [
    ...previousMessages,
    {
      role: "system",
      content: contextText,
    },
    lastMessage,
  ]
  console.log("messagesToSend", messagesToSend)

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messagesToSend,
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
