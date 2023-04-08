import { RecursiveCharacterTextSplitter, Document } from "../splitter";
import { mainCrawl } from "./crawler";
import { insertDocumentInSupabase } from "@/utils/ingest/insert";
import { getEmbeddingOfDocument } from "@/utils/ingest/embedding";
import { DocumentWithMetadata } from "@/utils/ingest/types";

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
    return new DocumentWithMetadata({
      pageContent: content,
      metadata: { url: "https://document" },
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

  insertDocumentInSupabase(dataToInsert);
}
