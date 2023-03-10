import { load } from "cheerio"

export const config = {
  revalidate: 0,
  runtime: "edge",
}

export async function POST(req: Request) {
  const { url } = (await req.json()) as { url: string }
  const response = await fetch(url)
  const text = await response.text()
  const $ = load(text)
  const title = $("title").text()
  return new Response(title)
}
