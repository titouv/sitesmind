import {
  RecursiveCharacterTextSplitter,
  Document,
} from "@/app/api/bot/[id]/ingest/splitter";
import { mainCrawl } from "./crawler";
import { createBrowserClient } from "@/supabase/utils/browser";

export async function generateEmbeddings({
  url,
  siteId,
  botId,
  bannedUrls,
}: {
  url: string;
  botId: string;
  siteId: number;
  bannedUrls: string[];
}) {
  const pageDatas = await mainCrawl(url, bannedUrls);

  const rawDocs = await Promise.all(
    pageDatas.map(async (pageData) => {
      const rawContent = pageData.textContent || "";
      const cleanedContent = rawContent;

      return new Document({
        pageContent: cleanedContent,
        metadata: { url: pageData.url },
      });
    })
  );

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const documents = await textSplitter.splitDocuments(rawDocs);

  const embeddings = await Promise.all(
    documents.map((doc) => getEmbeddingOfDocument(doc))
  );

  const dataToInsert = documents.map((doc, index) => ({
    content: doc.pageContent.replace(/\n/g, " "),
    embedding: embeddings[index],
    metadata: doc.metadata,
    site_id: siteId,
    bot_id: botId,
  }));

  const supabaseClient = createBrowserClient();
  // In production we should handle possible errors
  const { error } = await supabaseClient.from("documents").insert(dataToInsert);
  if (error) {
    console.error("Error while inserting documents", error);
    throw new Error("Error while inserting documents");
  }
}

async function getEmbeddingOfDocument(document: Document) {
  const { pageContent } = document;
  // OpenAI recommends replacing newlines with spaces for best results
  const input = pageContent.replace(/\n/g, " ");

  console.log("Generating embedding for", input);
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
  return embedding;
}
