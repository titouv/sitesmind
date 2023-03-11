import { createClient } from "@/supabase/utils/server"

export default async function Page() {
  const supabase = createClient()
  const { data, error } = await supabase.from("sites").select()

  if (error) {
    console.error(error)
  }
  console.log(data)
  return (
    <div>
      <h1>Page</h1>
      {data?.map((site) => (
        <div key={site.id}>{site.url}</div>
      ))}
    </div>
  )
}
