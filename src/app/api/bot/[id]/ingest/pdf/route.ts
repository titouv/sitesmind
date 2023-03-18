import { PDFLoader } from "langchain/document_loaders";
import { NextRequest, NextResponse } from "next/server";

// TODO when tree-shaking is fixed, import only the pdf lib and remove the other ones from the bundle
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const loader = new PDFLoader(file);

  const docs = await loader.load();
  console.log({ docs });
  return NextResponse.json({ docs });
}
