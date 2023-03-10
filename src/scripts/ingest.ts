import { Configuration, OpenAIApi } from "openai"
import { getData } from "./scraper"
import { Document, RecursiveCharacterTextSplitter } from "./splitter"
import { openaiClient } from "@/utils/openAI"
import { createClient } from "@/supabase/utils/server"

const supabaseClient = createClient()

async function getDocuments() {
  const data = await getData(["https://datapix.fr"])
  const rawDocs = data.map((data) => new Document({ pageContent: data }))

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 500,
  })
  const docs = await textSplitter.splitDocuments(rawDocs)
  return docs
}

async function generateEmbeddings() {
  const documents = await getDocuments() // Your custom function to load docs

  documents.forEach((doc) => {
    console.log(
      "================================================================"
    )
    console.log(doc.pageContent)
  })

  // Assuming each document is a string
  for (const { pageContent } of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = pageContent.replace(/\n/g, " ")

    const embeddingResponse = await openaiClient.createEmbedding({
      model: "text-embedding-ada-002",
      input,
    })

    const [{ embedding }] = embeddingResponse.data.data

    // In production we should handle possible errors
    await supabaseClient.from("documents").insert({
      content: pageContent,
      embedding,
    })
  }
}

generateEmbeddings()
