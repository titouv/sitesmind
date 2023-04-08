import { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders";
import { DocumentWithMetadata } from "@/utils/ingest/types";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = JSON.parse(req.body);
  console.log(url);
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const blob = new Blob([buffer], { type: "application/pdf" });

  // load pdf document
  const loader = new PDFLoader(blob);
  const splitter = new RecursiveCharacterTextSplitter();
  const rawDocs = await loader.loadAndSplit(splitter);
  console.log("after splitting rawDocs", rawDocs);
  const documents = rawDocs.map((doc) => {
    // remove all newlines and multiples spaces
    const content = doc.pageContent.replace(/\n/g, " ").replace(/\s+/g, " ");
    console.log("originalDocMetadata", doc.metadata);

    return new DocumentWithMetadata({
      pageContent: content,
      metadata: {
        url,
        preciseUrl: url + "#page=" + doc.metadata.loc.pageNumber,
        page: doc.metadata.loc.pageNumber,
      },
    });
  });
  console.log("documents", documents);
  return res.status(200).json(documents);
}
