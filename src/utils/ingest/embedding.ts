import { DocumentWithMetadata } from "@/utils/ingest/types";

export async function getEmbeddingOfDocument(document: DocumentWithMetadata) {
  const { pageContent: input } = document;

  // TODO convert to openaiclient when possible
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

  if (!embeddingResponse.ok) {
    console.error(
      "Error while generating embedding",
      embeddingResponse.statusText
    );
    throw new Error("Error while generating embedding");
  }

  const [{ embedding }] = (await embeddingResponse.json()).data;
  return embedding as number[];
}
