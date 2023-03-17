import { RecursiveCharacterTextSplitter, Document } from "../splitter";
import { mainCrawl } from "./crawler";
import { createBrowserClient } from "@/supabase/utils/browser";

export async function generateEmbeddings({
  url,
  sourceId,
  botId,
  bannedUrls,
}: {
  url: string;
  botId: string;
  sourceId: number;
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

  console.log("Number of raw documents:", rawDocs.length);

  const textSplitter = new RecursiveCharacterTextSplitter();

  const documents = await textSplitter.splitDocuments(rawDocs);
  console.log("Number of documents:", documents.length);

  const cleanDocuments = documents.map((doc) => {
    // remove all newlines and multiples spaces
    const content = doc.pageContent.replace(/\n/g, " ").replace(/\s+/g, " ");
    return new Document({
      pageContent: content,
      metadata: doc.metadata,
    });
  });

  const embeddings = await Promise.all(
    cleanDocuments.map((doc) => getEmbeddingOfDocument(doc))
  );

  const dataToInsert = cleanDocuments.map((doc, index) => ({
    content: doc.pageContent,
    embedding: embeddings[index],
    metadata: doc.metadata,
    source_id: sourceId,
    bot_id: botId,
  }));

  console.log("Inserting documents into Supabase");
  const supabaseClient = createBrowserClient();

  const { error } = await supabaseClient.from("documents").insert(dataToInsert);
  if (error) {
    console.error("Error while inserting documents", error);
    throw new Error("Error while inserting documents");
  }
}

export async function getEmbeddingOfDocument(document: Document) {
  const { pageContent: input } = document;

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
  return embedding as number[];
}
