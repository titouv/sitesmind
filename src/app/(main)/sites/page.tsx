import { Link } from "@/components/ui/link"
import { createClient } from "@/supabase/utils/server"

export default async function Page() {
  const supabase = createClient()
  const { data, error } = await supabase.from("sites").select()

  if (error) {
    console.error(error)
  }
  console.log(data)
  return (
    // <div>
    //   <h1>Page</h1>
    // </div>
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Sites
        </h1>
        {!data ? (
          <span className="pt-8">No sites</span>
        ) : (
          <ul className="flex pt-8 flex-col max-w-sm gap-2">
            {data.map((site) => (
              <li
                key={site.id}
                className="flex odd:bg-slate-100 rounded-xl px-3 py-2 justify-between"
              >
                {site.url && (
                  <Link variant="link" href={site.url}>
                    {site.url}
                  </Link>
                )}

                <Link href={`/chat/${site.id}`}>Chat</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
