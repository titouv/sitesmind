import { getData } from "@/app/api/bot/[id]/ingest/scraper";
import {
  RecursiveCharacterTextSplitter,
  Document,
} from "@/app/api/bot/[id]/ingest/splitter";
import { createBrowserClient } from "@/supabase/utils/browser";

async function getDocuments(urls: string[]) {
  const rawDocs = await Promise.all(
    urls.map(async (url) => {
      const data = await getData(url);
      return new Document({ pageContent: data, metadata: { url: url } });
    })
  );

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 500,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);
  return docs;
}

export async function generateEmbeddings({
  url,
  siteId,
  botId,
}: {
  url: string;
  botId: string;
  siteId: number;
}) {
  const documents = await getDocuments([url]); // Your custom function to load docs

  const embeddings = await Promise.all(
    documents.map((doc) => getEmbeddingOfDocument(doc))
  );

  const dataToInsert = documents.map((doc, index) => ({
    content: doc.pageContent,
    embedding: embeddings[index],
    metadata: doc.metadata,
    site_id: siteId,
    bot_id: botId,
  }));

  const supabaseClient = createBrowserClient();
  // In production we should handle possible errors
  const { error } = await supabaseClient.from("documents").insert(dataToInsert);
  if (error) {
    console.log("Error while inserting documents", error);
    throw new Error("Error while inserting documents");
  }
}

async function getEmbeddingOfDocument(document: Document) {
  const { pageContent } = document;
  // OpenAI recommends replacing newlines with spaces for best results
  const input = pageContent.replace(/\n/g, " ");

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
    console.log(
      "Error while generating embedding",
      embeddingResponse.statusText
    );
    throw new Error("Error while generating embedding");
  }

  const [{ embedding }] = (await embeddingResponse.json()).data;
  return embedding;
}
