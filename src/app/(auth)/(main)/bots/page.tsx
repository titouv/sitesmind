import { Title } from "@/components/title";
import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";

// do not cache this page
export const revalidate = 0;
export const runtime = "edge";
export default async function Page() {
  const supabase = createServerComponentClient();

  let { data, error } = await supabase.from("bots").select(`*,
    sources (
      *
    )`);

  console.log("supabase call", { data, error });

  if (error) {
    return <span>Error</span>;
  }
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <Title>Bots</Title>
        {!data || data.length == 0 ? (
          <div className="pt-8">
            <span className="block pb-2">No bots found</span>
            <Link href="/create">Create one</Link>
          </div>
        ) : (
          <ul className="flex max-w-lg flex-col gap-2 pt-8">
            {data.map((bot) => (
              <li
                key={bot.id}
                className="flex items-center justify-between gap-8 rounded-xl border border-slate-200  p-4"
              >
                <span>{bot.name}</span>

                <div className="flex items-center gap-2 ">
                  <span>
                    {Array.isArray(bot.sources) && bot.sources.length}
                    &nbsp;source(s)
                  </span>
                  <Link variant="subtle" href={`/bot/${bot.id}`}>
                    Modify
                  </Link>
                  <Link href={`/bot/${bot.id}/chat`}>Chat</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
