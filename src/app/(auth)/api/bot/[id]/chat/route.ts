import { OpenAIStream } from "@/utils/openAIStream";
import GPT3Tokenizer from "gpt3-tokenizer";
import { supabaseClient } from "@/supabase/utils/api";
import { OpenAIApi } from "openai";
import { NextRequest } from "next/server";

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
  messages: OpenAIMessages;
};

// maybe replace back to POST requst after this issue has been solved : https://github.com/vercel/next.js/issues/46337
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = new URL(req.url).searchParams;

  if (!searchParams.has("messages")) {
    return new Response("Missing botId or message", { headers: corsHeaders });
  }

  const messages = JSON.parse(
    searchParams.get("messages") || ""
  ) as OpenAIMessages;
  const botId = params.id;

  // i want a variable with only the last element and a var with all the previous elements
  const lastMessage = messages[messages.length - 1];
  const previousMessages = messages.slice(0, messages.length - 1);

  // OpenAI recommends replacing newlines with spaces for best results
  const input = lastMessage.content.replace(/\n/g, " ");

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

  // Ideally for context injection, documents are chunked into
  // smaller sections at earlier pre-processing/embedding step.
  const { data: documents, error } = await supabaseClient.rpc(
    "match_documents_by_id",
    {
      bot_id: botId,
      match_count: 10,
      query_embedding: embedding,
      similarity_threshold: 0.1,
    }
  );
  if (error) {
    console.log("error", error);
    return new Response("error", {
      headers: {
        ...corsHeaders,
        "Transfer-Encoding": "chunked",
        charset: "utf-8",
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
      },
    });
  }
  console.log("time for match_documents", Date.now() - start, "ms");

  console.log("documents", documents);

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  let tokenCount = 0;
  let contextText = "";

  // Concat matched documents
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const content = document.content;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.text.length;

    // Limit context to max 1500 tokens (configurable)
    if (tokenCount > 1500) {
      break;
    }

    contextText += `${content.trim()}\n---\n`;
  }

  // In production we should handle possible errors
  const messagesToSend: OpenAIStreamPayload["messages"] = [
    ...previousMessages,
    {
      role: "system",
      content: contextText,
    },
    lastMessage,
  ];
  console.log("messagesToSend", messagesToSend);

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
  };
  const stream = await OpenAIStream(payload);
  return new Response(stream, { status: 200, headers: corsHeaders });
}
