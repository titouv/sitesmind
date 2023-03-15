import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";

// do not cache this page
export const revalidate = 0;

export default async function Page() {
  const supabase = createServerComponentClient();

  let { data, error } = await supabase.from("bots").select(`*,
    sites (
      *
    )`);

  console.log("supabase call", { data, error });

  if (error) {
    return <span>Error</span>;
  }
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Bots
        </h1>
        {!data || data.length == 0 ? (
          <span className="pt-8">No bots</span>
        ) : (
          <ul className="flex max-w-sm flex-col gap-2 pt-8">
            {data.map((bot) => (
              <li
                key={bot.id}
                className="flex justify-between gap-8 rounded-xl border-slate-200 p-2 odd:bg-slate-100 even:border"
              >
                {Array.isArray(bot.sites) &&
                  bot.sites.map((site) => (
                    <Link
                      key={site.id}
                      className="p-0 pl-2"
                      variant="link"
                      href={site.url}
                    >
                      {site.url}
                    </Link>
                  ))}

                <Link href={`/bot/${bot.id}/chat`}>Chat</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
