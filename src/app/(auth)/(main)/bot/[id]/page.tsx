import { Title } from "@/components/title";
import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";
import { Article, Globe, Paperclip } from "@/components/icons";
export const runtime = "edge";
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
        <Title>{bot.name}</Title>
        <div className="m-4 flex flex-col items-center">
          <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
            {sources.length == 0
              ? "Get Started : add a custom source"
              : "Add sources"}
          </h2>
          <div className="my-8 flex gap-2 rounded-xl  bg-slate-50 p-2 text-center">
            <div className="flex w-1/2 flex-col items-center gap-2 rounded-lg p-2 transition-all hover:bg-slate-200">
              <Globe size={32} />
              <Link href={`/bot/${bot.id}/add/site`}>Add from a website</Link>
              <span className="block text-sm text-gray-500">
                Take the content from a website and add it to your bot
              </span>
            </div>
            <div className="flex w-1/2 flex-col items-center gap-2 rounded-lg p-2 transition-all hover:bg-slate-200">
              <Article size={32} />
              <Link href={`/bot/${bot.id}/add/text`}>Add from a text</Link>
              <span className="block text-sm text-gray-500">
                Import a text file manually
              </span>
            </div>
            <div className="flex w-1/2 flex-col items-center gap-2 rounded-lg p-2 transition-all hover:bg-slate-200">
              <Paperclip size={32} />
              <Link href={`/bot/${bot.id}/add/pdf`}>Add from a PDF</Link>
              <span className="block text-sm text-gray-500">
                Import a PDF file manually
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
