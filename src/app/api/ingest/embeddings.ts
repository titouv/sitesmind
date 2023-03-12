import { getData } from "@/app/api/ingest/scraper";
import {
  RecursiveCharacterTextSplitter,
  Document,
} from "@/app/api/ingest/splitter";
import { createClient } from "@/supabase/utils/browser";

async function getDocuments(url: string) {
  const data = await getData([url]);
  const rawDocs = data.map((data) => new Document({ pageContent: data }));

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 500,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);
  return docs;
}

export async function generateEmbeddings(url: string, siteId: number) {
  const documents = await getDocuments(url); // Your custom function to load docs

  documents.forEach((doc) => {
    console.log(
      "================================================================"
    );
    console.log(doc.pageContent);
  });

  // const openaiClient = createOpenaiClient()

  // Assuming each document is a string
  for (const { pageContent } of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = pageContent.replace(/\n/g, " ");

    // const embeddingResponse = await openaiClient.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input,
    // })
    //   curl https://api.openai.com/v1/embeddings \
    // -H "Content-Type: application/json" \
    // -H "Authorization: Bearer $OPENAI_API_KEY" \
    // -d '{"input": "Your text string goes here",
    //      "model":"text-embedding-ada-002"}'

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
    const supabaseClient = createClient();

    // In production we should handle possible errors
    await supabaseClient.from("documents").insert({
      content: pageContent,
      embedding,
      site_id: siteId,
    });
  }
}
