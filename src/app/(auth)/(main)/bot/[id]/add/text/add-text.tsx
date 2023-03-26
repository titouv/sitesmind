"use client";

import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddText({ botId }: { botId: string }) {
  const { supabase, session } = useSupabase();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function ingest() {
    setLoading(true);
    if (!session) return;

    const { data: site, error: siteError } = await supabase
      .from("sources")
      .insert({ meta: text, bot_id: botId })
      .select()
      .single();

    if (siteError) {
      console.error(siteError);
      setError(siteError.message);
      return;
    } else {
      setSiteId(site.id);
      console.log(site.id);
    }

    console.log("body", { url: text, id: botId });

    const url = new URL(
      `/api/bot/${botId}/ingest/text`,
      window.location.origin
    );

    url.searchParams.set("sourceId", site.id.toString());
    url.searchParams.set("fileName", text);
    url.searchParams.set("text", text);

    const response = await fetch(url);
    if (!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }
    const data = await response.json();

    router.push(`/bot/${botId}/chat`);
  }

  return (
    <div className="pt-8">
      {!siteId ? (
        <>
          <Label>Enter the text that you want your bot to know.</Label>
          <div className="mt-2 flex gap-4">
            <Textarea
              placeholder="This is the data that I want my bot to know"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button disabled={!text || loading} onClick={ingest}>
              Create
            </Button>
          </div>
          <ComingSoon />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <div className="flex  flex-col items-center justify-center">
              Generating chatbot from {text}
              <LoadingSpinner />
              <ComingSoon />
            </div>
          ) : error ? (
            <div
              className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              <span className="py-2">The data has been treated</span>

              {data && (
                <Link href={`/bot/${botId}/chat`}>
                  Try the generated chatbot
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
