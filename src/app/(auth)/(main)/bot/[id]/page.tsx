import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createServerComponentClient();
  const { data: bot, error: botError } = await supabase
    .from("bots")
    .select()
    .eq("id", id)
    .single();
  if (botError) {
    console.error(botError);
    return <div>Something went wrong</div>;
  }
  if (!bot) {
    return <div>Bot not found</div>;
  }

  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select()
    .eq("bot_id", id);
  if (sourcesError) {
    console.error(sourcesError);
    return <div>Something went wrong</div>;
  }

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Your Bot : {bot.name}
        </h1>

        {/* <ul className="flex max-w-sm flex-col gap-2 pt-8">
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex justify-between gap-8 rounded-xl border-slate-200 p-2 odd:bg-slate-100 even:border"
            >
              <span>{source.meta}</span>
            </li>
          ))}
        </ul> */}
        {sources && sources.length > 0 && (
          <div className="m-4 flex flex-col items-center">
            <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
              Stats
            </h2>
            <div className=" grid gap-8 rounded-xl bg-slate-50  p-4 text-center md:grid-cols-2 md:text-right">
              <div className="flex flex-col items-center gap-2">
                Trained on {sources.length} source(s)
              </div>
            </div>
          </div>
        )}
        <div className="m-4 flex flex-col items-center">
          <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
            {sources.length == 0
              ? "Get Started : add a custom source"
              : "Add sources"}
          </h2>
          <div className=" grid gap-8 rounded-xl bg-slate-50  p-4 text-center md:grid-cols-2 md:text-right">
            <div className="flex flex-col items-center gap-2">
              <Link href={`/bot/${bot.id}/add/site`}>Add from a website</Link>
              <span className="block text-sm text-gray-500">
                Take the content from a website and add it to your bot
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Link href={`/bot/${bot.id}/add/text`}>Add from a text</Link>
              <span className="block text-sm text-gray-500">
                Import a text file manually
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
