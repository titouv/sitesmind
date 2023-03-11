import { generateEmbeddings } from "@/app/api/ingest/embeddings"
import { createClient } from "@/supabase/utils/browser"
import { NextResponse } from "next/server"

export const config = {
  revalidate: 0,
}

export async function POST(req: Request) {
  const { url, id } = (await req.json()) as { url: string; id: number }

  const supabaseClient = createClient()

  const session = await supabaseClient.auth.getSession()

  if (!session)
    return NextResponse.json({ status: "Unauthorized" }, { status: 401 })

  const { data: sites, error } = await supabaseClient
    .from("sites")
    .select("*")
    .eq("user_id", session.data.session?.user.id)

  if (error)
    return NextResponse.json({ status: "Query error", error }, { status: 500 })

  const sitesLength = sites.length

  if (sitesLength === 5)
    return NextResponse.json({ status: "Limit reached" }, { status: 400 })

  if (sitesLength > 0) {
    const site = sites.find((site) => site.url === url)

    if (site)
      return NextResponse.json(
        { status: "Site already exists" },
        { status: 400 }
      )
  }

  await generateEmbeddings(url, id)
  return NextResponse.json({ status: "OK" }, { status: 200 })
}
